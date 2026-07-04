import { useGetDashboardSummary, useListLaborFlowRegions } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout";
import { HardHat, Users, Building, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BuilderDashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: regions, isLoading: loadingRegions } = useListLaborFlowRegions();

  return (
    <Layout>
      <div className="container max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Operational Overview</h1>
          <p className="text-muted-foreground mt-1 text-lg">National labour logistics and sourcing indicators.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Active Requirements</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">
                {loadingSummary ? <Skeleton className="h-9 w-20" /> : summary?.pendingRequirements || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of {loadingSummary ? "-" : summary?.totalRequirements || 0} total requests
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Fulfilled Crew</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">
                {loadingSummary ? <Skeleton className="h-9 w-20" /> : summary?.fulfilledRequirements || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Successfully deployed</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Network Brokers</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">
                {loadingSummary ? <Skeleton className="h-9 w-20" /> : summary?.totalBrokers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Verified dispatcher capacity</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Avg. Routing Time</CardTitle>
              <HardHat className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">
                {loadingSummary ? <Skeleton className="h-9 w-20" /> : `${summary?.avgRoutingMinutes || 0}m`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">System-wide matching speed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-7 bg-white shadow-sm border-border/50">
            <CardHeader className="pb-4 border-b border-border/40">
              <CardTitle className="text-xl flex items-center gap-2">
                Regional Labour Flow Matrix
              </CardTitle>
              <CardDescription>Real-time demand vs. supply indexing across states</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loadingRegions ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/30 text-muted-foreground uppercase">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Region / State</th>
                        <th className="px-6 py-4 font-semibold">Flow Trend</th>
                        <th className="px-6 py-4 font-semibold">Supply Index</th>
                        <th className="px-6 py-4 font-semibold">Demand Index</th>
                        <th className="px-6 py-4 font-semibold">Stability</th>
                        <th className="px-6 py-4 font-semibold">Top Skills</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {regions?.map((region, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{region.state}</td>
                          <td className="px-6 py-4">
                            {region.trend === "net_source" && <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"><TrendingUp className="w-3 h-3 mr-1"/> Net Source</Badge>}
                            {region.trend === "net_destination" && <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"><TrendingDown className="w-3 h-3 mr-1"/> Destination</Badge>}
                            {region.trend === "balanced" && <Badge variant="outline" className="bg-gray-100 text-gray-800"><Minus className="w-3 h-3 mr-1"/> Balanced</Badge>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${region.supplyIndex}%` }} />
                              </div>
                              <span className="text-xs font-medium">{region.supplyIndex}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${region.demandIndex}%` }} />
                              </div>
                              <span className="text-xs font-medium">{region.demandIndex}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{region.stabilityScore}/100</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1 flex-wrap">
                              {region.topSkills.slice(0,2).map(s => (
                                <span key={s} className="text-[10px] px-2 py-1 bg-muted text-muted-foreground rounded-sm font-medium uppercase tracking-wider">{s.replace('_', ' ')}</span>
                              ))}
                              {region.topSkills.length > 2 && <span className="text-[10px] px-1 py-1 text-muted-foreground">+{region.topSkills.length - 2}</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
