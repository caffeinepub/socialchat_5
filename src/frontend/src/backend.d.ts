import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ConversationId = bigint;
export type Timestamp = bigint;
export interface ChannelMessage {
    content: string;
    channelId: ChannelId;
    messageId: MessageId;
    sender: ProfileId;
    timestamp: Timestamp;
}
export type ChannelId = bigint;
export type MessageId = bigint;
export type ProfileId = Principal;
export interface Channel {
    creator: ProfileId;
    channelId: ChannelId;
    name: string;
    description: string;
}
export interface UserProfile {
    bio: string;
    status: Status;
    username: string;
    profileId: Principal;
    avatarUrl: string;
}
export interface DirectMessage {
    content: string;
    messageId: MessageId;
    recipient: ProfileId;
    sender: ProfileId;
    timestamp: Timestamp;
}
export enum Status {
    away = "away",
    offline = "offline",
    online = "online"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChannel(name: string, description: string): Promise<ChannelId>;
    getAllChannels(): Promise<Array<Channel>>;
    getAllOnlineUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChannelMembers(channelId: ChannelId): Promise<Array<ProfileId>>;
    getChannelMessages(channelId: ChannelId, limit: bigint): Promise<Array<ChannelMessage>>;
    getDirectMessages(conversationId: ConversationId, limit: bigint): Promise<Array<DirectMessage>>;
    getPinnedMessages(channelId: ChannelId): Promise<Array<ChannelMessage>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    joinChannel(channelId: ChannelId): Promise<void>;
    pinMessage(channelId: ChannelId, messageId: MessageId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendDirectMessage(recipient: ProfileId, content: string): Promise<void>;
    sendMessage(channelId: ChannelId, content: string): Promise<void>;
    updateStatus(user: Principal, status: Status): Promise<void>;
}
