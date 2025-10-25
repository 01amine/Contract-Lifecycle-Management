import { Link } from "@tanstack/react-router";
import { FileText, ArrowRight, ClipboardList } from "lucide-react";
import { format } from "date-fns";

interface RecentContract {
  id: string;
  title: string;
  client: string;
  date: string;
  status: "pending" | "completed" | "discarded";
}

const mockRecentContracts: RecentContract[] = [
  {
    id: "1",
    title: "Software Development Agreement",
    client: "Tech Corp Inc.",
    date: "2024-02-20",
    status: "pending",
  },
  {
    id: "2",
    title: "Marketing Services Contract",
    client: "Marketing Solutions",
    date: "2024-02-18",
    status: "completed",
  },
  {
    id: "3",
    title: "Consulting Agreement",
    client: "Business Consulting LLC",
    date: "2024-02-15",
    status: "pending",
  },
  {
    id: "4",
    title: "Non-Disclosure Agreement",
    client: "StartupXYZ",
    date: "2024-02-10",
    status: "completed",
  },
];

export function RecentContracts() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-600";
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "discarded":
        return "bg-red-500/10 text-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-island bg-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold font-title">Recent Contracts</h2>
        <Link
          to="/contracts"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {mockRecentContracts.map((contract) => (
          <Link
            key={contract.id}
            to="/contracts/$id"
            params={{ id: contract.id }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
          >
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <ClipboardList className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{contract.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {contract.client}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(contract.date), "MMM d")}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(
                    contract.status
                  )}`}
                >
                  {contract.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
