import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
// tRPC v11 createHydrationHelpers type guard fails with an empty router ({}) because
// AnyRouter extends AppRouter evaluates to true structurally. Cast to bypass until
// the router has at least one procedure.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const caller: any = createCaller(createContext);

export const { trpc: api, HydrateClient } =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  createHydrationHelpers<AppRouter>(caller, getQueryClient);
