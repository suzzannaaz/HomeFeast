import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp, User } from "lucide-react";
import { getMyReviewsApi, getMyRatingSummaryApi } from "@/lib/api";

export default function CookReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [summary, setSummary] = useState({ avgRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
  const token = localStorage.getItem("token");
  // const cookId = localStorage.getItem("cookId"); 
  try {
    const [revs, sum] = await Promise.all([
  getMyReviewsApi(token!),
  getMyRatingSummaryApi(token!)
]);
    
    setReviews(revs || []);
    // Ensure sum actually contains the fields before setting
    setSummary({
      avgRating: sum?.avgRating ?? 0,
      totalReviews: sum?.totalReviews ?? 0
    });
  } catch (err) {
    console.error("Error loading reviews", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="p-10 text-center">Loading Feedback...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Customer Feedback</h2>
        <p className="text-muted-foreground">See what your customers think of your tiffins</p>
      </div>

      {/* ⭐ Rating Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Average Rating</p>
                <h3 className="text-4xl font-bold">{summary.avgRating.toFixed(1)}</h3>
              </div>
              <Star className="h-10 w-10 text-orange-400 fill-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Reviews</p>
                <h3 className="text-4xl font-bold">{summary.totalReviews}</h3>
              </div>
              <MessageSquare className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Performance</p>
                <h3 className="text-lg font-bold">Excellent</h3>
              </div>
              <TrendingUp className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📋 Individual Reviews List */}
      <div className="space-y-4">
        <h4 className="font-bold text-xl flex items-center gap-2">
          Recent Comments
        </h4>
        
        {reviews.length === 0 && (
          <p className="text-center py-10 text-slate-400">No reviews yet. Keep cooking!</p>
        )}

        {Array.isArray(reviews) && reviews.map((rev) => (
          <Card key={rev._id} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{rev.user?.name}</h5>
                    <div className="flex gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < rev.rating ? 'fill-orange-400 text-orange-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 mt-2 italic">"{rev.comment}"</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}