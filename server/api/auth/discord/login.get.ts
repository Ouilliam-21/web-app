export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig();

  return sendRedirect(event, runtimeConfig.discordCallbackUrl, 302);
});
