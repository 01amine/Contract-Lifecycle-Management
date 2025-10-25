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
import { Search, ShieldCheckIcon } from "lucide-react";
import { format } from "date-fns";
import { mockContracts, type Contract } from "@/lib/mock-data";

export const Route = createFileRoute("/(app)/contracts/" as any)({
  component: RouteComponent,
});

type StatusFilter = "all" | Contract["status"];
type TypeFilter = "all" | Contract["type"];

function RouteComponent() {
  useHeader("Your contracts");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || contract.date === dateFilter;
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    const matchesType = typeFilter === "all" || contract.type === typeFilter;
    return matchesSearch && matchesDate && matchesStatus && matchesType;
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
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as TypeFilter)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Contract type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="islamic-finance">Islamic Finance</SelectItem>
            <SelectItem value="real-estate">Real Estate</SelectItem>
            <SelectItem value="employment">Employment</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="procurement">Procurement</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
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
                  Contract
                </th>
                <th className="text-left p-4 font-semibold text-sm text-primary">
                  Type
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
                  Compliance
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
                      ? "bg-card hover:bg-muted/20"
                      : "bg-muted/30 hover:bg-muted/40"
                  }`}
                >
                  <td className="p-4 text-sm">
                    <Link
                      to="/contracts/$id"
                      params={{ id: contract.id }}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {contract.title}
                    </Link>
                    {contract.blockchainVerified && (
                      <span className="ml-2 text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">
                        ⛓️ Verified
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground capitalize">
                    {contract.type.replace("-", " ")}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {contract.client}
                  </td>
                  <td className="p-4 text-sm">
                    {format(new Date(contract.date), "d MMM yyyy")}
                  </td>
                  <td className="p-4 text-sm font-medium">{contract.amount}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheckIcon className={`size-4 ${
                        contract.complianceScore >= 90 ? "text-green-600" :
                        contract.complianceScore >= 75 ? "text-amber-500" :
                        "text-red-600"
                      }`} />
                      <span className={`font-medium ${
                        contract.complianceScore >= 90 ? "text-green-600" :
                        contract.complianceScore >= 75 ? "text-amber-500" :
                        "text-red-600"
                      }`}>
                        {contract.complianceScore}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap ${
                        contract.status === "approved" || contract.status === "signed"
                          ? "bg-green-500/10 text-green-600"
                          : contract.status === "under_review"
                          ? "bg-blue-500/10 text-blue-600"
                          : contract.status === "draft"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {contract.status.replace("_", " ")}
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
