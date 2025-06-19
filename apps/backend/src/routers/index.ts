import { router } from "../trpc.ts";
import { userRouter } from "./user.ts";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
