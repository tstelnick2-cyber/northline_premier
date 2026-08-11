import { useState } from "react";
import { useListUsers, useRequestUploadUrl, useCreateFile } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle2, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UploadDocument() {
  const { data: users } = useListUsers();
  const requestUrl = useRequestUploadUrl();
  const createFile = useCreateFile();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [fileType, setFileType] = useState<"paystub" | "verification" | "document">("document");
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file || !assignedToId) return;

    try {
      setIsUploading(true);
      
      // 1. Get presigned URL
      const { uploadURL, objectPath } = await requestUrl.mutateAsync({
        data: {
          name: file.name,
          size: file.size,
          contentType: file.type || "application/octet-stream"
        }
      });

      // 2. PUT file bytes to GCS
      const res = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" }
      });

      if (!res.ok) throw new Error("Failed to upload to storage");

      // 3. Create database record
      await createFile.mutateAsync({
        data: {
          assignedToId: parseInt(assignedToId, 10),
          fileType,
          objectPath,
          filename: file.name
        }
      });

      setSuccess(true);
      setFile(null);
      toast({ title: "Document uploaded successfully" });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h1>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>Assign to Employee</Label>
            <Select value={assignedToId} onValueChange={setAssignedToId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee..." />
              </SelectTrigger>
              <SelectContent>
                {users?.map(u => (
                  <SelectItem key={u.id} value={u.id.toString()}>
                    {u.name || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={fileType} onValueChange={(v: any) => setFileType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">General Document</SelectItem>
                <SelectItem value="paystub">Paystub</SelectItem>
                <SelectItem value="verification">Verification Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isUploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                {file ? (
                  <>
                    <File className="h-10 w-10 text-primary mb-2" />
                    <span className="font-medium text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="font-medium text-gray-900">Click to browse</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, DOCX, JPG, PNG up to 10MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <Button 
            className="w-full h-12" 
            onClick={handleUpload} 
            disabled={!file || !assignedToId || isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Uploading...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Uploaded
              </span>
            ) : (
              "Upload and Assign"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
