import { useHeader } from "@/stores/header";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/(app)/contracts/" as any)({
  component: RouteComponent,
});

type ProcessingStep = "all" | "pending" | "completed" | "discarded";

interface Contract {
  id: string;
  title: string;
  client: string;
  date: string;
  amount: string;
  status: "pending" | "completed" | "discarded";
}

const mockContracts: Contract[] = [
  {
    id: "1",
    title: "Software Development Agreement",
    client: "Tech Corp Inc.",
    date: "2024-01-15",
    amount: "$50,000",
    status: "pending",
  },
  {
    id: "2",
    title: "Marketing Services Contract",
    client: "Marketing Solutions",
    date: "2024-01-20",
    amount: "$25,000",
    status: "completed",
  },
  {
    id: "3",
    title: "Consulting Agreement",
    client: "Business Consulting LLC",
    date: "2024-02-01",
    amount: "$35,000",
    status: "pending",
  },
  {
    id: "4",
    title: "Non-Disclosure Agreement",
    client: "StartupXYZ",
    date: "2024-02-10",
    amount: "$0",
    status: "completed",
  },
  {
    id: "5",
    title: "Service Level Agreement",
    client: "Enterprise Systems",
    date: "2024-02-15",
    amount: "$75,000",
    status: "discarded",
  },
  {
    id: "6",
    title: "Vendor Agreement",
    client: "Supply Chain Co.",
    date: "2024-02-20",
    amount: "$15,000",
    status: "pending",
  },
];

function RouteComponent() {
  useHeader("Your contracts");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("all");

  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || contract.date === dateFilter;
    const matchesStatus =
      processingStep === "all" || contract.status === processingStep;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Select
          value={processingStep}
          onValueChange={(value) => setProcessingStep(value as ProcessingStep)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Processing step" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All steps</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="discarded">Discarded</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Table */}
      <div className="border rounded-xl shadow-island bg-card overflow-hidden min-h-[calc(90vh-5rem)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/60">
                <th className="text-left p-4 font-semibold text-sm text-primary">
                  Title
                </th>
                <th className="text-left p-4 font-semibold text-sm text-primary">
                  Client
                </th>
                <th className="text-left p-4 font-semibold text-sm text-primary">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-sm text-primary">
                  Amount
                </th>
                <th className="text-left p-4 font-semibold text-sm text-primary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract, index) => (
                <tr
                  key={contract.id}
                  className={`transition-colors ${
                    index % 2 === 0
                      ? "bg-card"
                      : "bg-muted/50 hover:bg-muted/60"
                  }`}
                >
                  <td className="p-4 text-sm font-medium">
                    <Link
                      to="/contracts/$id"
                      params={{ id: contract.id }}
                      className="hover:underline"
                    >
                      {contract.title}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {contract.client}
                  </td>
                  <td className="p-4 text-sm">
                    {format(new Date(contract.date), "d MMM yyyy")}
                  </td>
                  <td className="p-4 text-sm font-medium">{contract.amount}</td>
                  <td className="p-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                        contract.status === "pending"
                          ? "bg-amber-500/10 text-amber-600"
                          : contract.status === "completed"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredContracts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No contracts found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
