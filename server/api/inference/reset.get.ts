import { useEvents } from "~~/server/services/inference";

export default useDefineHandler<{ status: "success" }>(async () => {
  const { resetEvents } = useEvents();

  return apiSuccess(await resetEvents());
});
