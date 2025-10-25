import { useHeader } from "@/stores/header";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileTextIcon, TrendingUpIcon, ShieldCheckIcon } from "lucide-react";
import { mockTemplates, type Template } from "@/lib/mock-data";

export const Route = createFileRoute("/(app)/templates")({
  component: RouteComponent,
});

type CategoryFilter = "all" | Template["category"];

function RouteComponent() {
  useHeader("Contract Templates");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Islamic Finance">Islamic Finance</SelectItem>
            <SelectItem value="Real Estate">Real Estate</SelectItem>
            <SelectItem value="Employment">Employment</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
            <SelectItem value="Procurement">Procurement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="p-5 border rounded-xl shadow-island bg-card hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
              {/* Icon & Category Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="size-12 rounded-full shadow-island bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                  <FileTextIcon className="size-6 text-white" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {template.category}
                </span>
              </div>

              {/* Template Info */}
              <h3 className="font-semibold text-base mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground">Clauses</div>
                  <div className="font-semibold text-sm">{template.clauseCount}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground">Uses</div>
                  <div className="font-semibold text-sm">{template.usageCount}</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className="font-semibold text-sm">{template.complianceScore}%</div>
                </div>
              </div>

              {/* Compliance Score */}
              <div className="flex items-center gap-2 pt-3 border-t">
                <ShieldCheckIcon className={`size-4 ${
                  template.complianceScore >= 90 ? "text-green-600" :
                  template.complianceScore >= 75 ? "text-amber-500" :
                  "text-red-600"
                }`} />
                <span className="text-xs text-muted-foreground">
                  {template.complianceScore >= 90 ? "Highly Compliant" :
                   template.complianceScore >= 75 ? "Compliant" :
                   "Needs Review"}
                </span>
                <TrendingUpIcon className="size-3 text-green-600 ml-auto" />
              </div>
            </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border rounded-xl bg-card">
          No templates found matching your search.
        </div>
      )}
    </div>
  );
}
