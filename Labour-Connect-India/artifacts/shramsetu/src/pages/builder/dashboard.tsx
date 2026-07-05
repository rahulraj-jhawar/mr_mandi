import { useListRequirements } from "@workspace/api-client-react";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ClipboardList, HardHat, CheckCircle2, Plus, ArrowRight } from "lucide-react";

export default function BuilderDashboard() {
  const { data: requirements, isLoading } = useListRequirements();

  const counts = useMemo(() => {
    const c = { open: 0, active: 0, fulfilled: 0 };
    (requirements ?? []).forEach((r: any) => {
      if (r.status === "pending") c.open++;
      else if (r.status === "routed" || r.status === "accepted") c.active++;
      else if (r.status === "fulfilled") c.fulfilled++;
    });
    return c;
  }, [requirements]);

  const tiles = [
    { label: "Open Requirements", value: counts.open, hint: "Awaiting a crew match", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Projects", value: counts.active, hint: "Crew assigned, in progress", icon: HardHat, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed", value: counts.fulfilled, hint: "Crew deployed on site", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <Layout>
      <div className="container max-w-screen-lg mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-lg">Your crew requests at a glance.</p>
          </div>
          <Link href="/post-requirement">
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" /> Post a Requirement
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.label} href="/requirements">
                <Card className="bg-white shadow-sm border-border/50 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-11 h-11 rounded-xl ${t.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${t.color}`} />
                    </div>
                    <div className="text-4xl font-bold tracking-tighter">
                      {isLoading ? <Skeleton className="h-10 w-16" /> : t.value}
                    </div>
                    <div className="mt-1 font-semibold text-foreground">{t.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{t.hint}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Link href="/requirements">
          <div className="group flex items-center justify-between rounded-xl border border-border/50 bg-white px-6 py-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
            <div>
              <div className="font-semibold text-foreground">View all active projects</div>
              <div className="text-sm text-muted-foreground">Track status and contact labour agents for every crew request.</div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </Layout>
  );
}
