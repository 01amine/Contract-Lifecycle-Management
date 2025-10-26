import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

function Hero() {
  return (
    <div className="space-y-10 flex justify-center pt-30 pb-14">
      <div className="max-w-3xl space-y-12 flex flex-col items-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold mb-4 text-center">
            AI-Powered <span className="text-primary">Contract Intelligence</span>{" "}
            Platform
          </h1>
          <p className="text-center text-xl text-[#6B7280]">
            Automate contract lifecycle management with intelligent AI analysis, 
            advanced security, and multilingual support — making contracts secure, 
            auditable, and analyzed in seconds.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild size={"lg"} className="text-black font-bold">
            <Link to="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size={"lg"} className="font-bold">
            <Link to="/contracts">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
