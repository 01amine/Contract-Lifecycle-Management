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
import { useInfiniteContracts } from "@/actions/hooks/use-contracts";
import { ContractStatus } from "@/actions/contracts";
import { getStatusColor, getStatusLabel } from "@/lib/contract-status";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/(app)/contracts/" as any)({
  component: RouteComponent,
});

type ProcessingStep = "all" | "pending" | "completed" | "discarded";

function RouteComponent() {
  useHeader("Your contracts");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("all");

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteContracts();

  // Flatten all pages into a single array
  const contracts = data?.pages.flat() || [];

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.file_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate =
      !dateFilter || contract.created_at.startsWith(dateFilter);

    let matchesStatus = true;
    if (processingStep !== "all") {
      if (processingStep === "pending") {
        matchesStatus =
          contract.status === ContractStatus.DRAFT ||
          contract.status === ContractStatus.UNDER_REVIEW;
      } else if (processingStep === "completed") {
        matchesStatus =
          contract.status === ContractStatus.APPROVED ||
          contract.status === ContractStatus.SIGNED;
      } else if (processingStep === "discarded") {
        matchesStatus = contract.status === ContractStatus.REJECTED;
      }
    }

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
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-destructive">
            Failed to load contracts
          </div>
        )}

        {!isLoading && !error && (
          <div className="overflow-x-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/60">
                  <th className="text-left p-4 font-semibold text-sm text-primary w-12">
                    #
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-primary">
                    File Name
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-primary">
                    Category
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-primary">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-primary">
                    Created At
                  </th>
                  <th className="text-left p-4 font-semibold text-sm text-primary">
                    Version
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((contract, index) => (
                    <motion.tr
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      key={contract._id}
                      className={`transition-colors ${
                        index % 2 === 0
                          ? "bg-card"
                          : "bg-muted/50 hover:bg-muted/60"
                      }`}
                    >
                      <td className="p-4 text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        <Link
                          to="/contracts/$id"
                          params={{ id: contract._id }}
                          className="hover:underline"
                        >
                          {contract.file_name}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {contract.category || "—"}
                      </td>
                      <td className="p-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {getStatusLabel(contract.status)}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {format(
                          new Date(contract.created_at),
                          "d MMM yyyy HH:mm"
                        )}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        v{contract.version}
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && filteredContracts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No contracts found matching your filters.
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
