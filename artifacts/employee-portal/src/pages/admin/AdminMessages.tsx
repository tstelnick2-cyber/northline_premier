import { useState, useRef, useEffect } from "react";
import { useListUsers, useListMessages, useSendMessage, useGetMe, getListMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Send, User as UserIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AdminMessages() {
  const { data: users } = useListUsers();
  const { data: me } = useGetMe();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  const { data: messages, isLoading } = useListMessages(
    { withUserId: selectedUserId || undefined }, 
    { query: { enabled: !!selectedUserId, refetchInterval: 10000 } }
  );
  
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId || !me) return;
    
    await sendMessage.mutateAsync({
      data: {
        toUserId: selectedUserId,
        body: newMessage
      }
    });
    setNewMessage("");
    queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
  };

  const employees = users?.filter(u => u.id !== me?.id) || [];

  return (
    <div className="flex h-[600px]">
      {/* Sidebar - Employee List */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {employees.map(emp => (
            <button
              key={emp.id}
              onClick={() => setSelectedUserId(emp.id)}
              className={`w-full text-left p-4 border-b transition-colors ${
                selectedUserId === emp.id ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-medium text-sm text-gray-900 truncate">{emp.name || emp.email}</div>
                  <div className="text-xs text-gray-500 capitalize">{emp.role}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main - Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/50">
        {selectedUserId ? (
          <>
            <div className="p-4 bg-white border-b flex items-center shadow-sm z-10">
              <span className="font-semibold">
                {employees.find(e => e.id === selectedUserId)?.name || employees.find(e => e.id === selectedUserId)?.email}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoading ? (
                <div className="flex justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div></div>
              ) : messages?.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No messages yet.</div>
              ) : (
                messages?.map(msg => {
                  const isMe = msg.fromUserId === me?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                        isMe ? "bg-primary text-white rounded-br-none" : "bg-white border text-gray-900 rounded-bl-none shadow-sm"
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.body}</p>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 px-1">
                        {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-3">
                <Textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="resize-none min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button className="h-auto px-6" onClick={handleSend} disabled={!newMessage.trim() || sendMessage.isPending}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an employee to view conversation
          </div>
        )}
      </div>
    </div>
  );
}
