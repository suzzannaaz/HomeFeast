import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCooksApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ChefHat, MapPin, Clock, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

export default function HomePage() {
  const [cooks, setCooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchCooks = async () => {
      try {
        const data = await getCooksApi();
        setCooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCooks();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredCooks = cooks.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold">HomeFeast</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Delicious home-cooked meals" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <div className="max-w-xl space-y-6">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Home-cooked meals delivered to your door
            </h1>
            <p className="text-lg text-primary-foreground/80 md:text-xl">
              Discover talented home cooks in your neighborhood. Fresh, authentic, made with love — just like home.
            </p>
            <div className="flex gap-3">
              <Button size="lg" asChild className="gap-2 text-base">
                <Link to="/register">
                  Order Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

       {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center space-y-12">
          <div>
            <h2 className="font-display text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Three simple steps to a delicious meal</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Browse Cooks", desc: "Explore home cooks near you by cuisine and ratings" },
              { step: "2", title: "Place Your Order", desc: "Choose a daily, weekly, or monthly meal plan" },
              { step: "3", title: "Enjoy Your Meal", desc: "Get fresh home-cooked food delivered on time" },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-display text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cooks */}
      <section className="py-20">
        <div className="container mx-auto px-4 space-y-10">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold">Featured Cooks</h2>
            <p className="mt-2 text-muted-foreground">Meet some of our top-rated home chefs</p>
          </div>

          {loading ? (
            <p className="text-center py-12">Loading cooks...</p>
          ) : cooks.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No cooks available yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCooks.map((cook) => (
                <Card key={cook._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <ChefHat className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{cook.user?.name}</h3>
                        <Badge variant="secondary">{cook.cuisines?.join(", ")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {cook.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {cook.serviceArea}
                      </span>
                    </div>
                    <StarRating value={Math.round(cook.rating)} readonly />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

             <div className="text-center">
            <Button size="lg" asChild className="gap-2">
              <Link to="/register">
                View All Cooks <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 HomeFeast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}