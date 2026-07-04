import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRequirement, SkillType, LaborTier } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { HardHat, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

const requirementSchema = z.object({
  builderName: z.string().min(2, "Name is required"),
  companyName: z.string().min(2, "Company is required"),
  projectName: z.string().min(2, "Project name is required"),
  siteCity: z.string().min(2, "City is required"),
  siteState: z.string().min(2, "State is required"),
  skillType: z.enum([
    "mason", "carpenter", "electrician", "plumber", "painter", 
    "welder", "bar_bender", "fitter", "unskilled_helper", "general_labour"
  ]),
  laborTier: z.enum(["skilled", "semi_skilled", "unskilled"]),
  workersNeeded: z.coerce.number().min(1, "At least 1 worker needed"),
  startDate: z.string().min(1, "Start date is required"),
  durationDays: z.coerce.number().min(1, "At least 1 day duration"),
  wagePerDay: z.coerce.number().min(0, "Wage cannot be negative"),
  notes: z.string().optional(),
});

type RequirementFormValues = z.infer<typeof requirementSchema>;

export default function PostRequirement() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createRequirement = useCreateRequirement();
  const [routedBroker, setRoutedBroker] = useState<string | null>(null);

  const form = useForm<RequirementFormValues>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      builderName: "",
      companyName: "",
      projectName: "",
      siteCity: "",
      siteState: "",
      skillType: "general_labour",
      laborTier: "unskilled",
      workersNeeded: 10,
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 30,
      wagePerDay: 500,
      notes: "",
    },
  });

  const onSubmit = (data: RequirementFormValues) => {
    createRequirement.mutate(
      { data },
      {
        onSuccess: (result) => {
          setRoutedBroker(result.routedBrokerName || "System Pool");
          toast({
            title: "Requirement Posted",
            description: "Successfully routed to nearest available dispatcher.",
          });
          // After a short delay, redirect
          setTimeout(() => {
            setLocation("/requirements");
          }, 3000);
        },
        onError: () => {
          toast({
            title: "Submission Failed",
            description: "There was an error posting your requirement. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  if (routedBroker) {
    return (
      <Layout>
        <div className="container max-w-screen-md mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full text-center border-primary border-2 shadow-lg">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
                <HardHat className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">Crew Routed Successfully</CardTitle>
              <CardDescription className="text-lg">Your requirement has been dispatched.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="bg-muted/50 p-6 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Assigned Dispatcher</p>
                <p className="text-2xl font-bold text-foreground">{routedBroker}</p>
                <div className="flex justify-center mt-4 text-muted-foreground items-center gap-2 text-sm">
                  <span>System Match</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>Awaiting Confirmation</span>
                </div>
              </div>
              <p className="text-muted-foreground">Redirecting you to active projects...</p>
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
          <p className="text-muted-foreground mt-1 text-lg">Dispatch a new labour request to our verified broker network.</p>
        </div>

        <Card className="bg-white border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter the site and crew specifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="builderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Rajesh Kumar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="L&T Construction" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Metro Phase 2 - Line B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="siteCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site City</FormLabel>
                        <FormControl>
                          <Input placeholder="Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siteState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site State</FormLabel>
                        <FormControl>
                          <Input placeholder="Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="h-px bg-border/50 w-full my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="skillType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select skill" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mason">Mason</SelectItem>
                            <SelectItem value="carpenter">Carpenter</SelectItem>
                            <SelectItem value="electrician">Electrician</SelectItem>
                            <SelectItem value="plumber">Plumber</SelectItem>
                            <SelectItem value="painter">Painter</SelectItem>
                            <SelectItem value="welder">Welder</SelectItem>
                            <SelectItem value="bar_bender">Bar Bender</SelectItem>
                            <SelectItem value="fitter">Fitter</SelectItem>
                            <SelectItem value="unskilled_helper">Unskilled Helper</SelectItem>
                            <SelectItem value="general_labour">General Labour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="laborTier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="skilled">Skilled</SelectItem>
                            <SelectItem value="semi_skilled">Semi-Skilled</SelectItem>
                            <SelectItem value="unskilled">Unskilled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="workersNeeded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workers Count</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wagePerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wage / Day (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Accommodation provided, travel allowance, etc." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={createRequirement.isPending}>
                  {createRequirement.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Dispatching to Network...</>
                  ) : (
                    "Post Requirement & Auto-Route"
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
