import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useListRequirements, RequirementStatus, Requirement } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, HardHat, CalendarDays, Clock, IndianRupee, Briefcase, FileText } from "lucide-react";
import { format } from "date-fns";

export default function BuilderRequirements() {
  const { data: requirements, isLoading } = useListRequirements();

  const getStatusBadge = (status: RequirementStatus) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending Match</Badge>;
      case 'routed': return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Routed to Broker</Badge>;
      case 'accepted': return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Accepted by Broker</Badge>;
      case 'fulfilled': return <Badge variant="secondary" className="bg-green-100 text-green-800">Crew Fulfilled</Badge>;
      case 'declined': return <Badge variant="secondary" className="bg-red-100 text-red-800">Declined</Badge>;
      case 'cancelled': return <Badge variant="outline">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Active Projects</h1>
            <p className="text-muted-foreground mt-1 text-lg">Track and manage your crew requests.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
          </div>
        ) : requirements?.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/10">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No active requirements</h3>
              <p className="text-muted-foreground mb-4">You haven't posted any labour requirements yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {requirements?.map((req: Requirement) => (
              <Card key={req.id} className="bg-white shadow-sm border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4 border-b border-border/40">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs font-semibold tracking-widest uppercase bg-muted/30">
                      {req.skillType.replace('_', ' ')}
                    </Badge>
                    {getStatusBadge(req.status)}
                  </div>
                  <CardTitle className="text-xl">{req.projectName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1 text-sm text-foreground/70">
                    <MapPin className="w-4 h-4" />
                    {req.siteCity}, {req.siteState}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Crew Size</span>
                      <div className="font-semibold flex items-center gap-1.5">
                        <UsersIcon className="w-4 h-4 text-primary" /> {req.workersNeeded} ({req.laborTier})
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Wage / Day</span>
                      <div className="font-semibold flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" /> {req.wagePerDay}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Start Date</span>
                      <div className="font-medium flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        {format(new Date(req.startDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Duration</span>
                      <div className="font-medium flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {req.durationDays} Days
                      </div>
                    </div>
                  </div>

                  {req.routedBrokerName && (
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Assigned Dispatcher</span>
                      <div className="font-medium text-primary flex items-center gap-1.5">
                        <HardHat className="w-4 h-4" /> {req.routedBrokerName}
                      </div>
                    </div>
                  )}

                  {req.notes && (
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <div className="text-sm text-muted-foreground flex gap-2">
                        <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="line-clamp-2">{req.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

// Inline UsersIcon since it wasn't imported from lucide
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}