import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, requirementsTable, brokersTable } from "@workspace/db";
import {
  CreateRequirementBody,
  UpdateRequirementStatusParams,
  UpdateRequirementStatusBody,
  GetRequirementParams,
} from "@workspace/api-zod";
import { findBestBroker } from "../lib/routing";

const router: IRouter = Router();

async function serializeRequirement(row: typeof requirementsTable.$inferSelect) {
  let routedBrokerName: string | null = null;
  if (row.routedBrokerId != null) {
    const [broker] = await db
      .select()
      .from(brokersTable)
      .where(eq(brokersTable.id, row.routedBrokerId));
    routedBrokerName = broker?.name ?? null;
  }
  return {
    id: String(row.id),
    builderName: row.builderName,
    companyName: row.companyName,
    projectName: row.projectName,
    siteCity: row.siteCity,
    siteState: row.siteState,
    skillType: row.skillType,
    laborTier: row.laborTier,
    workersNeeded: row.workersNeeded,
    startDate: row.startDate,
    durationDays: row.durationDays,
    wagePerDay: row.wagePerDay,
    notes: row.notes,
    status: row.status,
    routedBrokerId: row.routedBrokerId != null ? String(row.routedBrokerId) : null,
    routedBrokerName,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/requirements", async (req, res): Promise<void> => {
  const { status, brokerId } = req.query as { status?: string; brokerId?: string };

  const conditions = [];
  if (status) {
    conditions.push(eq(requirementsTable.status, status));
  }
  if (brokerId) {
    const parsedBrokerId = Number.parseInt(brokerId, 10);
    if (!Number.isNaN(parsedBrokerId)) {
      conditions.push(eq(requirementsTable.routedBrokerId, parsedBrokerId));
    }
  }

  const rows = await db
    .select()
    .from(requirementsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(requirementsTable.createdAt);

  const serialized = await Promise.all(rows.map(serializeRequirement));
  res.json(serialized.reverse());
});

router.post("/requirements", async (req, res): Promise<void> => {
  const parsed = CreateRequirementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const match = await findBestBroker(
    parsed.data.siteState,
    parsed.data.skillType,
    parsed.data.workersNeeded,
  );

  const { startDate, ...rest } = parsed.data;
  const startDateStr =
    startDate instanceof Date ? startDate.toISOString().slice(0, 10) : startDate;

  const [row] = await db
    .insert(requirementsTable)
    .values({
      ...rest,
      startDate: startDateStr,
      status: match ? "routed" : "pending",
      routedBrokerId: match ? match.id : null,
    })
    .returning();

  if (match) {
    await db
      .update(brokersTable)
      .set({ availableCapacity: match.availableCapacity - parsed.data.workersNeeded })
      .where(eq(brokersTable.id, match.id));
  }

  req.log.info({ requirementId: row!.id, routedBrokerId: match?.id ?? null }, "Requirement created and routed");
  res.status(201).json(await serializeRequirement(row!));
});

router.get("/requirements/:id", async (req, res): Promise<void> => {
  const params = GetRequirementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const id = Number.parseInt(params.data.id, 10);
  if (Number.isNaN(id)) {
    res.status(404).json({ error: "Requirement not found" });
    return;
  }

  const [row] = await db.select().from(requirementsTable).where(eq(requirementsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Requirement not found" });
    return;
  }

  res.json(await serializeRequirement(row));
});

router.patch("/requirements/:id", async (req, res): Promise<void> => {
  const params = UpdateRequirementStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateRequirementStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const id = Number.parseInt(params.data.id, 10);
  if (Number.isNaN(id)) {
    res.status(404).json({ error: "Requirement not found" });
    return;
  }

  const [existing] = await db.select().from(requirementsTable).where(eq(requirementsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Requirement not found" });
    return;
  }

  const [row] = await db
    .update(requirementsTable)
    .set({ status: parsed.data.status })
    .where(eq(requirementsTable.id, id))
    .returning();

  if (
    parsed.data.status === "declined" &&
    existing.status !== "declined" &&
    existing.routedBrokerId != null
  ) {
    const [broker] = await db
      .select()
      .from(brokersTable)
      .where(eq(brokersTable.id, existing.routedBrokerId));
    if (broker) {
      await db
        .update(brokersTable)
        .set({ availableCapacity: broker.availableCapacity + existing.workersNeeded })
        .where(eq(brokersTable.id, broker.id));
    }
  }

  res.json(await serializeRequirement(row!));
});

export default router;
