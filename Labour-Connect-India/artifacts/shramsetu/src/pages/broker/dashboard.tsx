import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListRequirements, useUpdateRequirementStatus, Requirement, getListRequirementsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Users, CalendarDays, Clock, IndianRupee, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function BrokerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // In a real app, we'd filter by the logged-in broker ID.
  // Here we just fetch all to demonstrate functionality.
  const { data: requirements, isLoading } = useListRequirements();
  const updateStatus = useUpdateRequirementStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: 'accepted' | 'declined' | 'fulfilled') => {
    setProcessingId(id);
    updateStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: (updatedReq) => {
          toast({
            title: `Requirement ${newStatus}`,
            description: `You have marked the requirement as ${newStatus}.`,
          });
          
          // Update cache optimistically
          queryClient.setQueryData(getListRequirementsQueryKey(), (old: Requirement[] | undefined) => 
            old ? old.map(req => req.id === id ? { ...req, status: newStatus } : req) : old
          );
        },
        onError: () => {
          toast({
            title: "Action failed",
            description: "Could not update status. Please try again.",
            variant: "destructive"
          });
        },
        onSettled: () => {
          setProcessingId(null);
        }
      }
    );
  };

  const pendingRequirements = requirements?.filter(r => r.status === 'routed' || r.status === 'pending') || [];
  const activeRequirements = requirements?.filter(r => r.status === 'accepted') || [];

  return (
    <Layout>
      <div className="container max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dispatcher Console</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage incoming crew requests routed to your agency.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              Action Required 
              {pendingRequirements.length > 0 && (
                <Badge variant="destructive" className="rounded-full px-2">{pendingRequirements.length}</Badge>
              )}
            </h2>
            
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ) : pendingRequirements.length === 0 ? (
              <Card className="border-dashed border-2 bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <Briefcase className="w-8 h-8 text-muted-foreground mb-4" />
                  <h3 className="text-md font-semibold">No pending requests</h3>
                  <p className="text-sm text-muted-foreground">You're caught up. New requests routed to you will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pendingRequirements.map((req) => (
                  <RequirementCard 
                    key={req.id} 
                    req={req} 
                    onAccept={() => handleStatusChange(req.id, 'accepted')}
                    onDecline={() => handleStatusChange(req.id, 'declined')}
                    isProcessing={processingId === req.id}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-border/50">
            <h2 className="text-xl font-semibold mb-4">Active Deployments</h2>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ) : activeRequirements.length === 0 ? (
               <p className="text-muted-foreground text-sm italic">No active deployments currently.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeRequirements.map((req) => (
                  <RequirementCard 
                    key={req.id} 
                    req={req} 
                    onFulfill={() => handleStatusChange(req.id, 'fulfilled')}
                    isProcessing={processingId === req.id}
                    isActive
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function RequirementCard({ 
  req, 
  onAccept, 
  onDecline, 
  onFulfill, 
  isProcessing,
  isActive = false
}: { 
  req: Requirement, 
  onAccept?: () => void, 
  onDecline?: () => void,
  onFulfill?: () => void,
  isProcessing: boolean,
  isActive?: boolean
}) {
  return (
    <Card className={`bg-white shadow-sm border-border/50 ${isActive ? 'border-primary/30' : 'border-amber-500/30'} hover:shadow-md transition-all`}>
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs font-semibold tracking-widest uppercase bg-muted/30">
            {req.skillType.replace('_', ' ')}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {format(new Date(req.createdAt), 'MMM dd, HH:mm')}
          </span>
        </div>
        <CardTitle className="text-xl">{req.companyName}</CardTitle>
        <CardDescription className="flex items-center gap-1 mt-1 text-sm text-foreground/70 font-medium">
          {req.projectName}
        </CardDescription>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {req.siteCity}, {req.siteState}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Required</span>
            <div className="font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" /> {req.workersNeeded}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 uppercase">{req.laborTier}</div>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Wage/Day</span>
            <div className="font-semibold flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-muted-foreground" /> {req.wagePerDay}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Starts</span>
            <div className="font-medium flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              {format(new Date(req.startDate), 'MMM dd')}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Duration</span>
            <div className="font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              {req.durationDays}d
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 pb-4 border-t border-border/40 bg-muted/10 gap-2 flex-col sm:flex-row">
        {!isActive ? (
          <>
            <Button 
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onDecline}
              disabled={isProcessing}
            >
              <XCircle className="w-4 h-4 mr-2" /> Decline
            </Button>
            <Button 
              className="w-full"
              onClick={onAccept}
              disabled={isProcessing}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
            </Button>
          </>
        ) : (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={onFulfill}
            disabled={isProcessing}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Fulfilled
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
