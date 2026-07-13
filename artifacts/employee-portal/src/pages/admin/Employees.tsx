import { useListUsers, useUpdateUserRole, getListUsersQueryKey } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { User as UserIcon, Shield } from "lucide-react";
import { format } from "date-fns";

export function Employees() {
  const { data: users, isLoading } = useListUsers();
  const updateRole = useUpdateUserRole();
  const queryClient = useQueryClient();

  const handleRoleChange = async (userId: number, role: "admin" | "employee") => {
    await updateRole.mutateAsync({ userId, data: { role } });
    queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Directory</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map(user => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-full text-primary">
                    {user.role === "admin" ? <Shield className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{user.name || "Unknown Name"}</CardTitle>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Role</span>
                <Select 
                  value={user.role} 
                  onValueChange={(val: "admin" | "employee") => handleRoleChange(user.id, val)}
                  disabled={updateRole.isPending}
                >
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Joined</span>
                <span className="font-medium text-gray-900">{format(new Date(user.createdAt), "MMM d, yyyy")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
