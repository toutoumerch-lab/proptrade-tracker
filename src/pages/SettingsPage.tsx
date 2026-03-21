import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User } from "lucide-react";

export default function SettingsPage() {
  const { user, token, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  // Keep local state synced if user context takes a moment to load
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      updateUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-fadeInUp space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account profile and preferences.</p>
      </div>

      <div className="card-surface rounded-xl p-6 border border-border">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border border-primary/30">
            {user?.name?.substring(0, 2).toUpperCase() || "Tr"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email Address (Read-only)</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled className="bg-surface border-border text-zinc-500 cursor-not-allowed opacity-70" />
            <p className="text-xs text-muted-foreground mt-1">Your email address cannot be changed at this time.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="bg-surface border-border text-foreground"
              required
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="gap-2">
              <User className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
