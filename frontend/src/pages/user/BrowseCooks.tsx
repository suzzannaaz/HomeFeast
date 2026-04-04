import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { MapPin, Clock, Search, ChefHat } from "lucide-react";
import { getCooksApi } from "@/lib/api";

interface ICook {
  _id: string;
  user: { name: string };
  bio: string;
  serviceArea: string;
  deliveryTime: string;
  cuisines: string[];
  rating: number;
  isApproved: boolean;
  isAvailable: boolean;
  mealType: "veg" | "non-veg";
  pricePerMeal: number;
  availablePlans: string[];
}

export default function BrowseCooks() {
  const [search, setSearch] = useState("");
  const [cooks, setCooks] = useState<ICook[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
  mealType: "",
  minPrice: "",
  maxPrice: "",
  planType: "",
  cuisine: "",
});


  useEffect(() => {
    const fetchCooks = async () => {
      try {
        const data = await getCooksApi();
        // filter only approved and available cooks
        setCooks(data.filter((c: ICook) => c.isApproved && c.isAvailable));
      } catch (err) {
        console.error("Error fetching cooks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCooks();
  }, []);
 const handleFilterChange = (e: any) => {
  setFilters({ ...filters, [e.target.name]: e.target.value });
};
  // search filter
  const filtered = cooks.filter((c) => {
  const matchesSearch =
    (c.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.serviceArea || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.cuisines || []).join(" ").toLowerCase().includes(search.toLowerCase());

  const matchesMeal =
    !filters.mealType ||
    (c.mealType || "").toLowerCase() === filters.mealType.toLowerCase();

  const matchesPlan =
    !filters.planType ||
    (c.availablePlans || []).some(
      (p) => p.toLowerCase() === filters.planType.toLowerCase()
    );

  const matchesCuisine =
    !filters.cuisine ||
    (c.cuisines || []).some((cu) =>
      cu.toLowerCase().includes(filters.cuisine.toLowerCase())
    );

  const matchesPrice =
    (!filters.minPrice ||
      (c.pricePerMeal || 0) >= Number(filters.minPrice)) &&
    (!filters.maxPrice ||
      (c.pricePerMeal || 0) <= Number(filters.maxPrice));

  return (
    matchesSearch &&
    matchesMeal &&
    matchesPlan &&
    matchesCuisine &&
    matchesPrice
  );
});
  
  if (loading) return <p className="p-5 text-center">Loading cooks...</p>;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold">Browse Cooks</h2>
        <p className="text-muted-foreground">Find your perfect home cook</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, cuisine, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl">
  
  {/* Meal Type */}
  <select name="mealType" onChange={handleFilterChange} className="border p-2 rounded">
    <option value="">All</option>
    <option value="veg">Veg</option>
    <option value="non-veg">Non-Veg</option>
  </select>

  {/* Min Price */}
  <Input
    type="number"
    name="minPrice"
    placeholder="Min Price"
    onChange={handleFilterChange}
  />

  {/* Max Price */}
  <Input
    type="number"
    name="maxPrice"
    placeholder="Max Price"
    onChange={handleFilterChange}
  />

  {/* Plan */}
  <select name="planType" onChange={handleFilterChange} className="border p-2 rounded">
    <option value="">All Plans</option>
    <option value="daily">Daily</option>
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
  </select>

  {/* Cuisine */}
  <Input
    type="text"
    name="cuisine"
    placeholder="Cuisine (e.g Kerala)"
    onChange={handleFilterChange}
  />
</div>

      {/* Cooks grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cook) => (
          <Link key={cook._id} to={`/user/cooks/${cook._id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-5 space-y-3">
                {/* Header: Icon + Name + Cuisine */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ChefHat className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {cook.user?.name || "No Name"}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {cook.cuisines?.join(", ") || "No Cuisine"}
                    </Badge>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground">{cook.bio}</p>

                {/* Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {cook.deliveryTime || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {cook.serviceArea || "N/A"}
                  </span>
                </div>

                {/* Rating */}
                <StarRating value={Math.round(cook.rating || 0)} readonly />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No cooks found matching your search.
        </p>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { StarRating } from "@/components/StarRating";
// import { MapPin, Clock, Search, ChefHat } from "lucide-react";

// const API = "http://localhost:5000/api"; // adjust if needed

// interface ICook {
//   _id: string;
//   user: { name: string };
//   bio: string;
//   serviceArea: string;
//   deliveryTime: string;
//   cuisines: string[];
//   rating: number;
//   isApproved: boolean;
//   isAvailable: boolean;
//   mealType: "veg" | "non-veg";
//   pricePerMeal: number;
//   availablePlans: string[];
// }

// export default function BrowseCooks() {
//   const [search, setSearch] = useState("");
//   const [cooks, setCooks] = useState<ICook[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     mealType: "",
//     minPrice: "",
//     maxPrice: "",
//     planType: "",
//     cuisine: "",
//   });

//   // 🔁 Fetch cooks from backend
//   const fetchCooks = async () => {
//     try {
//       setLoading(true);

//       const query = new URLSearchParams({
//         ...(search && { search }),
//         ...(filters.mealType && { mealType: filters.mealType }),
//         ...(filters.minPrice && { minPrice: filters.minPrice }),
//         ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
//         ...(filters.planType && { planType: filters.planType }),
//         ...(filters.cuisine && { cuisine: filters.cuisine }),
//       }).toString();

//       const res = await fetch(`${API}/cooks/filter?${query}`);
//       const data = await res.json();

//       setCooks(data);
//     } catch (err) {
//       console.error("Error fetching cooks:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔄 Trigger API on filter/search change
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchCooks();
//     }, 400); // debounce

//     return () => clearTimeout(delay);
//   }, [search, filters]);

//   const handleFilterChange = (e: any) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   if (loading) return <p className="p-5 text-center">Loading cooks...</p>;

//   return (
//     <div className="space-y-6 p-4">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold">Browse Cooks</h2>
//         <p className="text-muted-foreground">
//           Find your perfect home cook
//         </p>
//       </div>

//       {/* Search */}
//       <div className="relative max-w-md">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search by location or cuisine..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="pl-10"
//         />
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl">
//         <select name="mealType" onChange={handleFilterChange} className="border p-2 rounded">
//           <option value="">All</option>
//           <option value="veg">Veg</option>
//           <option value="non-veg">Non-Veg</option>
//         </select>

//         <Input
//           type="number"
//           name="minPrice"
//           placeholder="Min Price"
//           onChange={handleFilterChange}
//         />

//         <Input
//           type="number"
//           name="maxPrice"
//           placeholder="Max Price"
//           onChange={handleFilterChange}
//         />

//         <select name="planType" onChange={handleFilterChange} className="border p-2 rounded">
//           <option value="">All Plans</option>
//           <option value="daily">Daily</option>
//           <option value="weekly">Weekly</option>
//           <option value="monthly">Monthly</option>
//         </select>

//         <Input
//           type="text"
//           name="cuisine"
//           placeholder="Cuisine (Kerala...)"
//           onChange={handleFilterChange}
//         />
//       </div>

//       {/* Clear Filters */}
//       <button
//         onClick={() => {
//           setFilters({
//             mealType: "",
//             minPrice: "",
//             maxPrice: "",
//             planType: "",
//             cuisine: "",
//           });
//           setSearch("");
//         }}
//         className="text-sm text-red-500"
//       >
//         Clear Filters
//       </button>

//       {/* Cooks Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {cooks.map((cook) => (
//           <Link key={cook._id} to={`/user/cooks/${cook._id}`}>
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer">
//               <CardContent className="p-5 space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                     <ChefHat className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold">
//                       {cook.user?.name}
//                     </h3>
//                     <Badge>{cook.cuisines.join(", ")}</Badge>
//                   </div>
//                 </div>

//                 <p className="text-sm text-muted-foreground">
//                   {cook.bio}
//                 </p>

//                 <p className="text-sm font-semibold text-primary">
//                   ₹{cook.pricePerMeal} / meal
//                 </p>

//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <span className="flex items-center gap-1">
//                     <Clock className="h-3.5 w-3.5" />
//                     {cook.deliveryTime}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <MapPin className="h-3.5 w-3.5" />
//                     {cook.serviceArea}
//                   </span>
//                 </div>

//                 <StarRating value={Math.round(cook.rating || 0)} readonly />
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>

//       {cooks.length === 0 && (
//         <p className="text-center text-muted-foreground py-12">
//           No cooks found.
//         </p>
//       )}
//     </div>
//   );
// }