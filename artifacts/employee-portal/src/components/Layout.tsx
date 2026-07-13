import { Link, useLocation } from "wouter";
import { useGetMe, useGetUnreadCount } from "@workspace/api-client-react";
import { useClerk } from "@clerk/react";
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Upload, 
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const { data: user } = useGetMe();
  const { data: unread } = useGetUnreadCount({
    query: { refetchInterval: 30000 }
  });
  const [location] = useLocation();
  const { signOut } = useClerk();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const unreadCount = unread?.count || 0;

  const isAdmin = user?.role === "admin";

  const navItems = isAdmin 
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/employees", label: "Employees", icon: Users },
        { href: "/admin/messages", label: "Messages", icon: MessageSquare, badge: unreadCount },
        { href: "/admin/upload", label: "Upload Document", icon: Upload },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/documents", label: "My Documents", icon: FileText },
        { href: "/messages", label: "Messages", icon: MessageSquare, badge: unreadCount },
      ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center gap-3">
                <img src={`${basePath}/logo.svg`} alt="Northline Premier Logo" className="h-8 w-8" />
                <span className="font-semibold text-lg text-primary hidden sm:block">Northline Premier</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700">
                {user?.name || user?.email}
              </div>
              <button 
                onClick={() => signOut({ redirectUrl: basePath || "/" })}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href || location.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          {children}
        </main>
      </div>
    </div>
  );
}
