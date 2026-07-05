import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListRequirements, useUpdateRequirementStatus, Requirement, getListRequirementsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Users, CalendarDays, Clock, IndianRupee, CheckCircle2, XCircle, Briefcase, Phone } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const EMPTY: Record<string, { title: string; desc: string }> = {
  action: { title: "No pending requests", desc: "You're caught up. New requests routed to you will appear here." },
  accepted: { title: "No accepted bids yet", desc: "Requests you accept will show up here until the crew is delivered." },
  fulfilled: { title: "No delivered crews yet", desc: "Jobs you mark as delivered will appear here as a record." },
};

export default function BrokerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // In a real app, we'd filter by the logged-in broker ID.
  // Here we just fetch all to demonstrate functionality.
  const { data: requirements, isLoading } = useListRequirements();
  const updateStatus = useUpdateRequirementStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [tab, setTab] = useState("action");

  // On accept: show a reassurance overlay on the tile, then move it to Accepted Bids.
  const handleAccept = (id: string) => {
    setConfirmingId(id);
    setTimeout(() => {
      handleStatusChange(id, 'accepted');
      setConfirmingId(null);
    }, 2500);
  };

  const handleStatusChange = (id: string, newStatus: 'accepted' | 'declined' | 'fulfilled') => {
    setProcessingId(id);
    updateStatus.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({
            title: `Requirement ${newStatus}`,
            description: `You have marked the requirement as ${newStatus}.`,
          });
          queryClient.setQueryData(getListRequirementsQueryKey(), (old: Requirement[] | undefined) =>
            old ? old.map(req => req.id === id ? { ...req, status: newStatus } : req) : old
          );
        },
        onError: () => {
          toast({ title: "Action failed", description: "Could not update status. Please try again.", variant: "destructive" });
        },
        onSettled: () => setProcessingId(null),
      }
    );
  };

  const action = requirements?.filter(r => r.status === 'routed' || r.status === 'pending') || [];
  const accepted = requirements?.filter(r => r.status === 'accepted') || [];
  const fulfilled = requirements?.filter(r => r.status === 'fulfilled') || [];

  const TABS = [
    { key: "action", label: "Action Required", list: action },
    { key: "accepted", label: "Accepted Bids", list: accepted },
    { key: "fulfilled", label: "Fulfilled", list: fulfilled },
  ];
  const current = TABS.find(t => t.key === tab) ?? TABS[0];

  return (
    <Layout>
      <div className="container max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dispatcher Console</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage incoming crew requests routed to your agency.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            {TABS.map(t => (
              <TabsTrigger key={t.key} value={t.key} className="gap-1.5">
                {t.label}
                <span className="text-xs opacity-60">{t.list.length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-72 w-full rounded-lg" />)}
          </div>
        ) : current.list.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/10">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Briefcase className="w-8 h-8 text-muted-foreground mb-4" />
              <h3 className="text-md font-semibold">{EMPTY[tab].title}</h3>
              <p className="text-sm text-muted-foreground">{EMPTY[tab].desc}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 items-start">
            {current.list.map((req) => (
              <RequirementCard
                key={req.id}
                req={req}
                onAccept={() => handleAccept(req.id)}
                onDecline={() => handleStatusChange(req.id, 'declined')}
                onFulfill={() => handleStatusChange(req.id, 'fulfilled')}
                isProcessing={processingId === req.id}
                confirming={confirmingId === req.id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const skillLabel = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function compactINR(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function RequirementCard({
  req,
  onAccept,
  onDecline,
  onFulfill,
  isProcessing,
  confirming = false,
}: {
  req: Requirement,
  onAccept?: () => void,
  onDecline?: () => void,
  onFulfill?: () => void,
  isProcessing: boolean,
  confirming?: boolean,
}) {
  const border = req.status === 'accepted' ? 'border-primary/30' : req.status === 'fulfilled' ? 'border-green-500/30' : 'border-amber-500/30';
  return (
    <Card className={`relative overflow-hidden bg-white shadow-sm border-border/50 ${border} hover:shadow-md transition-all`}>
      {confirming && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/95 backdrop-blur-sm text-center p-6 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-lg text-foreground">Bid Accepted</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-[16rem]">
              {req.companyName} will contact you shortly to coordinate the crew.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Phone className="w-3.5 h-3.5" /> Keep your phone handy
          </div>
        </div>
      )}
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <CardTitle className="text-xl truncate">{req.companyName}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1 text-sm text-foreground/70 font-medium truncate">
              {req.projectName}
            </CardDescription>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              {req.siteCity}, {req.siteState}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Est. Revenue</div>
            <div className="text-2xl font-extrabold text-green-700 leading-tight">
              {compactINR(req.durationDays * req.workersNeeded * req.wagePerDay)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-y-5 gap-x-2 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Required</span>
            <div className="font-bold text-base flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary shrink-0" /> {req.workersNeeded} × {skillLabel(req.skillType)}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Wage / Day</span>
            <div className="font-bold text-base flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4 text-muted-foreground shrink-0" /> {req.wagePerDay}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Starts</span>
            <div className="font-semibold text-base flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
              {format(new Date(req.startDate), 'MMM dd, yyyy')}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Duration</span>
            <div className="font-semibold text-base flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              {req.durationDays} days
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 pb-4 border-t border-border/40 bg-muted/10 gap-2 flex-col sm:flex-row">
        {req.status === 'accepted' ? (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={onFulfill}
            disabled={isProcessing}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Crew Delivered
          </Button>
        ) : req.status === 'fulfilled' ? (
          <div className="w-full flex items-center justify-center gap-2 text-green-700 font-semibold text-sm py-1">
            <CheckCircle2 className="w-4 h-4" /> Crew Delivered
          </div>
        ) : (
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
        )}
      </CardFooter>
    </Card>
  );
}
