import { apiSuccess, useDefineHandler } from "~~/server/utils/handler";

export default useDefineHandler<{ message: string }>(() => {
  const { startGPU } = useDigitalOcean();
  startGPU();
  return apiSuccess({ message: "GPU start initiated" });
});
