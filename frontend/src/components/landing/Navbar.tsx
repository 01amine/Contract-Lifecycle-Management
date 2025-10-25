import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="p-2 md:px-10 lg:px-16 md:py-4" aria-label="Main navigation">
      <div className="bg-[#F9F9F9] px-4 md:px-9 py-4 md:py-5 rounded-full flex items-center justify-between">
        <img src="logo.svg" alt="Logo" className="h-8 md:h-10" />

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            <span className="text-green-600 font-semibold">★ 4.9</span>
            <span className="text-gray-400 mx-2">•</span>
            <span>Trusted by 500+ companies</span>
          </div>
          <Button className="font-bold text-black">Get Started</Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-[#F9F9F9] rounded-3xl p-6">
          <div className="text-sm text-gray-600 text-center pb-4 mb-4 border-b border-gray-200">
            <span className="text-green-600 font-semibold">★ 4.9</span>
            <span className="text-gray-400 mx-2">•</span>
            <span>Trusted by 500+ companies</span>
          </div>
          <Button className="font-bold text-black">Get Started</Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
