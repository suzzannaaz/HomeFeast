import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import { getMyProfileApi, updateProfileApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch profile
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const data = await getMyProfileApi(token);

      setName(data.name || "");
      setEmail(data.email || "");
      setLocation(data.location || "");
      setRole(data.role || "");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Update profile
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await updateProfileApi(token, { name, email, location });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      fetchProfile(); // refresh data
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Update failed",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <p className="text-center py-12 text-muted-foreground">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 p-4">
      <div>
        <h2 className="font-display text-2xl font-bold">My Profile</h2>
        <p className="text-muted-foreground">
          Manage your account details
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{name}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={role}
              disabled
              className="capitalize"
            />
          </div>

            <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/user/orders")}
            >
            View My Orders
            </Button>


          {/* Save */}
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}