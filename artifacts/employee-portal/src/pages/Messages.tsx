import { useState, useRef, useEffect } from "react";
import { useGetMe, useListMessages, useSendMessage, useMarkMessageRead, getListMessagesQueryKey, getGetUnreadCountQueryKey, useListUsers } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";

export function Messages() {
  const { data: user } = useGetMe();
  const { data: users } = useListUsers({ query: { enabled: !!user }}); // even non-admin can list users in some setups, or maybe just send to admin id 1
  const { data: messages, isLoading } = useListMessages({}, {
    query: { refetchInterval: 10000 }
  });
  const sendMessage = useSendMessage();
  const markRead = useMarkMessageRead();
  const queryClient = useQueryClient();
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (messages && user) {
      const unreadIds = messages
        .filter(m => !m.read && m.toUserId === user.id)
        .map(m => m.id);
        
      if (unreadIds.length > 0) {
        Promise.all(unreadIds.map(id => markRead.mutateAsync({ id })))
          .then(() => {
            queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetUnreadCountQueryKey() });
          });
      }
    }
  }, [messages, user, markRead, queryClient]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;
    
    // Find an admin to send to. If no users returned, default to ID 1.
    const admin = users?.find(u => u.role === "admin");
    const toUserId = admin?.id || 1;
    
    await sendMessage.mutateAsync({
      data: {
        toUserId,
        body: newMessage
      }
    });
    setNewMessage("");
    queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">HR Messages</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {isLoading ? (
          <div className="flex justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div></div>
        ) : messages?.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No messages yet. Send a message to start a conversation with HR.</div>
        ) : (
          messages?.map(msg => {
            const isMe = msg.fromUserId === user?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  isMe ? "bg-primary text-white rounded-br-none" : "bg-white border text-gray-900 rounded-bl-none shadow-sm"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.body}</p>
                </div>
                <div className="text-xs text-gray-400 mt-1 px-1">
                  {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                  {isMe && <span className="ml-2">{msg.read ? "Read" : "Sent"}</span>}
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
            placeholder="Type your message to HR..."
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
    </div>
  );
}
