import React, { useEffect, useState } from "react";
import axios from "axios";
import { Server, Activity, Package, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PatchActivity {
  date: string;
  patches: number;
  critical: number;
}

interface RecentActivity {
  action: string;
  server: string;
  time: string;
  type: string;
}

interface DashboardData {
  total_servers: number;
  online_servers: number;
  offline_servers: number;
  pending_patches: number;
  critical_patches: number;
  last_sync: string;
  patch_activity: PatchActivity[];
  recent_activities: RecentActivity[];
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

useEffect(() => {
  axios
    .get<DashboardData>("http://127.0.0.1:5000/api/dashboard")
    .then((res) => setData(res.data))
    .catch((err) => console.error("API Error:", err));
}, []);


  if (!data) {
    return <div className="text-white text-center mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Servers */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Total Servers</CardTitle>
            <Server className="w-5 h-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{data.total_servers}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-teal-500">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Connected Agents */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Connected Agents</CardTitle>
            <Activity className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{data.online_servers}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-yellow-500">{data.offline_servers} offline</span> servers
            </p>
          </CardContent>
        </Card>

        {/* Pending Updates */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Pending Updates</CardTitle>
            <Package className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{data.pending_patches}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-red-500">{data.critical_patches} critical</span> patches
            </p>
          </CardContent>
        </Card>

        {/* Last Sync */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-300">Last Sync</CardTitle>
            <Clock className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-white">{data.last_sync || "N/A"}</div>
            <p className="text-xs text-slate-400 mt-1">ago on all servers</p>
          </CardContent>
        </Card>
      </div>

      {/* Patch Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Patch Activity Over Time
            </CardTitle>
            <CardDescription className="text-slate-400">
              Last 7 days patch deployment metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.patch_activity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="patches" stroke="#14b8a6" strokeWidth={2} name="Total Patches" />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} name="Critical" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-teal-500" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">
              Latest system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recent_activities.map((activity: RecentActivity) => (
                <div
                  key={activity.time + activity.server}
                  className="flex items-start gap-3 pb-3 border-b border-slate-700 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.server}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
