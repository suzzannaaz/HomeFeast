import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Package, User, Star } from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Welcome back 👋 Manage your meals and orders
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Browse Cooks */}
        <Card
          onClick={() => navigate("/user/cooks")}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200"
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500 text-white">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-700">Browse Cooks</h3>
              <p className="text-sm text-orange-600">
                Discover home chefs
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card
          onClick={() => navigate("/user/orders")}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200"
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500 text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-700">My Orders</h3>
              <p className="text-sm text-blue-600">
                Track your meals
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile */}
        <Card
          onClick={() => navigate("/user/profile")}
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-green-100 to-green-50 border-green-200"
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-green-700">My Profile</h3>
              <p className="text-sm text-green-600">
                Manage account
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Extra Section (Optional but makes it feel premium) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h4 className="font-semibold text-primary mb-1">
              🍽️ Ready to order?
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Explore delicious homemade meals near you.
            </p>
            <button
              onClick={() => navigate("/user/cooks")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Browse now →
            </button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200">
          <CardContent className="p-6 flex items-center gap-3">
            <Star className="text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-yellow-700">
                Tip: Leave reviews ⭐
              </p>
              <p className="text-xs text-yellow-600">
                Help others choose better cooks
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}