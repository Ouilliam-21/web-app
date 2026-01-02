import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ message: string }>(async () => {
  const { stopGPU } = useDigitalOcean();
  await stopGPU();
  return apiSuccess({ message: "GPU stopped" });
});
