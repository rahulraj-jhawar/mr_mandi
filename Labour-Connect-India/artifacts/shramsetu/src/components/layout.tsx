import { Link, useLocation } from "wouter";
import { HardHat, Truck, Menu, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isBroker = location.startsWith("/broker");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
          <div className="flex items-center gap-2 mr-8">
            <div className="bg-primary p-1.5 rounded-sm">
              <HardHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <span>Shram</span>
              <span className="text-primary">Setu</span>
            </Link>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            {!isBroker ? (
              <>
                <Link href="/" className={`transition-colors hover:text-foreground/80 ${location === "/" ? "text-foreground" : "text-foreground/60"}`}>
                  Dashboard
                </Link>
                <Link href="/post-requirement" className={`transition-colors hover:text-foreground/80 ${location === "/post-requirement" ? "text-foreground" : "text-foreground/60"}`}>
                  Post Requirement
                </Link>
                <Link href="/requirements" className={`transition-colors hover:text-foreground/80 ${location === "/requirements" ? "text-foreground" : "text-foreground/60"}`}>
                  Active Projects
                </Link>
              </>
            ) : (
              <>
                <Link href="/broker" className={`transition-colors hover:text-foreground/80 ${location === "/broker" ? "text-foreground" : "text-foreground/60"}`}>
                  Dispatcher
                </Link>
                <Link href="/broker/directory" className={`transition-colors hover:text-foreground/80 ${location === "/broker/directory" ? "text-foreground" : "text-foreground/60"}`}>
                  Broker Directory
                </Link>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex bg-muted/50 p-1 rounded-md border border-border/50 items-center">
              <Link href="/">
                <Button variant={!isBroker ? "secondary" : "ghost"} size="sm" className="h-8 rounded-sm font-semibold px-4 cursor-pointer">
                  <Building className="h-4 w-4 mr-2" />
                  Builder View
                </Button>
              </Link>
              <Link href="/broker">
                <Button variant={isBroker ? "secondary" : "ghost"} size="sm" className="h-8 rounded-sm font-semibold px-4 cursor-pointer">
                  <Truck className="h-4 w-4 mr-2" />
                  Broker View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
