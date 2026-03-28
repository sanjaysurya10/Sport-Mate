"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { MOCK_ADMIN_USERS } from "@/lib/mockData";

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string, currentStatus: string) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: currentStatus === "active" ? "suspended" : "active" } 
        : u
    ));
  };

  const deleteUser = () => {
    if (confirmDelete) {
      setUsers(users.filter(u => u.id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Delete User?</h2>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. Are you sure you want to permanently delete this user?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-[#2a2a2a] hover:bg-[#2a2a2a] text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={deleteUser}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            Users 
            <span className="bg-[#4a6cf7]/20 text-[#4a6cf7] text-sm px-3 py-1 rounded-full font-medium">
              {users.length} total
            </span>
          </h1>
          <p className="text-gray-400">Manage all registered accounts.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-500 w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-2 text-white w-full focus:outline-none focus:border-[#4a6cf7] text-sm"
          />
        </div>
        
        <div className="flex bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-1 shrink-0">
          {["all", "player", "owner"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-1.5 text-sm rounded-lg capitalize font-medium transition-colors ${
                roleFilter === role ? "bg-[#2a2a2a] text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl overflow-hidden overflow-x-auto shadow-sm">
        <table className="w-full border-collapse min-w-[800px]">
          <thead className="bg-[#111111]">
            <tr>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Name</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Role</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Location</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Joined</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Status</th>
              <th className="text-right text-gray-400 text-sm font-medium py-4 px-6 border-b border-[#2a2a2a]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">No users match your criteria</td>
              </tr>
            ) : (
              filteredUsers.map((user, i) => (
                <tr key={user.id} className={`border-b border-[#2a2a2a] last:border-0 hover:bg-[#141414] transition-colors`}>
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-white mb-0.5">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block ${
                      user.role === "player" ? "bg-[#4a6cf7]/20 text-[#4a6cf7]" : "bg-[#8b5cf6]/20 text-[#8b5cf6]"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-300">{user.city}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{user.joined}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 flex items-center gap-1.5 rounded-full text-xs font-bold uppercase w-fit ${
                      user.status === "active" ? "text-[#22c55e]" : "text-red-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-[#22c55e]" : "bg-red-500"}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => toggleStatus(user.id, user.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        user.status === "active" 
                          ? "border-orange-500/50 text-orange-500 hover:bg-orange-500/10" 
                          : "border-[#22c55e]/50 text-[#22c55e] hover:bg-[#22c55e]/10"
                      }`}
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
