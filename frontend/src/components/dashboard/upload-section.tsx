import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function UploadSection() {
  return (
    <div className="p-6 border rounded-xl shadow-island bg-card relative overflow-hidden">
      <div className="relative flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold font-title mb-3">
            Upload a new contract
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Get started by uploading your contract or writing a new one.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link to="/contracts/create" className="block">
            <Button size="lg" className="w-full group" variant="outline">
              Write From Scratch
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/contracts/create" className="block">
            <Button size="lg" className="w-full group">
              Upload Document
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>AI-powered contract analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
