export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-primary font-bold text-lg leading-none">
              N
            </div>
            <span className="font-bold text-xl tracking-tight">
              Northline Premier
            </span>
          </div>
          <p className="text-slate-300 max-w-sm mb-6">
            Guiding Bay Area businesses through transformation, strategy, and growth with precision and scrappy ambition.
          </p>
          <p className="text-slate-400 text-sm">
            San Francisco Bay Area, CA
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4">Firm</h4>
          <ul className="space-y-3 text-slate-300">
            <li><a href="#services" className="hover:text-secondary transition-colors">Services</a></li>
            <li><a href="#impact" className="hover:text-secondary transition-colors">Impact & Results</a></li>
            <li><a href="#about" className="hover:text-secondary transition-colors">About Us</a></li>
            <li><a href="#contact" className="hover:text-secondary transition-colors">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg mb-4">Connect</h4>
          <ul className="space-y-3 text-slate-300">
            <li><a href="#" className="hover:text-secondary transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Insights</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Careers</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} Northline Premier Consulting. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
