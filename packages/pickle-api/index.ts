import express from "express";
import * as trpc from '@trpc/server';
import { z } from 'zod';
import cors from "cors";
import * as trpcExpress from '@trpc/server/adapters/express';

export const appRouter = trpc
  .router()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello1 ${input?.text ?? 'world'}`,
      };
    },
  })
  .query('hello2', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello2 ${input?.text ?? 'world'}`,
      };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;


const app = express();
const port = 8080;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from pickle-api");
});

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}) // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;


app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(port, () => {
  console.log(`pickle-api listening at http://localhost:${port}`);
});
