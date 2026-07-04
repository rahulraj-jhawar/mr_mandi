// Zero-dependency mock API for the ShramSetu demo.
// Serves the same routes as the Express backend (/api/*) with realistic
// in-memory seed data, so the frontend is fully populated WITHOUT a database.
// All /api/* requests are rewritten here (see vercel.json) with the real path
// forwarded as the __p query param. State persists only within a warm
// serverless instance — fine for a demo.

const brokers = [
  { id: 1, name: "Ramesh Yadav", agencyName: "Yadav Labour Suppliers", phone: "+91 98351 20034", city: "Patna", state: "Bihar", skillsCovered: ["mason", "carpenter", "unskilled_helper"], laborPoolSize: 120, availableCapacity: 45, rating: 4.7, verified: true },
  { id: 2, name: "Sunil Kumar", agencyName: "Kumar Manpower Services", phone: "+91 94150 88210", city: "Lucknow", state: "Uttar Pradesh", skillsCovered: ["electrician", "plumber", "fitter"], laborPoolSize: 80, availableCapacity: 30, rating: 4.5, verified: true },
  { id: 3, name: "Abdul Rahman", agencyName: "Rahman Contractors", phone: "+91 98300 45521", city: "Kolkata", state: "West Bengal", skillsCovered: ["painter", "mason", "general_labour"], laborPoolSize: 150, availableCapacity: 60, rating: 4.8, verified: true },
  { id: 4, name: "Vijay Singh", agencyName: "Singh Enterprises", phone: "+91 94140 33218", city: "Jaipur", state: "Rajasthan", skillsCovered: ["welder", "bar_bender", "fitter"], laborPoolSize: 90, availableCapacity: 20, rating: 4.3, verified: true },
  { id: 5, name: "Mahesh Patil", agencyName: "Patil Labour Co.", phone: "+91 98220 71190", city: "Mumbai", state: "Maharashtra", skillsCovered: ["mason", "carpenter", "electrician"], laborPoolSize: 200, availableCapacity: 75, rating: 4.6, verified: true },
  { id: 6, name: "Prakash Rao", agencyName: "Rao Workforce", phone: "+91 90000 55123", city: "Hyderabad", state: "Telangana", skillsCovered: ["plumber", "painter", "unskilled_helper"], laborPoolSize: 70, availableCapacity: 25, rating: 4.4, verified: true },
  { id: 7, name: "Karthik Reddy", agencyName: "Reddy Manpower", phone: "+91 98860 22014", city: "Bengaluru", state: "Karnataka", skillsCovered: ["electrician", "fitter", "welder"], laborPoolSize: 110, availableCapacity: 40, rating: 4.5, verified: true },
  { id: 8, name: "Sanjay Mishra", agencyName: "Mishra Labour Group", phone: "+91 94250 66710", city: "Bhopal", state: "Madhya Pradesh", skillsCovered: ["general_labour", "unskilled_helper", "mason"], laborPoolSize: 130, availableCapacity: 55, rating: 4.2, verified: true },
  { id: 9, name: "Deepak Munda", agencyName: "Munda Suppliers", phone: "+91 96170 44523", city: "Ranchi", state: "Jharkhand", skillsCovered: ["bar_bender", "welder", "general_labour"], laborPoolSize: 95, availableCapacity: 35, rating: 4.6, verified: true },
  { id: 10, name: "Anil Nayak", agencyName: "Nayak Contractors", phone: "+91 94370 11205", city: "Bhubaneswar", state: "Odisha", skillsCovered: ["mason", "painter", "unskilled_helper"], laborPoolSize: 85, availableCapacity: 30, rating: 4.4, verified: true },
];

const requirements = [
  { id: 1, builderName: "Rajesh Gupta", companyName: "Gupta Constructions", projectName: "Skyline Towers", siteCity: "Mumbai", siteState: "Maharashtra", skillType: "mason", laborTier: "skilled", workersNeeded: 25, startDate: "2026-07-20", durationDays: 90, wagePerDay: 750, notes: "Highrise residential block", status: "routed", routedBrokerId: 5 },
  { id: 2, builderName: "Neha Sharma", companyName: "Sharma Infra", projectName: "Metro Depot Line 3", siteCity: "Bengaluru", siteState: "Karnataka", skillType: "electrician", laborTier: "skilled", workersNeeded: 15, startDate: "2026-07-15", durationDays: 60, wagePerDay: 900, notes: "Metro electrical fitout", status: "accepted", routedBrokerId: 7 },
  { id: 3, builderName: "Amit Verma", companyName: "Verma Builders", projectName: "Green Villas", siteCity: "Jaipur", siteState: "Rajasthan", skillType: "welder", laborTier: "semi_skilled", workersNeeded: 12, startDate: "2026-08-01", durationDays: 45, wagePerDay: 680, notes: null, status: "routed", routedBrokerId: 4 },
  { id: 4, builderName: "Priya Nair", companyName: "Nair Developers", projectName: "Tech Park Phase 2", siteCity: "Hyderabad", siteState: "Telangana", skillType: "plumber", laborTier: "skilled", workersNeeded: 10, startDate: "2026-07-25", durationDays: 50, wagePerDay: 820, notes: "Commercial plumbing", status: "pending", routedBrokerId: null },
  { id: 5, builderName: "Suresh Iyer", companyName: "Iyer Projects", projectName: "Coastal Highway Pkg 4", siteCity: "Bhubaneswar", siteState: "Odisha", skillType: "general_labour", laborTier: "unskilled", workersNeeded: 40, startDate: "2026-07-10", durationDays: 120, wagePerDay: 520, notes: "Road construction", status: "fulfilled", routedBrokerId: 10 },
  { id: 6, builderName: "Kavita Joshi", companyName: "Joshi Realty", projectName: "Lake View Apartments", siteCity: "Bhopal", siteState: "Madhya Pradesh", skillType: "carpenter", laborTier: "skilled", workersNeeded: 18, startDate: "2026-08-05", durationDays: 75, wagePerDay: 700, notes: null, status: "pending", routedBrokerId: null },
];

const regions = [
  { state: "Bihar", historicalOutflow: 450000, predictedOutflow: 470000, demandIndex: 0.30, supplyIndex: 0.90, stabilityScore: 0.72, trend: "net_source", topSkills: ["mason", "general_labour", "unskilled_helper"] },
  { state: "Uttar Pradesh", historicalOutflow: 520000, predictedOutflow: 540000, demandIndex: 0.40, supplyIndex: 0.88, stabilityScore: 0.68, trend: "net_source", topSkills: ["carpenter", "mason", "electrician"] },
  { state: "West Bengal", historicalOutflow: 380000, predictedOutflow: 390000, demandIndex: 0.45, supplyIndex: 0.82, stabilityScore: 0.70, trend: "net_source", topSkills: ["painter", "mason", "fitter"] },
  { state: "Odisha", historicalOutflow: 290000, predictedOutflow: 300000, demandIndex: 0.35, supplyIndex: 0.80, stabilityScore: 0.66, trend: "net_source", topSkills: ["mason", "bar_bender", "welder"] },
  { state: "Jharkhand", historicalOutflow: 210000, predictedOutflow: 220000, demandIndex: 0.33, supplyIndex: 0.78, stabilityScore: 0.64, trend: "net_source", topSkills: ["bar_bender", "welder", "general_labour"] },
  { state: "Madhya Pradesh", historicalOutflow: 240000, predictedOutflow: 245000, demandIndex: 0.50, supplyIndex: 0.70, stabilityScore: 0.69, trend: "net_source", topSkills: ["general_labour", "mason", "unskilled_helper"] },
  { state: "Rajasthan", historicalOutflow: 180000, predictedOutflow: 175000, demandIndex: 0.55, supplyIndex: 0.60, stabilityScore: 0.75, trend: "balanced", topSkills: ["welder", "fitter", "mason"] },
  { state: "Maharashtra", historicalOutflow: 90000, predictedOutflow: 85000, demandIndex: 0.92, supplyIndex: 0.30, stabilityScore: 0.80, trend: "net_destination", topSkills: ["mason", "carpenter", "electrician"] },
  { state: "Gujarat", historicalOutflow: 70000, predictedOutflow: 68000, demandIndex: 0.90, supplyIndex: 0.35, stabilityScore: 0.82, trend: "net_destination", topSkills: ["welder", "fitter", "plumber"] },
  { state: "Karnataka", historicalOutflow: 80000, predictedOutflow: 78000, demandIndex: 0.88, supplyIndex: 0.40, stabilityScore: 0.79, trend: "net_destination", topSkills: ["electrician", "fitter", "painter"] },
  { state: "Tamil Nadu", historicalOutflow: 95000, predictedOutflow: 92000, demandIndex: 0.85, supplyIndex: 0.42, stabilityScore: 0.81, trend: "net_destination", topSkills: ["carpenter", "mason", "plumber"] },
  { state: "Telangana", historicalOutflow: 60000, predictedOutflow: 62000, demandIndex: 0.87, supplyIndex: 0.38, stabilityScore: 0.78, trend: "net_destination", topSkills: ["plumber", "painter", "electrician"] },
  { state: "Delhi", historicalOutflow: 40000, predictedOutflow: 38000, demandIndex: 0.95, supplyIndex: 0.25, stabilityScore: 0.76, trend: "net_destination", topSkills: ["mason", "carpenter", "painter"] },
];

const BASE_TS = "2026-07-01T09:00:00.000Z";
let nextReqId = 100;
let nextBrokerId = 100;

function brokerName(id) {
  const b = brokers.find((x) => x.id === id);
  return b ? b.name : null;
}

function serializeBroker(b) {
  const routed = requirements.filter((r) => r.routedBrokerId === b.id);
  return {
    id: String(b.id),
    name: b.name,
    agencyName: b.agencyName,
    phone: b.phone,
    city: b.city,
    state: b.state,
    skillsCovered: b.skillsCovered,
    laborPoolSize: b.laborPoolSize,
    availableCapacity: b.availableCapacity,
    rating: b.rating,
    verified: b.verified,
    activeRequirements: routed.filter((r) => ["routed", "accepted"].includes(r.status)).length,
    fulfilledRequirements: routed.filter((r) => r.status === "fulfilled").length,
    createdAt: BASE_TS,
  };
}

function serializeRequirement(r) {
  return {
    id: String(r.id),
    builderName: r.builderName,
    companyName: r.companyName,
    projectName: r.projectName,
    siteCity: r.siteCity,
    siteState: r.siteState,
    skillType: r.skillType,
    laborTier: r.laborTier,
    workersNeeded: r.workersNeeded,
    startDate: r.startDate,
    durationDays: r.durationDays,
    wagePerDay: r.wagePerDay,
    notes: r.notes ?? null,
    status: r.status,
    routedBrokerId: r.routedBrokerId != null ? String(r.routedBrokerId) : null,
    routedBrokerName: r.routedBrokerId != null ? brokerName(r.routedBrokerId) : null,
    createdAt: BASE_TS,
  };
}

// Mirror the backend's auto-routing: same state+skill+capacity, then same state, then any.
function findBestBroker(siteState, skillType, workersNeeded) {
  const byCapacity = (a, b) => b.availableCapacity - a.availableCapacity;
  return (
    brokers.filter((b) => b.state === siteState && b.availableCapacity >= workersNeeded && b.skillsCovered.includes(skillType)).sort(byCapacity)[0] ||
    brokers.filter((b) => b.state === siteState && b.availableCapacity >= workersNeeded).sort(byCapacity)[0] ||
    brokers.filter((b) => b.availableCapacity >= workersNeeded && b.availableCapacity !== 0).sort(byCapacity)[0] ||
    null
  );
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  // The real path is forwarded by the vercel.json rewrite as ?__p=/...
  // Fall back to stripping "/api" from the pathname for direct hits.
  let p = url.searchParams.get("__p");
  if (!p) {
    p = url.pathname;
    const apiIdx = p.indexOf("/api");
    if (apiIdx >= 0) p = p.slice(apiIdx + 4);
  }
  p = p.replace(/\/+$/, "") || "/";
  const method = req.method || "GET";

  if (method === "OPTIONS") return send(res, 204);

  if (p === "/healthz" || p === "/health" || p === "/") return send(res, 200, { status: "ok" });

  if (p === "/requirements") {
    if (method === "GET") {
      const status = url.searchParams.get("status");
      const brokerId = url.searchParams.get("brokerId");
      let rows = requirements.slice();
      if (status) rows = rows.filter((r) => r.status === status);
      if (brokerId) rows = rows.filter((r) => String(r.routedBrokerId) === String(brokerId));
      return send(res, 200, rows.map(serializeRequirement).reverse());
    }
    if (method === "POST") {
      const b = await readBody(req);
      const match = findBestBroker(b.siteState, b.skillType, Number(b.workersNeeded));
      const row = {
        id: nextReqId++,
        builderName: b.builderName, companyName: b.companyName, projectName: b.projectName,
        siteCity: b.siteCity, siteState: b.siteState, skillType: b.skillType, laborTier: b.laborTier,
        workersNeeded: Number(b.workersNeeded), startDate: b.startDate, durationDays: Number(b.durationDays),
        wagePerDay: Number(b.wagePerDay), notes: b.notes ?? null,
        status: match ? "routed" : "pending", routedBrokerId: match ? match.id : null,
      };
      requirements.push(row);
      if (match) match.availableCapacity -= row.workersNeeded;
      return send(res, 201, serializeRequirement(row));
    }
  }

  let m = p.match(/^\/requirements\/([^/]+)$/);
  if (m) {
    const id = Number(m[1]);
    const row = requirements.find((r) => r.id === id);
    if (!row) return send(res, 404, { error: "Requirement not found" });
    if (method === "GET") return send(res, 200, serializeRequirement(row));
    if (method === "PATCH") {
      const b = await readBody(req);
      if (b.status === "declined" && row.status !== "declined" && row.routedBrokerId != null) {
        const br = brokers.find((x) => x.id === row.routedBrokerId);
        if (br) br.availableCapacity += row.workersNeeded;
      }
      row.status = b.status;
      return send(res, 200, serializeRequirement(row));
    }
  }

  if (p === "/brokers") {
    if (method === "GET") {
      const state = url.searchParams.get("state");
      let rows = brokers.slice();
      if (state) rows = rows.filter((b) => b.state === state);
      rows.sort((a, b) => a.name.localeCompare(b.name));
      return send(res, 200, rows.map(serializeBroker));
    }
    if (method === "POST") {
      const b = await readBody(req);
      const row = {
        id: nextBrokerId++, name: b.name, agencyName: b.agencyName, phone: b.phone,
        city: b.city, state: b.state, skillsCovered: b.skillsCovered || [],
        laborPoolSize: Number(b.laborPoolSize), availableCapacity: Number(b.availableCapacity),
        rating: 4.5, verified: true,
      };
      brokers.push(row);
      return send(res, 201, serializeBroker(row));
    }
  }

  m = p.match(/^\/brokers\/([^/]+)$/);
  if (m && method === "GET") {
    const row = brokers.find((b) => b.id === Number(m[1]));
    if (!row) return send(res, 404, { error: "Broker not found" });
    return send(res, 200, serializeBroker(row));
  }

  if (p === "/labor-flow" && method === "GET") {
    const counts = {};
    for (const b of brokers) counts[b.state] = (counts[b.state] || 0) + 1;
    return send(res, 200, regions.slice().sort((a, b) => a.state.localeCompare(b.state)).map((r) => ({
      state: r.state, historicalOutflow: r.historicalOutflow, predictedOutflow: r.predictedOutflow,
      demandIndex: r.demandIndex, supplyIndex: r.supplyIndex, stabilityScore: r.stabilityScore,
      trend: r.trend, topSkills: r.topSkills, activeBrokers: counts[r.state] || 0,
    })));
  }

  if (p === "/dashboard/summary" && method === "GET") {
    return send(res, 200, {
      totalRequirements: requirements.length,
      pendingRequirements: requirements.filter((r) => r.status === "pending").length,
      fulfilledRequirements: requirements.filter((r) => r.status === "fulfilled").length,
      totalBrokers: brokers.length,
      totalLaborPool: brokers.reduce((s, b) => s + b.laborPoolSize, 0),
      totalAvailableCapacity: brokers.reduce((s, b) => s + b.availableCapacity, 0),
      avgRoutingMinutes: 4.5,
    });
  }

  return send(res, 404, { error: "Not found", path: p, method });
};
