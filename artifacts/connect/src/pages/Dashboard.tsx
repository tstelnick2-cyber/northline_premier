import { useGetMe, useListFiles, useGetUnreadCount } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, Users, Upload } from "lucide-react";
import { Link } from "wouter";

export function Dashboard() {
  const { data: user, isLoading } = useGetMe();
  
  if (isLoading || !user) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user.name || user.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin ? (
          <>
            <Link href="/admin/employees">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Manage Employees</CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">View Directory</div>
                  <p className="text-xs text-gray-500 mt-1">Manage roles and access files</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/messages">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Employee Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">Inbox</div>
                  <p className="text-xs text-gray-500 mt-1">Respond to employee queries</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/upload">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Upload Document</CardTitle>
                  <Upload className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">Assign File</div>
                  <p className="text-xs text-gray-500 mt-1">Upload paystubs and letters</p>
                </CardContent>
              </Card>
            </Link>
          </>
        ) : (
          <>
            <Link href="/documents">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">My Documents</CardTitle>
                  <FileText className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">View Files</div>
                  <p className="text-xs text-gray-500 mt-1">Access paystubs and forms</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/messages">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">HR Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">Contact HR</div>
                  <p className="text-xs text-gray-500 mt-1">Send and receive messages</p>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
