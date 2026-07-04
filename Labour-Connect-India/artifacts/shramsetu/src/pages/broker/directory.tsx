import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListBrokers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Star, CheckCircle, Phone, Building2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function BrokerDirectory() {
  const { data: brokers, isLoading } = useListBrokers();

  return (
    <Layout>
      <div className="container max-w-screen-2xl mx-auto p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Broker Directory</h1>
            <p className="text-muted-foreground mt-1 text-lg">Verified dispatchers in the ShramSetu network.</p>
          </div>
          <Link href="/broker/register">
            <Button className="font-semibold">Join Network</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brokers?.map((broker) => (
              <Card key={broker.id} className="bg-white shadow-sm border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    {broker.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                      <Star className="w-4 h-4 fill-amber-500" />
                      {broker.rating.toFixed(1)}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{broker.agencyName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1 text-sm text-foreground/70 font-medium">
                    <Building2 className="w-4 h-4" /> {broker.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {broker.city}, {broker.state}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {broker.phone}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Pool Size</span>
                      <div className="font-semibold flex items-center gap-1.5 text-sm">
                        <Users className="w-4 h-4 text-primary" /> {broker.laborPoolSize}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Available</span>
                      <div className="font-semibold flex items-center gap-1.5 text-sm text-green-600">
                        {broker.availableCapacity}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/40">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">Skills Covered</span>
                    <div className="flex flex-wrap gap-1.5">
                      {broker.skillsCovered.slice(0, 3).map(skill => (
                        <span key={skill} className="text-[10px] px-2 py-1 bg-muted text-muted-foreground rounded-sm font-medium uppercase tracking-wider">
                          {skill.replace('_', ' ')}
                        </span>
                      ))}
                      {broker.skillsCovered.length > 3 && (
                        <span className="text-[10px] px-2 py-1 bg-muted/50 text-muted-foreground rounded-sm font-medium">
                          +{broker.skillsCovered.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
