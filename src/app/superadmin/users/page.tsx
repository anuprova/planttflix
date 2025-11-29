"use client";

import { useAllUsers, useUpdateUserRole, useDeleteUser, useUpdateUser } from "@/hooks/lib/UseSuperAdmin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, User, Shield, ShieldAlert, Search, Trash2, Pencil, X, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function UserManagementPage() {
  const { data: usersData, isLoading } = useAllUsers();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Handle Role Update (Promote/Demote)
  const handleRoleUpdate = async (rowId: string, currentRole: string, userName: string) => {
    const newRole = currentRole === "NurseryAdmin" ? "User" : "NurseryAdmin";
    const action = newRole === "NurseryAdmin" ? "Promote" : "Demote";

    if (!confirm(`Are you sure you want to ${action} ${userName} to ${newRole}?`)) return;

    try {
      await updateRole.mutateAsync({ rowId, newRole });
      toast.success(`User ${action}d successfully!`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role.");
    }
  };

  // Handle Delete User
  const handleDelete = async (rowId: string, userName: string) => {
    if (!confirm(`SUPER ADMIN ACTION: Are you sure you want to PERMANENTLY DELETE user "${userName}"? This cannot be undone.`)) return;

    try {
      await deleteUser.mutateAsync(rowId);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  // Open Edit Modal
  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || ""
    });
  };

  // Handle Update User Details
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser.mutateAsync({
        rowId: editingUser.$id,
        data: editForm
      });
      toast.success("User details updated successfully!");
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user details.");
    }
  };

  const filteredUsers = usersData?.rows?.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-green-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">👥 User Management</h1>
        <div className="text-sm text-gray-500">
          Total Users: <span className="font-bold text-gray-800">{usersData?.total || 0}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <Card className="shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user: any) => (
                  <tr key={user.$id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{user.phone || "-"}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]">{user.address || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === 'SuperAdmin' ? 'bg-red-100 text-red-700' :
                          user.role === 'NurseryAdmin' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.$createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                          title="Edit User Details"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Promote/Demote Button */}
                        {user.role !== 'SuperAdmin' && (
                          <button
                            onClick={() => handleRoleUpdate(user.$id, user.role, user.name)}
                            disabled={updateRole.isPending}
                            className={`p-2 rounded-lg transition ${user.role === 'NurseryAdmin'
                                ? 'hover:bg-orange-50 text-orange-600'
                                : 'hover:bg-green-50 text-green-600'
                              }`}
                            title={user.role === 'NurseryAdmin' ? "Demote to User" : "Promote to Nursery Admin"}
                          >
                            {user.role === 'NurseryAdmin' ? <ShieldAlert size={16} /> : <Shield size={16} />}
                          </button>
                        )}

                        {/* Delete Button */}
                        {user.role !== 'SuperAdmin' && (
                          <button
                            onClick={() => handleDelete(user.$id, user.name)}
                            disabled={deleteUser.isPending}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No users found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Edit User Details</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  rows={3}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  {updateUser.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
