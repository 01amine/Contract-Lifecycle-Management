import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-5xl mx-auto">
  <div className="bg-linear-to-br from-primary to-primary/80 rounded-3xl p-12 md:p-16 flex flex-col items-center gap-8 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 size-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 space-y-6 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Ready to Transform Your Contract Management?
            </h2>
            <p className="text-xl text-white/90">
              Join forward-thinking organizations using AI-powered automation to 
              secure, analyze, and standardize their contract lifecycle management.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-8"
            >
              <Link to="/dashboard">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold text-lg px-8"
            >
              <Link to="/ai-chat">
                See Demo
              </Link>
            </Button>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-8 mt-8 text-white/90">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">Enterprise-ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
