export type Token = {
    token_type: string;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
};

export interface User {
    id: string;
    username: string;
    global_name: string;
    discriminator: string;
    avatar: string;
    verified: boolean;
    email: string;
    flags: number;
    banner: string;
    accent_color: number;
    premium_type: number;
    public_flags: number;
    avatar_decoration_data: AvatarDecorationData;
    collectibles: Collectibles;
    primary_guild: PrimaryGuild;
}

 interface AvatarDecorationData {
    sku_id: string;
    asset: string;
}

 interface Collectibles {
    nameplate: Nameplate;
}

 interface Nameplate {
    sku_id: string;
    asset: string;
    label: string;
    palette: string;
}

 interface PrimaryGuild {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
}

export enum ChannelType {
    GUILD_TEXT = 0,
    GUILD_VOICE = 2,
}
export interface Channel {
    id: string
    type: ChannelType
    last_message_id: string
    flags: number
    guild_id: string
    name: string
    parent_id: string
    rate_limit_per_user: number
    bitrate: number
    user_limit: number
    rtc_region: string
    position: number
    permission_overwrites: string[]
    nsfw: boolean
  }
  