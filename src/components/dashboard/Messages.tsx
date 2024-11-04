import { MessageCircle } from 'lucide-react';

export default function Messages() {
  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h2>
        <p className="text-gray-500">Start a conversation with your project team</p>
      </div>
    </div>
  );
}