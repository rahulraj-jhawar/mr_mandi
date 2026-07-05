import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateBroker, SkillType } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const brokerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  agencyName: z.string().min(2, "Agency name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  skillsCovered: z.array(z.enum([
    "mason", "carpenter", "electrician", "plumber", "painter", 
    "welder", "bar_bender", "fitter", "unskilled_helper", "general_labour"
  ])).min(1, "Select at least one skill type"),
  laborPoolSize: z.coerce.number().min(1, "Must be greater than 0"),
  availableCapacity: z.coerce.number().min(0, "Cannot be negative"),
}).refine(data => data.availableCapacity <= data.laborPoolSize, {
  message: "Available capacity cannot exceed total pool size",
  path: ["availableCapacity"]
});

type BrokerFormValues = z.infer<typeof brokerSchema>;

const SKILL_OPTIONS = [
  { id: "mason", label: "Mason" },
  { id: "carpenter", label: "Carpenter" },
  { id: "electrician", label: "Electrician" },
  { id: "plumber", label: "Plumber" },
  { id: "painter", label: "Painter" },
  { id: "welder", label: "Welder" },
  { id: "bar_bender", label: "Bar Bender" },
  { id: "fitter", label: "Fitter" },
  { id: "unskilled_helper", label: "Unskilled Helper" },
  { id: "general_labour", label: "General Labour" },
] as const;

export default function BrokerRegister() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createBroker = useCreateBroker();

  const form = useForm<BrokerFormValues>({
    resolver: zodResolver(brokerSchema),
    defaultValues: {
      name: "",
      agencyName: "",
      phone: "",
      city: "",
      state: "",
      skillsCovered: [],
      laborPoolSize: 50,
      availableCapacity: 50,
    },
  });

  const onSubmit = (data: BrokerFormValues) => {
    createBroker.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "Registration Successful",
            description: "You have been added to the dispatcher network.",
          });
          setLocation("/broker");
        },
        onError: () => {
          toast({
            title: "Registration Failed",
            description: "There was an error processing your registration.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <Layout>
      <div className="container max-w-screen-md mx-auto p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Register as Dispatcher</h1>
          <p className="text-muted-foreground mt-1 text-lg">Join the verified network to receive labour requirements.</p>
        </div>

        <Card className="bg-white border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Agency Profile</CardTitle>
            <CardDescription>Enter your agency details and capacity capabilities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Arun Singh" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="agencyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agency Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Singh Manpower Solutions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Patna" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Bihar" {...field} />
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
                    name="laborPoolSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Labour Pool</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currently Available</FormLabel>
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
                  name="skillsCovered"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Provided Skill Sets</FormLabel>
                        <CardDescription>Select all types of workers you can supply.</CardDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {SKILL_OPTIONS.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="skillsCovered"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id as any)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-8" disabled={createBroker.isPending}>
                  {createBroker.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                  ) : (
                    "Complete Registration"
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
