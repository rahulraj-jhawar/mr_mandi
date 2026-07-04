import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, requirementsTable, brokersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [reqAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      pending: sql<number>`count(*) filter (where ${requirementsTable.status} = 'pending')::int`,
      fulfilled: sql<number>`count(*) filter (where ${requirementsTable.status} = 'fulfilled')::int`,
    })
    .from(requirementsTable);

  const [brokerAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      totalLaborPool: sql<number>`coalesce(sum(${brokersTable.laborPoolSize}), 0)::int`,
      totalAvailableCapacity: sql<number>`coalesce(sum(${brokersTable.availableCapacity}), 0)::int`,
    })
    .from(brokersTable);

  res.json({
    totalRequirements: reqAgg?.total ?? 0,
    pendingRequirements: reqAgg?.pending ?? 0,
    fulfilledRequirements: reqAgg?.fulfilled ?? 0,
    totalBrokers: brokerAgg?.total ?? 0,
    totalLaborPool: brokerAgg?.totalLaborPool ?? 0,
    totalAvailableCapacity: brokerAgg?.totalAvailableCapacity ?? 0,
    avgRoutingMinutes: 4.5,
  });
});

export default router;
