import { useHeader } from "@/stores/header";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  FileTextIcon, 
  ClockIcon, 
  AlertTriangleIcon, 
  ShieldCheckIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from "lucide-react";
import { motion } from "motion/react";
import { getDashboardStats, mockContracts } from "@/lib/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";

export const Route = createFileRoute("/(app)/dashboard")({
  component: RouteComponent,
});

const complianceTrendData = [
  { month: "Sep", score: 82 },
  { month: "Oct", score: 85 },
  { month: "Nov", score: 88 },
  { month: "Dec", score: 87 },
  { month: "Jan", score: 90 },
  { month: "Feb", score: 92 },
];

const contractTypeData = [
  { type: "Islamic Finance", count: 2 },
  { type: "Real Estate", count: 1 },
  { type: "Employment", count: 1 },
  { type: "Commercial", count: 1 },
  { type: "Procurement", count: 1 },
];

const COLORS = ["#ff9500", "#ffb534", "#4ade80", "#60a5fa", "#a78bfa"];

function RouteComponent() {
  useHeader("Welcome back");
  const stats = getDashboardStats();

  const metrics = [
    {
      title: "Total Contracts",
      value: stats.totalContracts,
      icon: FileTextIcon,
      color: "text-primary",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Compliance Rate",
      value: `${stats.complianceRate}%`,
      icon: ShieldCheckIcon,
      color: "text-green-600",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: ClockIcon,
      color: "text-amber-500",
      trend: "-2",
      trendUp: false,
    },
    {
      title: "Critical Issues",
      value: stats.criticalIssues,
      icon: AlertTriangleIcon,
      color: "text-red-600",
      trend: "-50%",
      trendUp: true,
    },
  ];

  const recentContracts = mockContracts.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="p-4 pb-5 border rounded-xl shadow-island bg-card"
          >
            <div className="flex items-start justify-between mb-2">
              <motion.div
                whileTap={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                className="size-10 rounded-full shadow-island bg-card border flex items-center justify-center shrink-0 cursor-pointer hover:bg-muted/20 transition-colors"
              >
                <item.icon
                  className={`size-5 ${item.color}`}
                  strokeWidth={2.5}
                />
              </motion.div>
              <div className={`flex items-center gap-1 text-xs font-medium ${item.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {item.trendUp ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
                {item.trend}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{item.title}</p>
              <h2 className="text-2xl font-bold">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Compliance Trend Chart */}
        <div className="lg:col-span-2 p-4 pb-6 border rounded-xl shadow-island bg-card">
          <h2 className="text-lg font-semibold mb-1">Compliance Trend</h2>
          <p className="text-xs text-muted-foreground mb-4">6-month compliance score history</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={complianceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#ff9500" 
                strokeWidth={3}
                dot={{ fill: "#ff9500", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Contract Type Distribution */}
        <div className="p-4 pb-6 border rounded-xl shadow-island bg-card">
          <h2 className="text-lg font-semibold mb-1">Contract Types</h2>
          <p className="text-xs text-muted-foreground mb-4">Distribution by category</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={contractTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.type.split(' ')[0]} ${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {contractTypeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Contracts */}
      <div className="p-4 pb-6 border rounded-xl shadow-island bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Recent Contracts</h2>
            <p className="text-xs text-muted-foreground">Latest contract submissions</p>
          </div>
          <Link to="/contracts">
            <button className="text-sm text-primary hover:underline font-medium">
              View all
            </button>
          </Link>
        </div>
        <div className="space-y-3">
          {recentContracts.map((contract) => (
            <Link key={contract.id} to="/contracts/$id" params={{ id: contract.id }}>
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{contract.title}</h3>
                  <p className="text-xs text-muted-foreground">{contract.client}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{contract.amount}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(contract.date), "MMM d, yyyy")}</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                    contract.status === "approved" || contract.status === "signed"
                      ? "bg-green-500/10 text-green-600"
                      : contract.status === "under_review"
                      ? "bg-blue-500/10 text-blue-600"
                      : contract.status === "draft"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-red-500/10 text-red-600"
                  }`}>
                    {contract.status.replace("_", " ")}
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheckIcon className={`size-4 ${
                      contract.complianceScore >= 90 ? "text-green-600" :
                      contract.complianceScore >= 75 ? "text-amber-500" :
                      "text-red-600"
                    }`} />
                    <span className="text-sm font-medium">{contract.complianceScore}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
