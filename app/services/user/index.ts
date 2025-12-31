import { useUserStore } from "@/stores/user";

export const useUserService = () => {
  const { state } = useUserStore();

  const isAuthenticated = computed(() => state.kind === "authenticated");

  const userAvatar = computed(() => {
    if (state.kind === "anonymous") return "/discordapp.png";
    return `https://cdn.discordapp.com/avatars/${state.user.discordId}/${state.user.avatar}.webp?size=512`;
  });

  const userDecoration = computed(() => {
    if (state.kind === "anonymous") return "";
    return `https://cdn.discordapp.com/avatar-decoration-presets/${state.user.decoration}.webp?size=512`;
  });

  const username = computed(() => {
    if (state.kind === "anonymous") return "";
    return state.user.name;
  });

  return {
    userAvatar,
    userDecoration,
    isAuthenticated,
    username,
  };
};
