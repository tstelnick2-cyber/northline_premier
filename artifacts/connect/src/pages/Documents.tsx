import { useListFiles, useGetMe } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileBadge, Receipt } from "lucide-react";
import { format } from "date-fns";

export function Documents() {
  const { data: user } = useGetMe();
  const { data: files, isLoading } = useListFiles({ userId: user?.id }, {
    query: { enabled: !!user?.id }
  });

  const downloadFile = (objectPath: string) => {
    const cleanPath = objectPath.replace(/^\/objects\//, '');
    window.open(`/api/storage/objects/${cleanPath}`, "_blank");
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case "paystub": return <Receipt className="h-5 w-5 text-green-600" />;
      case "verification": return <FileBadge className="h-5 w-5 text-blue-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Documents</h1>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : files?.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
          <p className="text-gray-500">You don't have any documents assigned to you yet.</p>
        </Card>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files?.map(file => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        {getFileIcon(file.fileType)}
                      </div>
                      <span className="font-medium text-gray-900">{file.filename}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm text-gray-600">{file.fileType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(file.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => downloadFile(file.objectPath)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
