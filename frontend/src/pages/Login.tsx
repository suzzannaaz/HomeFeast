import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/auth-context.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { UtensilsCrossed } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { loginApi } from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      // console.log("LOGIN RESPONSE:", data);
      // ✅ ensure token is saved BEFORE navigation
      localStorage.setItem("token", data.token);
        // Save user + token
        login(data.user, data.token);

        // Redirect based on role
        const role = data.user.role;

        const dest =
          role === "cook"
            ? "/cook/schedule"
            : role === "admin"
            ? "/admin/"
            : "/user/";

          navigate(dest);
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.message);
      toast({
        title: "Login Failed",
        description: err.message || "Invalid email or password",
        variant: "destructive",
      });
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-3xl">HomeFeast</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
          {/* <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Demo Accounts:</p>
            <p>user@test.com · cook@test.com · admin@test.com</p>
            <p>Any password works</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}