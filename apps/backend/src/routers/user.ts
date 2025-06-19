import { z } from "zod";
import { publicProcedure, router } from "../trpc.ts";
import type { User } from "@artemis/types";

// Mock data - replace with actual database
const users: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const userRouter = router({
  list: publicProcedure.query(() => {
    return users;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
      }),
    )
    .mutation(({ input }) => {
      const newUser: User = {
        id: String(users.length + 1),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(newUser);
      return newUser;
    }),
});
