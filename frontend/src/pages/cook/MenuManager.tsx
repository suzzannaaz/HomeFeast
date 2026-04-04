import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getMenusByCookApi, createMenuApi, updateMenuApi, deleteMenuApi } from "@/lib/api";

export default function CookMenuManager() {
  const { toast } = useToast();
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Lunch",
    available: true,
  });

 // Inside CookMenuManager.tsx
const fetchMyMenu = async () => {
  // Get the logged-in user's ID from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cookId = user.id || user._id;

  if (!cookId) return;

  try {
    const data = await getMenusByCookApi(cookId);
    setMenus(data);
  } catch (err: any) {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  }
};

  useEffect(() => { fetchMyMenu(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (editingItem) {
        await updateMenuApi(token, editingItem._id, formData);
        toast({ title: "Updated", description: "Menu item updated successfully" });
      } else {
        await createMenuApi(token, formData);
        toast({ title: "Added", description: "New dish added to your menu" });
      }
      setIsOpen(false);
      setEditingItem(null);
      setFormData({ name: "", description: "", price: 0, category: "Lunch", available: true });
      fetchMyMenu();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      available: item.available,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("token");
    try {
      await deleteMenuApi(token!, id);
      setMenus(menus.filter(m => m._id !== id));
      toast({ title: "Deleted", description: "Item removed from menu" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Menu Manager</h2>
          <p className="text-muted-foreground">Add and manage your daily tiffin offerings</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {setEditingItem(null); setFormData({name: "", description: "", price: 0, category: "Lunch", available: true})}} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Dish" : "Add New Dish"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Dish Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Lunch, Dinner" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={formData.available} onCheckedChange={v => setFormData({...formData, available: v})} />
                <Label>Available for Order</Label>
              </div>
              <Button type="submit" className="w-full">{editingItem ? "Update Item" : "Create Item"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menus.map((item) => (
          <Card key={item._id} className={`${!item.available && "opacity-60"} overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow`}>
            <CardContent className="p-0">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(item._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-orange-600">₹{item.price}</span>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full">{item.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}