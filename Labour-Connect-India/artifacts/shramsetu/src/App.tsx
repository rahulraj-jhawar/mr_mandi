import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import BuilderDashboard from "./pages/builder/dashboard";
import BuilderRequirements from "./pages/builder/requirements";
import PostRequirement from "./pages/builder/post-requirement";
import BrokerDashboard from "./pages/broker/dashboard";
import BrokerRegister from "./pages/broker/register";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Builder Routes */}
      <Route path="/" component={BuilderDashboard} />
      <Route path="/requirements" component={BuilderRequirements} />
      <Route path="/post-requirement" component={PostRequirement} />
      
      {/* Broker Routes */}
      <Route path="/broker" component={BrokerDashboard} />
      <Route path="/broker/register" component={BrokerRegister} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
