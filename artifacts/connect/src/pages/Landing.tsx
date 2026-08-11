import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, ShieldCheck, Clock } from "lucide-react";

export function LandingPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="Northline Connect" className="h-10 w-10" />
            <span className="font-semibold text-xl text-primary tracking-tight">Northline Connect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button>Create Account</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Northline Connect
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Access your paystubs, download important documents, and communicate securely with the HR team all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-in">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Document Access</h3>
                <p className="text-gray-600">
                  Easily access your paystubs, verification letters, and compliance documents anytime.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Platform</h3>
                <p className="text-gray-600">
                  Enterprise-grade security ensures your personal and financial information remains protected.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Direct HR Contact</h3>
                <p className="text-gray-600">
                  Message the HR administration directly for quick responses to your employment questions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <img src={`${basePath}/logo.svg`} alt="Northline Connect" className="h-8 w-8 mb-4 opacity-50 grayscale" />
          <p>&copy; {new Date().getFullYear()} Northline Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
