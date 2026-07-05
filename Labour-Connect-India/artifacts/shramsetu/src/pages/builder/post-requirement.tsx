import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRequirement } from "@workspace/api-client-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { HardHat, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const SKILLS: [string, string][] = [
  ["mason", "Mason"],
  ["carpenter", "Carpenter"],
  ["electrician", "Electrician"],
  ["plumber", "Plumber"],
  ["painter", "Painter"],
  ["welder", "Welder"],
  ["bar_bender", "Bar Bender"],
  ["fitter", "Fitter"],
  ["unskilled_helper", "Unskilled Helper"],
  ["general_labour", "General Labour"],
];

const TIERS: [string, string][] = [
  ["skilled", "Skilled"],
  ["semi_skilled", "Semi-Skilled"],
  ["unskilled", "Unskilled"],
];

const skillLabel = (v: string) => SKILLS.find((s) => s[0] === v)?.[1] ?? v;
const tierLabel = (v: string) => TIERS.find((t) => t[0] === v)?.[1] ?? v;

const crewSchema = z.object({
  workersNeeded: z.coerce.number().min(1, "Min 1"),
  skillType: z.enum([
    "mason", "carpenter", "electrician", "plumber", "painter",
    "welder", "bar_bender", "fitter", "unskilled_helper", "general_labour",
  ]),
  laborTier: z.enum(["skilled", "semi_skilled", "unskilled"]),
  wagePerDay: z.coerce.number().min(0, "≥ 0"),
});

const requirementSchema = z.object({
  builderName: z.string().min(2, "Name is required"),
  companyName: z.string().min(2, "Company is required"),
  projectName: z.string().min(2, "Project name is required"),
  siteAddress: z.string().optional(),
  siteCity: z.string().min(2, "City is required"),
  siteState: z.string().min(2, "State is required"),
  startDate: z.string().min(1, "Start date is required"),
  durationDays: z.coerce.number().min(1, "At least 1 day duration"),
  notes: z.string().optional(),
  crews: z.array(crewSchema).min(1, "Add at least one crew line"),
});

type RequirementFormValues = z.infer<typeof requirementSchema>;

export default function PostRequirement() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createRequirement = useCreateRequirement();
  const [posted, setPosted] = useState<any[] | null>(null);
  const [leaving, setLeaving] = useState(false);

  const form = useForm<RequirementFormValues>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      builderName: "",
      companyName: "",
      projectName: "",
      siteAddress: "",
      siteCity: "",
      siteState: "",
      startDate: new Date().toISOString().split("T")[0],
      durationDays: 30,
      notes: "",
      crews: [{ workersNeeded: 10, skillType: "general_labour", laborTier: "unskilled", wagePerDay: 500 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "crews" });

  const onSubmit = async (data: RequirementFormValues) => {
    try {
      const results = await Promise.all(
        data.crews.map((crew) =>
          createRequirement.mutateAsync({
            data: {
              builderName: data.builderName,
              companyName: data.companyName,
              projectName: data.projectName,
              siteAddress: data.siteAddress,
              siteCity: data.siteCity,
              siteState: data.siteState,
              skillType: crew.skillType,
              laborTier: crew.laborTier,
              workersNeeded: crew.workersNeeded,
              wagePerDay: crew.wagePerDay,
              startDate: data.startDate,
              durationDays: data.durationDays,
              notes: data.notes,
            },
          })
        )
      );
      setPosted(results);
      toast({
        title: `${results.length} crew line${results.length > 1 ? "s" : ""} posted`,
        description: "Routed to the nearest available labour agents.",
      });
      setTimeout(() => setLeaving(true), 9300);
      setTimeout(() => setLocation("/requirements"), 10000);
    } catch {
      toast({
        title: "Submission Failed",
        description: "There was an error posting your requirements. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (posted) {
    const totalWorkers = posted.reduce((s, r) => s + (r.workersNeeded ?? 0), 0);
    return (
      <Layout>
        <div className="container max-w-screen-md mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
          <Card className={`w-full text-center border-primary border-2 shadow-lg ${leaving ? "animate-out fade-out-0 zoom-out-95 duration-700 fill-mode-forwards" : "animate-in fade-in-0 zoom-in-95 duration-700"}`}>
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
                <HardHat className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">{posted.length} Crew Line{posted.length > 1 ? "s" : ""} Posted</CardTitle>
              <CardDescription className="text-lg">
                {totalWorkers} workers requested for {posted[0]?.projectName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-8 text-left">
              {posted.map((r, i) => (
                <div key={i} className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border border-border/50">
                  <div>
                    <p className="font-semibold text-foreground">
                      {r.workersNeeded} × {skillLabel(r.skillType)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">{tierLabel(r.laborTier)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Labour Agent</p>
                    <p className="font-medium text-primary">{r.routedBrokerName || "Pending Match"}</p>
                  </div>
                </div>
              ))}
              <p className="text-muted-foreground text-center pt-2">Redirecting you to active projects...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-screen-md mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Post Requirement</h1>
          <p className="text-muted-foreground mt-1 text-lg">Request one or more crews for a project in a single go.</p>
        </div>

        <Card className="bg-white border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter the site details, then add each crew you need.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="builderName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Rajesh Kumar" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl><Input placeholder="L&T Construction" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="projectName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl><Input placeholder="Metro Phase 2 - Line B" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="siteAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Address</FormLabel>
                    <FormControl><Input placeholder="Plot 42, Sector 5, near Andheri Metro station" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="siteCity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site City</FormLabel>
                      <FormControl><Input placeholder="Mumbai" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="siteState" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site State</FormLabel>
                      <FormControl><Input placeholder="Maharashtra" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="h-px bg-border/50 w-full" />

                {/* Repeatable crew lines */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-base font-medium">Crew Required</div>
                      <p className="text-sm text-muted-foreground">Add a line for each type of worker you need.</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() => append({ workersNeeded: 10, skillType: "general_labour", laborTier: "unskilled", wagePerDay: 500 })}
                    >
                      <Plus className="w-4 h-4" /> Add Crew
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {/* column headers (desktop) */}
                    <div className="hidden sm:grid sm:grid-cols-[5.5rem_1fr_9rem_7rem_2.5rem] gap-3 px-3 text-xs font-medium text-muted-foreground">
                      <span>Workers</span>
                      <span>Skill Type</span>
                      <span>Tier</span>
                      <span>Wage/Day (₹)</span>
                      <span />
                    </div>
                    {fields.map((row, index) => (
                      <div key={row.id} className="grid grid-cols-1 sm:grid-cols-[5.5rem_1fr_9rem_7rem_2.5rem] gap-3 sm:items-start rounded-lg border border-border/50 bg-muted/20 p-3">
                        <FormField control={form.control} name={`crews.${index}.workersNeeded`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:hidden">Workers</FormLabel>
                            <FormControl><Input type="number" min={1} placeholder="No." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`crews.${index}.skillType`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:hidden">Skill Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select skill" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {SKILLS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`crews.${index}.laborTier`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:hidden">Tier</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {TIERS.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`crews.${index}.wagePerDay`} render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs sm:hidden">Wage/Day (₹)</FormLabel>
                            <FormControl><Input type="number" min={0} placeholder="₹" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive justify-self-start"
                          disabled={fields.length === 1}
                          onClick={() => remove(index)}
                          aria-label="Remove crew line"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/50 w-full" />

                {/* Shared logistics for all crew lines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="durationDays" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Accommodation provided, travel allowance, etc." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full" disabled={createRequirement.isPending}>
                  {createRequirement.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Dispatching to Network...</>
                  ) : (
                    `Post ${fields.length} Crew Line${fields.length > 1 ? "s" : ""} & Auto-Route`
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
