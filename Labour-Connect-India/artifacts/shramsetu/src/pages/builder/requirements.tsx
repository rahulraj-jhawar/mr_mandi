import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListRequirements } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, HardHat, Phone, ChevronDown, Building2, Users, Briefcase, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";

const label = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  pending: { label: "Pending Match", cls: "bg-amber-100 text-amber-800", dot: "bg-amber-400" },
  routed: { label: "Routed to Agent", cls: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
  accepted: { label: "Accepted", cls: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
  fulfilled: { label: "Fulfilled", cls: "bg-green-100 text-green-800", dot: "bg-green-500" },
  declined: { label: "Declined", cls: "bg-red-100 text-red-800", dot: "bg-red-500" },
  cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-700", dot: "bg-gray-400" },
};
const statusMeta = (s: string) => STATUS_META[s] ?? { label: s, cls: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };

const STAGES = [
  { key: "all", label: "All", match: (_p: any) => true },
  { key: "open", label: "Open", match: (p: any) => p.counts.pending > 0 },
  { key: "active", label: "Active", match: (p: any) => p.counts.active > 0 },
  { key: "completed", label: "Completed", match: (p: any) => p.allDone },
  { key: "declined", label: "Declined", match: (p: any) => p.counts.declined > 0 },
];

// Per-line predicate so an expanded project only shows the lines for the active stage.
const LINE_MATCH: Record<string, (s: string) => boolean> = {
  all: () => true,
  open: (s) => s === "pending",
  active: (s) => s === "routed" || s === "accepted",
  completed: (s) => s === "fulfilled",
  declined: (s) => s === "declined" || s === "cancelled",
};

export default function BuilderRequirements() {
  const { data: requirements, isLoading } = useListRequirements();
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const projects = useMemo(() => {
    const map = new Map<string, any>();
    (requirements ?? []).forEach((r: any) => {
      const key = `${r.companyName}|${r.projectName}|${r.siteCity}|${r.siteState}`;
      if (!map.has(key)) {
        map.set(key, { key, projectName: r.projectName, companyName: r.companyName, siteCity: r.siteCity, siteState: r.siteState, lines: [] });
      }
      map.get(key).lines.push(r);
    });
    return Array.from(map.values()).map((p) => {
      const counts = { fulfilled: 0, active: 0, pending: 0, declined: 0 };
      p.lines.forEach((l: any) => {
        if (l.status === "fulfilled") counts.fulfilled++;
        else if (l.status === "routed" || l.status === "accepted") counts.active++;
        else if (l.status === "pending") counts.pending++;
        else counts.declined++;
      });
      const totalWorkers = p.lines.reduce((s: number, l: any) => s + l.workersNeeded, 0);
      const allDone = counts.fulfilled === p.lines.length;
      let overall;
      if (allDone) overall = { label: "Completed", cls: "bg-green-100 text-green-800" };
      else if (counts.active > 0) overall = { label: "In Progress", cls: "bg-blue-100 text-blue-800" };
      else if (counts.pending > 0) overall = { label: "Sourcing", cls: "bg-amber-100 text-amber-800" };
      else overall = { label: "Needs Attention", cls: "bg-red-100 text-red-800" };
      return { ...p, counts, totalWorkers, allDone, overall };
    });
  }, [requirements]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    STAGES.forEach((s) => { c[s.key] = projects.filter(s.match).length; });
    return c;
  }, [projects]);

  const stage = STAGES.find((s) => s.key === tab) ?? STAGES[0];
  const filtered = projects.filter(stage.match);

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Active Projects</h1>
          <p className="text-muted-foreground mt-1 text-lg">Each project, with the status of every crew line inside it.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            {STAGES.map((s) => (
              <TabsTrigger key={s.key} value={s.key} className="gap-1.5">
                {s.label}
                <span className="text-xs opacity-60">{counts[s.key] ?? 0}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-52 w-full rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/10">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">
                {projects.length ? `No ${stage.label.toLowerCase()} projects` : "No active projects"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {projects.length ? "Nothing in this stage right now." : "Post a requirement to get started."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-start">
            {filtered.map((p) => {
              const isOpen = !!open[p.key];
              const visibleLines = p.lines.filter((l: any) => (LINE_MATCH[tab] ?? LINE_MATCH.all)(l.status));
              return (
                <Card key={p.key} className="bg-white shadow-sm border-border/50 hover:shadow-md transition-shadow overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [p.key]: !o[p.key] }))}
                    className="w-full text-left"
                    aria-expanded={isOpen}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <CardTitle className="text-xl truncate">{p.projectName}</CardTitle>
                          <div className="flex items-center gap-1 mt-1 text-sm text-foreground/70">
                            <MapPin className="w-4 h-4 shrink-0" /> {p.siteCity}, {p.siteState}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 text-sm text-muted-foreground">
                            <Building2 className="w-3.5 h-3.5 shrink-0" /> {p.companyName}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className={p.overall.cls}>{p.overall.label}</Badge>
                          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                      </div>

                      {/* status dots — one per crew line */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {p.lines.map((l: any) => (
                          <span key={l.id} className={`w-2.5 h-2.5 rounded-full ${statusMeta(l.status).dot}`} title={`${label(l.skillType)} — ${statusMeta(l.status).label}`} />
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground flex items-center gap-3 flex-wrap">
                        <span className="font-medium text-foreground">{p.counts.fulfilled}/{p.lines.length} crew lines fulfilled</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {p.totalWorkers} workers</span>
                      </div>
                    </CardHeader>
                  </button>

                  {isOpen && (
                    <CardContent className="pt-0 space-y-3 border-t border-border/40">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground pt-4">
                        {tab === "all" ? "Crew Lines" : `${stage.label} Crew Lines`}
                      </p>
                      {visibleLines.map((l: any) => {
                        const m = statusMeta(l.status);
                        return (
                          <div key={l.id} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <div className="font-semibold">{l.workersNeeded} × {label(l.skillType)}</div>
                                <div className="text-sm text-muted-foreground">{label(l.laborTier)} · ₹{l.wagePerDay}/day</div>
                              </div>
                              <Badge variant="secondary" className={m.cls}>{m.label}</Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {format(new Date(l.startDate), "MMM dd, yyyy")}</span>
                              <span>{l.durationDays} days</span>
                            </div>
                            {l.status === "declined" || l.status === "cancelled" ? (
                              <div className="mt-2 pt-2 border-t border-border/40 text-sm text-muted-foreground">
                                {l.status === "declined" ? "Declined by agent — needs re-routing" : "Cancelled"}
                              </div>
                            ) : l.routedBrokerName ? (
                              <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-primary min-w-0">
                                  <HardHat className="w-4 h-4 shrink-0" /> <span className="truncate">{l.routedBrokerName}</span>
                                </div>
                                {l.routedBrokerPhone && (
                                  <a href={`tel:${String(l.routedBrokerPhone).replace(/\s+/g, "")}`} className="flex items-center gap-1 text-sm text-foreground/80 hover:text-primary hover:underline shrink-0">
                                    <Phone className="w-3.5 h-3.5" /> {l.routedBrokerPhone}
                                  </a>
                                )}
                              </div>
                            ) : (
                              <div className="mt-2 pt-2 border-t border-border/40 text-sm text-muted-foreground">Labour agent — awaiting a match…</div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
