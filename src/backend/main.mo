import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProfileId = Principal;
  type ChannelId = Nat;
  type MessageId = Nat;
  type ConversationId = Nat;

  // User profile type
  type Status = { #online; #away; #offline };
  type Timestamp = Int;

  type UserProfile = {
    username : Text;
    avatarUrl : Text;
    bio : Text;
    status : Status;
    profileId : Principal;
  };

  // Channel type
  type Channel = {
    channelId : ChannelId;
    name : Text;
    description : Text;
    creator : ProfileId;
  };

  // Message type
  type Message = {
    messageId : MessageId;
    sender : ProfileId;
    content : Text;
    timestamp : Timestamp;
  };

  type ChannelMessage = Message and { channelId : ChannelId };
  type DirectMessage = Message and { recipient : ProfileId };

  type PinnedMessages = {
    messages : [ChannelMessage];
  };

  // Persistent storage
  var nextChannelId = 0;
  var nextMessageId = 0;
  var nextConversationId = 0;

  let userProfiles = Map.empty<ProfileId, UserProfile>();
  let channels = Map.empty<ChannelId, Channel>();
  let channelMessages = Map.empty<ChannelId, List.List<ChannelMessage>>();
  let directMessages = Map.empty<ConversationId, List.List<DirectMessage>>();
  let channelMembers = Map.empty<ChannelId, List.List<ProfileId>>();
  let pinnedMessagesMap = Map.empty<ChannelId, PinnedMessages>();
  let userConversations = Map.empty<ProfileId, List.List<ConversationId>>();
  let conversationParticipants = Map.empty<ConversationId, (ProfileId, ProfileId)>();

  // Compare functions for sorting
  module Channel {
    public func compare(a : Channel, b : Channel) : Order.Order {
      Nat.compare(a.channelId, b.channelId);
    };
  };

  module ChannelMessage {
    public func compareByTimestamp(a : ChannelMessage, b : ChannelMessage) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module DirectMessage {
    public func compareByTimestamp(a : DirectMessage, b : DirectMessage) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.username, b.username);
    };
  };

  // Helper functions
  func isChannelMember(channelId : ChannelId, user : ProfileId) : Bool {
    switch (channelMembers.get(channelId)) {
      case (null) { false };
      case (?membership) { membership.contains(user) };
    };
  };

  func isChannelCreator(channelId : ChannelId, user : ProfileId) : Bool {
    switch (channels.get(channelId)) {
      case (null) { false };
      case (?channel) { channel.creator == user };
    };
  };

  // == User profile functions ==

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let updatedProfile : UserProfile = {
      profile with
      profileId = caller;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func updateStatus(user : Principal, status : Status) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update status");
    };
    // Users can only update their own status, unless they are admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own status");
    };
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile = { profile with status };
        userProfiles.add(user, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getAllOnlineUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view online users");
    };
    userProfiles.values().toArray().sort().filter(func(p) { switch (p.status) { case (#online) { true }; case (_) { false } } });
  };

  // == Channel functions ==

  public shared ({ caller }) func createChannel(name : Text, description : Text) : async ChannelId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create channels");
    };
    let newChannelId = nextChannelId;
    nextChannelId += 1;

    let channel : Channel = {
      channelId = newChannelId;
      name;
      description;
      creator = caller;
    };

    channels.add(newChannelId, channel);

    let membership = List.empty<ProfileId>();
    membership.add(caller);
    channelMembers.add(newChannelId, membership);

    channelMessages.add(newChannelId, List.empty<ChannelMessage>());

    newChannelId;
  };

  public shared ({ caller }) func joinChannel(channelId : ChannelId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join channels");
    };
    let membership = switch (channelMembers.get(channelId)) {
      case (null) { Runtime.trap("Channel not found") };
      case (?list) { list };
    };
    if (not membership.contains(caller)) {
      membership.add(caller);
      channelMembers.add(channelId, membership);
    };
  };

  public query ({ caller }) func getAllChannels() : async [Channel] {
    // Any authenticated user (including guests) can list channels
    channels.values().toArray().sort();
  };

  public query ({ caller }) func getChannelMembers(channelId : ChannelId) : async [ProfileId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view channel members");
    };
    switch (channelMembers.get(channelId)) {
      case (null) { Runtime.trap("Channel not found") };
      case (?membership) { membership.toArray() };
    };
  };

  // == Messaging functions ==

  public shared ({ caller }) func sendMessage(channelId : ChannelId, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    // Verify caller is a member of the channel
    if (not isChannelMember(channelId, caller)) {
      Runtime.trap("Unauthorized: Must be a channel member to send messages");
    };
    let newMessageId = nextMessageId;
    nextMessageId += 1;

    let message : ChannelMessage = {
      messageId = newMessageId;
      channelId;
      sender = caller;
      content;
      timestamp = Time.now();
    };

    let messages = switch (channelMessages.get(channelId)) {
      case (null) { Runtime.trap("Channel not found") };
      case (?m) { m };
    };
    messages.add(message);
    channelMessages.add(channelId, messages);
  };

  public query ({ caller }) func getChannelMessages(channelId : ChannelId, limit : Nat) : async [ChannelMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };
    // Verify caller is a member of the channel
    if (not isChannelMember(channelId, caller)) {
      Runtime.trap("Unauthorized: Must be a channel member to view messages");
    };
    switch (channelMessages.get(channelId)) {
      case (null) { Runtime.trap("Channel not found") };
      case (?messages) {
        let messageArray = messages.toArray().sort(ChannelMessage.compareByTimestamp);
        let messageCount = messageArray.size();
        if (messageCount <= limit) {
          messageArray;
        } else {
          let start : Int = if (messageCount > limit) { messageCount - limit } else { 0 };
          let natStart = Int.abs(start);
          messageArray.sliceToArray(natStart, messageCount);
        };
      };
    };
  };

  public shared ({ caller }) func sendDirectMessage(recipient : ProfileId, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send direct messages");
    };
    if (recipient == caller) {
      Runtime.trap("Cannot send direct message to yourself");
    };
    let participants = if (caller.toText() < recipient.toText()) { (caller, recipient) } else {
      (recipient, caller);
    };

    let conversationId = switch (findOrCreateConversation(participants.0, participants.1)) {
      case (null) { Runtime.trap("Cannot find or create conversation") };
      case (?id) { id };
    };

    let newMessageId = nextMessageId;
    nextMessageId += 1;

    let message : DirectMessage = {
      messageId = newMessageId;
      recipient;
      sender = caller;
      content;
      timestamp = Time.now();
    };

    let messages = switch (directMessages.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?msgs) { msgs };
    };
    messages.add(message);
    directMessages.add(conversationId, messages);
  };

  public query ({ caller }) func getDirectMessages(conversationId : ConversationId, limit : Nat) : async [DirectMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view direct messages");
    };
    if (not isParticipant(conversationId, caller)) {
      Runtime.trap("Unauthorized: Not a participant in this conversation");
    };

    switch (directMessages.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?messages) {
        let messageArray = messages.toArray().sort(DirectMessage.compareByTimestamp);
        let messageCount = messageArray.size();
        if (messageCount <= limit) {
          messageArray;
        } else {
          let start : Int = if (messageCount > limit) { messageCount - limit } else { 0 };
          let natStart = Int.abs(start);
          messageArray.sliceToArray(natStart, messageCount);
        };
      };
    };
  };

  // == Pinning functions ==

  public shared ({ caller }) func pinMessage(channelId : ChannelId, messageId : MessageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can pin messages");
    };
    // Only channel creator or admin can pin messages
    if (not isChannelCreator(channelId, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only channel creator or admin can pin messages");
    };
    let message = switch (findChannelMessage(channelId, messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?msg) { msg };
    };
    let pinnedMessages = switch (pinnedMessagesMap.get(channelId)) {
      case (null) { { messages = [message] } };
      case (?existing) {
        { messages = existing.messages.concat([message]) };
      };
    };
    pinnedMessagesMap.add(channelId, pinnedMessages);
  };

  public query ({ caller }) func getPinnedMessages(channelId : ChannelId) : async [ChannelMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view pinned messages");
    };
    // Verify caller is a member of the channel
    if (not isChannelMember(channelId, caller)) {
      Runtime.trap("Unauthorized: Must be a channel member to view pinned messages");
    };
    switch (pinnedMessagesMap.get(channelId)) {
      case (null) { [] };
      case (?p) { p.messages };
    };
  };

  // == Helper functions ==

  func findOrCreateConversation(user1 : ProfileId, user2 : ProfileId) : ?ConversationId {
    // Check if conversation exists
    for ((id, (p1, p2)) in conversationParticipants.entries()) {
      if ((p1 == user1 and p2 == user2) or (p1 == user2 and p2 == user1)) {
        return ?id;
      };
    };

    // Create new conversation
    let newConversationId = nextConversationId;
    nextConversationId += 1;

    conversationParticipants.add(newConversationId, (user1, user2));
    let user1Convos = switch (userConversations.get(user1)) {
      case (null) { List.empty<ConversationId>() };
      case (?convos) { convos };
    };
    let user2Convos = switch (userConversations.get(user2)) {
      case (null) { List.empty<ConversationId>() };
      case (?convos) { convos };
    };
    user1Convos.add(newConversationId);
    user2Convos.add(newConversationId);
    userConversations.add(user1, user1Convos);
    userConversations.add(user2, user2Convos);
    directMessages.add(newConversationId, List.empty<DirectMessage>());
    ?newConversationId;
  };

  func findChannelMessage(channelId : ChannelId, messageId : MessageId) : ?ChannelMessage {
    switch (channelMessages.get(channelId)) {
      case (null) { null };
      case (?messages) {
        let filtered = messages.toArray().filter(func(msg) { msg.messageId == messageId });
        if (filtered.size() > 0) { ?filtered[0] } else { null };
      };
    };
  };

  func isParticipant(conversationId : ConversationId, user : ProfileId) : Bool {
    switch (conversationParticipants.get(conversationId)) {
      case (null) { false };
      case (?participants) { participants.0 == user or participants.1 == user };
    };
  };
};
