import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-white font-bold text-lg leading-none">
            N
          </div>
          <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-primary' : 'text-white'}`}>
            Northline Premier
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Services", "Impact", "About", "Insights"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                isScrolled ? "text-slate-700" : "text-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
          <Button 
            onClick={() => scrollTo("contact")}
            className="rounded-full bg-secondary hover:bg-secondary/90 text-white border-none"
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </nav>
  );
}
