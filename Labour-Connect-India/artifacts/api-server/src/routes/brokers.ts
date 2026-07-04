import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, brokersTable, requirementsTable } from "@workspace/db";
import { CreateBrokerBody, GetBrokerParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function serializeBroker(row: typeof brokersTable.$inferSelect) {
  const requirements = await db
    .select()
    .from(requirementsTable)
    .where(eq(requirementsTable.routedBrokerId, row.id));

  const activeRequirements = requirements.filter((r) =>
    ["routed", "accepted"].includes(r.status),
  ).length;
  const fulfilledRequirements = requirements.filter((r) => r.status === "fulfilled").length;

  return {
    id: String(row.id),
    name: row.name,
    agencyName: row.agencyName,
    phone: row.phone,
    city: row.city,
    state: row.state,
    skillsCovered: row.skillsCovered,
    laborPoolSize: row.laborPoolSize,
    availableCapacity: row.availableCapacity,
    rating: row.rating,
    verified: row.verified,
    activeRequirements,
    fulfilledRequirements,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/brokers", async (req, res): Promise<void> => {
  const { state } = req.query as { state?: string };

  const rows = await db
    .select()
    .from(brokersTable)
    .where(state ? eq(brokersTable.state, state) : undefined)
    .orderBy(brokersTable.name);

  const serialized = await Promise.all(rows.map(serializeBroker));
  res.json(serialized);
});

router.post("/brokers", async (req, res): Promise<void> => {
  const parsed = CreateBrokerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(brokersTable).values(parsed.data).returning();
  req.log.info({ brokerId: row!.id }, "Broker registered");
  res.status(201).json(await serializeBroker(row!));
});

router.get("/brokers/:id", async (req, res): Promise<void> => {
  const params = GetBrokerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const id = Number.parseInt(params.data.id, 10);
  if (Number.isNaN(id)) {
    res.status(404).json({ error: "Broker not found" });
    return;
  }

  const [row] = await db.select().from(brokersTable).where(eq(brokersTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Broker not found" });
    return;
  }

  res.json(await serializeBroker(row));
});

export default router;
