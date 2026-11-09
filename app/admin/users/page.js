
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [updating, setUpdating] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load users");
        return;
      }

      setUsers(data.users || []);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId, action) => {
    const actionText = action === "block" ? "block" : "unblock";

    if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) {
      return;
    }

    try {
      setUpdating(userId);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Action failed");
        return;
      }

      setMessage(data.message);
      await fetchUsers();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setUpdating("");
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            RideGlow Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Manage Users
          </h1>
          <p className="mt-2 text-slate-400">
            View and manage registered platform users.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-2 text-3xl font-bold">{users.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Blocked Users</p>
            <p className="mt-2 text-3xl font-bold text-red-400">
              {users.filter((user) => user.isBlocked).length}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
          />
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-emerald-300">
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="font-semibold">Registered Users</h2>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-slate-800/70 text-sm text-slate-400">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-slate-800"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-slate-400">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {user.phone || "N/A"}
                      </td>

                      <td className="px-5 py-4 capitalize text-slate-300">
                        {user.role}
                      </td>

                      <td className="px-5 py-4">
                        {user.isBlocked ? (
                          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                            Blocked
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          disabled={updating === user._id}
                          onClick={() =>
                            handleAction(
                              user._id,
                              user.isBlocked ? "unblock" : "block"
                            )
                          }
                          className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
                            user.isBlocked
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {updating === user._id
                            ? "Please wait..."
                            : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
