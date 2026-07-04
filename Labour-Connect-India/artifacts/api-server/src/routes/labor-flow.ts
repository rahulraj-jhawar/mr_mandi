import { Router, type IRouter } from "express";
import { count } from "drizzle-orm";
import { db, laborFlowRegionsTable, brokersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/labor-flow", async (_req, res): Promise<void> => {
  const rows = await db.select().from(laborFlowRegionsTable).orderBy(laborFlowRegionsTable.state);

  const brokerCounts = await db
    .select({ state: brokersTable.state, activeBrokers: count() })
    .from(brokersTable)
    .groupBy(brokersTable.state);

  const brokerCountByState = new Map(brokerCounts.map((b) => [b.state, b.activeBrokers]));

  const serialized = rows.map((row) => ({
    state: row.state,
    historicalOutflow: row.historicalOutflow,
    predictedOutflow: row.predictedOutflow,
    demandIndex: row.demandIndex,
    supplyIndex: row.supplyIndex,
    stabilityScore: row.stabilityScore,
    trend: row.trend,
    topSkills: row.topSkills,
    activeBrokers: brokerCountByState.get(row.state) ?? 0,
  }));

  res.json(serialized);
});

export default router;
