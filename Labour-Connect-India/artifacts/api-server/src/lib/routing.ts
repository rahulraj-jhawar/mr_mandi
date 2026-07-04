import { and, eq, gte, ne, sql } from "drizzle-orm";
import { db, brokersTable } from "@workspace/db";

export async function findBestBroker(siteState: string, skillType: string, workersNeeded: number) {
  const sameStateMatch = await db
    .select()
    .from(brokersTable)
    .where(
      and(
        eq(brokersTable.state, siteState),
        gte(brokersTable.availableCapacity, workersNeeded),
        sql`${skillType} = ANY(${brokersTable.skillsCovered})`,
      ),
    )
    .orderBy(sql`${brokersTable.availableCapacity} DESC`)
    .limit(1);

  if (sameStateMatch[0]) {
    return sameStateMatch[0];
  }

  const sameStateAny = await db
    .select()
    .from(brokersTable)
    .where(and(eq(brokersTable.state, siteState), gte(brokersTable.availableCapacity, workersNeeded)))
    .orderBy(sql`${brokersTable.availableCapacity} DESC`)
    .limit(1);

  if (sameStateAny[0]) {
    return sameStateAny[0];
  }

  const anyBroker = await db
    .select()
    .from(brokersTable)
    .where(and(gte(brokersTable.availableCapacity, workersNeeded), ne(brokersTable.availableCapacity, 0)))
    .orderBy(sql`${brokersTable.availableCapacity} DESC`)
    .limit(1);

  return anyBroker[0] ?? null;
}
