import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Download,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { SupportThread, SupportMessage } from '../types/banking.ts';
import { 
  getOrCreateSupportThread, 
  sendSupportMessage, 
  subscribeToSupportMessages, 
  markThreadRead 
} from '../services/bankingService.ts';

interface CustomerSupportChatProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const CustomerSupportChat: React.FC<CustomerSupportChatProps> = ({ onOpenAuth }) => {
  const { currentUser, isAdmin } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [thread, setThread] = useState<SupportThread | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Attachment state
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
    type: 'image' | 'document';
  } | null>(null);

  // In-app Lightbox for viewing images without window.open
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdmin || !currentUser) {
      setThread(null);
      setMessages([]);
      return;
    }

    let unsub: (() => void) | undefined;
    getOrCreateSupportThread(currentUser).then((t) => {
      setThread(t);
      unsub = subscribeToSupportMessages(t.id, (msgs) => {
        setMessages(msgs);
        if (isOpen) {
          markThreadRead(t.id, 'customer');
        }
      });
    });

    return () => {
      if (unsub) unsub();
    };
  }, [currentUser, isOpen, isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError('Attachment size limit is 2.5MB for secure transfer.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const isImg = file.type.startsWith('image/');
      setSelectedFile({
        url: result,
        name: file.name,
        type: isImg ? 'image' : 'document'
      });
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please select another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedFile) || !thread || !currentUser) return;

    setIsSending(true);
    setUploadError(null);
    try {
      await sendSupportMessage(
        thread.id,
        { uid: currentUser.uid, name: currentUser.fullName, role: 'customer' },
        inputMessage,
        selectedFile || undefined
      );
      setInputMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Failed to send support message:', err);
      setUploadError(err?.message || 'Could not send message. Please retry.');
    } finally {
      setIsSending(false);
    }
  };

  const hasUnread = thread?.unreadByUser;

  // Admins manage support inside the comprehensive Admin Portal Hub
  if (isAdmin) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && thread) markThreadRead(thread.id, 'customer');
        }}
        className="fixed bottom-6 right-6 z-50 p-3.5 sm:p-4 rounded-full bg-[#d71e28] hover:bg-[#b8141d] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group cursor-pointer border-2 border-[#ffbf00]"
        aria-label="Wells Fargo 24/7 Live Support Chat"
        title="Wells Fargo 24/7 Live Support"
      >
        <MessageSquare className="w-6 h-6" />
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffbf00] border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Live Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 h-[540px] max-h-[80vh] rounded-2xl bg-white border border-slate-300 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 text-slate-900">
          
          {/* Header */}
          <div className="bg-[#d71e28] text-white p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-[#ffbf00]" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Wells Fargo 24/7 Live Support</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Executive Client Desk Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Support Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          {!currentUser ? (
            /* Unauthenticated Visitor Prompt */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-[#d71e28]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">Verified Client Live Chat</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                  Sign on to your Wells Fargo account to connect with a personal banker, exchange documents, and request transaction assistance.
                </p>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuth?.('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#d71e28] hover:bg-[#b8141d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign On to Chat</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuth?.('register');
                  }}
                  className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Open New Account ($0 Min)
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated Customer Chat Room */
            <>
              {/* Messages Area */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 animate-pulse" />
                    <p className="text-xs">Connecting with your dedicated Wells Fargo representative...</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderRole === 'customer';

                    return (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-400 mb-1 px-1">
                          {isMe ? 'You' : msg.senderName} &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                          isMe 
                            ? 'bg-[#d71e28] text-white rounded-br-none' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                        }`}>
                          {/* Message Text */}
                          {msg.text && (
                            <p className="leading-relaxed whitespace-pre-wrap text-xs">{msg.text}</p>
                          )}

                          {/* Attachment: Picture */}
                          {msg.attachmentUrl && msg.attachmentType === 'image' && (
                            <div className="mt-2 rounded-xl overflow-hidden border border-black/10">
                              <img 
                                src={msg.attachmentUrl} 
                                alt={msg.attachmentName || 'Customer Attachment'} 
                                className="max-h-48 w-auto rounded-lg object-contain cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => setPreviewImage({ url: msg.attachmentUrl!, name: msg.attachmentName || 'image.jpg' })}
                              />
                              <p className={`text-[10px] mt-1 font-mono truncate ${isMe ? 'text-white/80' : 'text-slate-500'}`}>
                                🖼️ {msg.attachmentName}
                              </p>
                            </div>
                          )}

                          {/* Attachment: Document */}
                          {msg.attachmentUrl && msg.attachmentType === 'document' && (
                            <a
                              href={msg.attachmentUrl}
                              download={msg.attachmentName || 'document.pdf'}
                              className={`mt-2 p-2.5 rounded-xl flex items-center gap-2 text-xs font-mono border transition-colors ${
                                isMe 
                                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <FileText className="w-4 h-4 shrink-0 text-[#ffbf00]" />
                              <span className="truncate flex-1">{msg.attachmentName || 'Document'}</span>
                              <Download className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="px-3 py-1.5 bg-rose-50 border-t border-rose-200 text-rose-700 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{uploadError}</span>
                  <button onClick={() => setUploadError(null)} className="ml-auto text-rose-400 hover:text-rose-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Pending Attachment Preview */}
              {selectedFile && (
                <div className="px-3.5 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {selectedFile.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-[#d71e28]" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="text-slate-700 font-mono text-[11px] truncate">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Input Footer */}
              <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
                
                {/* File Upload Button */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*,.pdf,.doc,.docx,.txt" 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#d71e28] hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Attach picture or document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#d71e28] focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={isSending || (!inputMessage.trim() && !selectedFile)}
                  className="p-2 rounded-xl bg-[#d71e28] hover:bg-[#b8141d] text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      )}

      {/* Lightbox Modal for Attached Images */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white">
              <span className="text-xs font-mono truncate">{previewImage.name}</span>
              <div className="flex items-center gap-2">
                <a
                  href={previewImage.url}
                  download={previewImage.name}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
              <img 
                src={previewImage.url} 
                alt={previewImage.name} 
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
