// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   MessageSquare,
// //   Send,
// //   Hash,
// //   ArrowLeft,
// //   X,
// //   Edit2,
// //   Trash2,
// //   Check,
// //   ChevronDown,
// //   AlertCircle,
// //   Paperclip,
// //   FileText,
// //   ExternalLink,
// //   Image as ImageIcon,
// // } from "lucide-react";

// // export default function ChatDrawer({ socket, user, isOpen, onClose }) {
// //   const [selectedChat, setSelectedChat] = useState(null);
// //   const [message, setMessage] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [editingMessage, setEditingMessage] = useState(null);
// //   const [activeMenu, setActiveMenu] = useState(null);
// //   const [deleteModal, setDeleteModal] = useState({ show: false, msgId: null });
// //   const [fullScreenImage, setFullScreenImage] = useState(null);
// //   const [hasUnread, setHasUnread] = useState(false);
// //   const scrollRef = useRef();
// //   const fileInputRef = useRef();

// //   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

// //   useEffect(() => {
// //     const handleClickOutside = () => setActiveMenu(null);
// //     window.addEventListener("click", handleClickOutside);
// //     return () => window.removeEventListener("click", handleClickOutside);
// //   }, []);

// //   useEffect(() => {
// //     if (!socket) return;

// //     const handleReceiveMessage = (msg) => {
// //       // Check if the message belongs to "The Hub"
// //       if (msg.conversationId === "global_all") {
// //         // Only set unread if we aren't currently looking at The Hub
// //         if (selectedChat?.id !== "global_all") {
// //           setHasUnread(true);
// //         }
// //       }

// //       // If we are currently looking at this specific chat, update messages list
// //       if (msg.conversationId === selectedChat?.id) {
// //         setMessages((prev) => [...prev, msg]);
// //       }
// //     };

// //     const handleChatHistory = (history) => setMessages(history);

// //     const handleUpdateMessage = (updatedMsg) => {
// //       setMessages((prev) =>
// //         prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
// //       );
// //     };

// //     const handleDeleteMessage = (messageId) => {
// //       setMessages((prev) => prev.filter((m) => m._id !== messageId));
// //     };

// //     socket.on("receive_message", handleReceiveMessage);
// //     socket.on("chat_history", handleChatHistory);
// //     socket.on("message_updated", handleUpdateMessage);
// //     socket.on("message_deleted", handleDeleteMessage);

// //     return () => {
// //       socket.off("receive_message", handleReceiveMessage);
// //       socket.off("chat_history", handleChatHistory);
// //       socket.off("message_updated", handleUpdateMessage);
// //       socket.off("message_deleted", handleDeleteMessage);
// //     };
// //   }, [socket, selectedChat]); // selectedChat must be a dependency here to know current view

// //   useEffect(() => {
// //     if (selectedChat && socket) {
// //       setMessages([]);
// //       socket.emit("join_room", selectedChat.id);

// //       // Clear unread dot immediately when opening the specific chat
// //       if (selectedChat.id === "global_all") {
// //         setHasUnread(false);
// //       }
// //     }
// //   }, [selectedChat, socket]);

// //   useEffect(() => {
// //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const sendMessage = (e) => {
// //     e.preventDefault();
// //     if (!message.trim() || !selectedChat || !socket) return;

// //     if (editingMessage) {
// //       socket.emit("edit_message", {
// //         messageId: editingMessage._id,
// //         text: message,
// //         conversationId: selectedChat.id,
// //       });
// //       setEditingMessage(null);
// //     } else {
// //       const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());
// //       const data = {
// //         conversationId: selectedChat.id,
// //         text: message,
// //         senderId: user.id,
// //         senderName: user.name,
// //         fileType: isLink ? "link" : "text",
// //       };
// //       socket.emit("send_message", data);
// //     }
// //     setMessage("");
// //   };

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file || !socket || !selectedChat) return;

// //     const reader = new FileReader();
// //     reader.onloadend = () => {
// //       const fileData = {
// //         conversationId: selectedChat.id,
// //         senderId: user.id,
// //         senderName: user.name,
// //         text: "",
// //         fileUrl: reader.result,
// //         fileName: file.name,
// //         fileType: file.type.startsWith("image/") ? "image" : "doc",
// //       };
// //       socket.emit("send_message", fileData);
// //     };
// //     reader.readAsDataURL(file);
// //     e.target.value = null;
// //   };

// //   const renderMessageContent = (msg) => {
// //     if (msg.fileType === "image") {
// //       return (
// //         <div style={{ marginTop: "5px" }}>
// //           <img
// //             src={msg.fileUrl}
// //             alt="upload"
// //             style={{
// //               maxWidth: "300px",
// //               maxHeight: "300px",
// //               width: "auto",
// //               height: "auto",
// //               objectFit: "contain",
// //               borderRadius: "12px",
// //               cursor: "pointer",
// //               border: "1px solid rgba(255,255,255,0.1)",
// //               transition: "transform 0.2s ease",
// //             }}
// //             onMouseOver={(e) =>
// //               (e.currentTarget.style.transform = "scale(1.02)")
// //             }
// //             onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
// //             onClick={() => setFullScreenImage(msg.fileUrl)}
// //           />
// //         </div>
// //       );
// //     }
// //     if (msg.fileType === "doc") {
// //       return (
// //         <a
// //           href={msg.fileUrl}
// //           download={msg.fileName}
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: "8px",
// //             color: "inherit",
// //             textDecoration: "none",
// //             background: "rgba(255,255,255,0.1)",
// //             padding: "8px",
// //             borderRadius: "8px",
// //             marginTop: "5px",
// //           }}>
// //           <FileText size={18} />
// //           <span
// //             style={{
// //               fontSize: "0.75rem",
// //               overflow: "hidden",
// //               textOverflow: "ellipsis",
// //             }}>
// //             {msg.fileName}
// //           </span>
// //         </a>
// //       );
// //     }
// //     if (msg.fileType === "link") {
// //       return (
// //         <a
// //           href={msg.text}
// //           target="_blank"
// //           rel="noreferrer"
// //           style={{
// //             color: "#00d2ff",
// //             display: "flex",
// //             alignItems: "center",
// //             gap: "5px",
// //           }}>
// //           {msg.text} <ExternalLink size={12} />
// //         </a>
// //       );
// //     }
// //     return msg.text;
// //   };

// //   const confirmDelete = () => {
// //     if (deleteModal.msgId) {
// //       socket.emit("delete_message", {
// //         messageId: deleteModal.msgId,
// //         conversationId: selectedChat.id,
// //       });
// //     }
// //     setDeleteModal({ show: false, msgId: null });
// //   };

// //   const startEditing = (msg) => {
// //     if (msg.fileType !== "text") return;
// //     setEditingMessage(msg);
// //     setMessage(msg.text);
// //     setActiveMenu(null);
// //   };

// //   const formatTime = (dateStr) => {
// //     if (!dateStr) return "";
// //     return new Date(dateStr).toLocaleTimeString([], {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //     });
// //   };

// //   const formatDateSeparator = (dateStr) => {
// //     const date = new Date(dateStr);
// //     const today = new Date();
// //     const yesterday = new Date();
// //     yesterday.setDate(today.getDate() - 1);
// //     if (date.toDateString() === today.toDateString()) return "Today";
// //     if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
// //     return date.toLocaleDateString([], {
// //       day: "numeric",
// //       month: "long",
// //       year: "numeric",
// //     });
// //   };

// //   return (
// //     <div
// //       className={`page-content glass ${isOpen ? "open" : ""}`}
// //       style={{
// //         display: "flex",
// //         flexDirection: "column",
// //         overflow: "hidden",
// //         position: "relative",
// //       }}>
// //       {/* FULLSCREEN IMAGE OVERLAY */}
// //       {fullScreenImage && (
// //         <div
// //           style={{
// //             position: "absolute",
// //             inset: 0,
// //             zIndex: 200,
// //             background: "rgba(0,0,0,0.9)",
// //             backdropFilter: "blur(10px)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             padding: "20px",
// //           }}
// //           onClick={() => setFullScreenImage(null)}>
// //           <button
// //             onClick={() => setFullScreenImage(null)}
// //             style={{
// //               position: "absolute",
// //               top: "20px",
// //               right: "20px",
// //               background: "rgba(255,255,255,0.1)",
// //               border: "none",
// //               borderRadius: "50%",
// //               width: "40px",
// //               height: "40px",
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               color: "white",
// //               cursor: "pointer",
// //               zIndex: 201,
// //             }}>
// //             <X size={24} />
// //           </button>
// //           <img
// //             src={fullScreenImage}
// //             alt="Full size"
// //             style={{
// //               maxWidth: "100%",
// //               maxHeight: "100%",
// //               objectFit: "contain",
// //               borderRadius: "8px",
// //               boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
// //             }}
// //             onClick={(e) => e.stopPropagation()}
// //           />
// //         </div>
// //       )}

// //       {deleteModal.show && (
// //         <div
// //           style={{
// //             position: "absolute",
// //             inset: 0,
// //             zIndex: 100,
// //             background: "rgba(0,0,0,0.6)",
// //             backdropFilter: "blur(4px)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             padding: "20px",
// //           }}>
// //           <div
// //             className="glass"
// //             style={{
// //               padding: "24px",
// //               borderRadius: "20px",
// //               width: "100%",
// //               maxWidth: "280px",
// //               textAlign: "center",
// //               border: "1px solid rgba(255,255,255,0.1)",
// //             }}>
// //             <div
// //               style={{
// //                 background: "rgba(255,50,50,0.1)",
// //                 width: "40px",
// //                 height: "40px",
// //                 borderRadius: "50%",
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "center",
// //                 margin: "0 auto 15px",
// //               }}>
// //               <AlertCircle color="#ff4444" size={24} />
// //             </div>
// //             <h5 style={{ margin: "0 0 8px 0", color: "#fff" }}>
// //               Delete Message?
// //             </h5>
// //             <p
// //               style={{
// //                 fontSize: "0.8rem",
// //                 opacity: 0.7,
// //                 marginBottom: "20px",
// //               }}>
// //               This action cannot be undone.
// //             </p>
// //             <div style={{ display: "flex", gap: "10px" }}>
// //               <button
// //                 onClick={() => setDeleteModal({ show: false, msgId: null })}
// //                 style={{
// //                   flex: 1,
// //                   padding: "10px",
// //                   borderRadius: "10px",
// //                   background: "rgba(255,255,255,0.05)",
// //                   border: "none",
// //                   color: "#fff",
// //                   cursor: "pointer",
// //                 }}>
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmDelete}
// //                 style={{
// //                   flex: 1,
// //                   padding: "10px",
// //                   borderRadius: "10px",
// //                   background: "#ff4444",
// //                   border: "none",
// //                   color: "#fff",
// //                   fontWeight: "600",
// //                   cursor: "pointer",
// //                 }}>
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div
// //         className="chat-header"
// //         style={{
// //           padding: "12px 16px",
// //           borderBottom: "1px solid var(--glass-border)",
// //           minHeight: "60px",
// //           display: "flex",
// //           alignItems: "center",
// //         }}>
// //         {!selectedChat ? (
// //           <div
// //             className="header-info"
// //             style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //             <div className="glow-icon" style={{ padding: "6px" }}>
// //               <MessageSquare size={16} color="var(--accent)" />
// //             </div>
// //             <h4 style={{ fontSize: "0.9rem", margin: 0 }}>Messenger</h4>
// //           </div>
// //         ) : (
// //           <div
// //             style={{
// //               display: "flex",
// //               alignItems: "center",
// //               gap: "12px",
// //               width: "100%",
// //             }}>
// //             <button
// //               onClick={() => {
// //                 setSelectedChat(null);
// //                 setEditingMessage(null);
// //                 setMessage("");
// //               }}
// //               className="back-link"
// //               style={{
// //                 padding: "6px",
// //                 background: "rgba(255,255,255,0.05)",
// //                 borderRadius: "8px",
// //               }}>
// //               <ArrowLeft size={16} />
// //             </button>
// //             <div className="conv-title">
// //               <h4 style={{ fontSize: "0.85rem", margin: 0 }}>
// //                 {selectedChat.name}
// //               </h4>
// //               <span className="status-indicator" style={{ fontSize: "9px" }}>
// //                 Active Now
// //               </span>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <div
// //         className="chat-body"
// //         style={{
// //           flex: 1,
// //           display: "flex",
// //           flexDirection: "column",
// //           overflow: "hidden",
// //         }}>
// //         {!selectedChat ? (
// //           <div className="chat-list feed-scroll" style={{ padding: "10px" }}>
// //             <p
// //               className="mini-label"
// //               style={{ paddingLeft: "10px", marginBottom: "8px" }}>
// //               Channels
// //             </p>
// //             {groups.map((group) => (
// //               <div
// //                 key={group.id}
// //                 className="chat-item"
// //                 onClick={() => setSelectedChat(group)}
// //                 style={{
// //                   borderRadius: "12px",
// //                   margin: "2px 0",
// //                   position: "relative",
// //                 }}>
// //                 <div
// //                   className="group-icon-hex global"
// //                   style={{ width: "32px", height: "32px" }}>
// //                   <Hash size={14} />
// //                 </div>
// //                 <div className="chat-details">
// //                   <span className="chat-name" style={{ fontSize: "0.85rem" }}>
// //                     {group.name}
// //                   </span>
// //                   <span className="mini-label" style={{ fontSize: "9px" }}>
// //                     Staff Hub
// //                   </span>
// //                 </div>

// //                 {/* UNREAD RED DOT - Triggered by hasUnread state */}
// //                 {hasUnread && group.id === "global_all" && (
// //                   <div
// //                     style={{
// //                       position: "absolute",
// //                       top: "12px",
// //                       right: "15px",
// //                       width: "8px",
// //                       height: "8px",
// //                       backgroundColor: "#ff4444",
// //                       borderRadius: "50%",
// //                       boxShadow: "0 0 8px #ff4444",
// //                       zIndex: 5,
// //                     }}
// //                   />
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <div
// //             className="active-conversation"
// //             style={{
// //               height: "100%",
// //               display: "flex",
// //               flexDirection: "column",
// //               overflow: "hidden",
// //             }}>
// //             <div
// //               className="message-area feed-scroll"
// //               style={{ padding: "20px 14px", flex: 1 }}>
// //               {messages.length === 0 ? (
// //                 <div className="empty-chat" style={{ paddingTop: "50px" }}>
// //                   <p style={{ fontSize: "0.75rem" }}>
// //                     Secure connection established.
// //                   </p>
// //                 </div>
// //               ) : (
// //                 messages.map((msg, i) => {
// //                   const isMine =
// //                     msg.sender === user.id || msg.senderId === user.id;
// //                   const showDateSeparator =
// //                     i === 0 ||
// //                     new Date(msg.createdAt).toDateString() !==
// //                       new Date(messages[i - 1].createdAt).toDateString();

// //                   return (
// //                     <React.Fragment key={msg._id || i}>
// //                       {showDateSeparator && (
// //                         <div style={{ textAlign: "center", margin: "24px 0" }}>
// //                           <span
// //                             style={{
// //                               fontSize: "10px",
// //                               background: "rgba(255,255,255,0.08)",
// //                               padding: "5px 12px",
// //                               borderRadius: "20px",
// //                               color: "var(--accent)",
// //                               textTransform: "uppercase",
// //                             }}>
// //                             {formatDateSeparator(msg.createdAt)}
// //                           </span>
// //                         </div>
// //                       )}
// //                       <div
// //                         className={`msg-bubble-wrapper ${isMine ? "mine" : "theirs"}`}
// //                         style={{
// //                           marginBottom: "16px",
// //                           display: "flex",
// //                           flexDirection: "column",
// //                           alignItems: isMine ? "flex-end" : "flex-start",
// //                         }}>
// //                         <div
// //                           className="msg-bubble"
// //                           style={{
// //                             padding: "12px 14px",
// //                             fontSize: "0.88rem",
// //                             borderRadius: isMine
// //                               ? "16px 16px 4px 16px"
// //                               : "16px 16px 16px 4px",
// //                             maxWidth: "85%",
// //                             minWidth: "120px",
// //                             position: "relative",
// //                             background: isMine
// //                               ? "var(--accent)"
// //                               : "rgba(255,255,255,0.07)",
// //                             border: "1px solid rgba(255,255,255,0.1)",
// //                             color: isMine ? "#020617" : "inherit",
// //                           }}>
// //                           <div
// //                             style={{
// //                               display: "flex",
// //                               justifyContent: "space-between",
// //                               alignItems: "center",
// //                               marginBottom: "6px",
// //                             }}>
// //                             {!isMine ? (
// //                               <span
// //                                 style={{
// //                                   color: "var(--accent)",
// //                                   fontWeight: 700,
// //                                   fontSize: "0.7rem",
// //                                 }}>
// //                                 {msg.senderName}
// //                               </span>
// //                             ) : (
// //                               <div
// //                                 style={{
// //                                   marginLeft: "auto",
// //                                   position: "relative",
// //                                 }}>
// //                                 <button
// //                                   onClick={(e) => {
// //                                     e.stopPropagation();
// //                                     setActiveMenu(
// //                                       activeMenu === msg._id ? null : msg._id,
// //                                     );
// //                                   }}
// //                                   style={{
// //                                     background: "transparent",
// //                                     border: "none",
// //                                     cursor: "pointer",
// //                                     opacity: 0.8,
// //                                   }}>
// //                                   <ChevronDown size={14} />
// //                                 </button>
// //                                 {activeMenu === msg._id && (
// //                                   <div
// //                                     className="glass"
// //                                     style={{
// //                                       position: "absolute",
// //                                       top: "20px",
// //                                       right: "0",
// //                                       zIndex: 10,
// //                                       minWidth: "100px",
// //                                       borderRadius: "10px",
// //                                       padding: "5px",
// //                                       background: "rgba(20, 20, 25, 0.95)",
// //                                     }}>
// //                                     {msg.fileType === "text" && (
// //                                       <button
// //                                         onClick={() => startEditing(msg)}
// //                                         style={{
// //                                           display: "flex",
// //                                           alignItems: "center",
// //                                           gap: "8px",
// //                                           width: "100%",
// //                                           padding: "8px 12px",
// //                                           background: "none",
// //                                           border: "none",
// //                                           color: "#fff",
// //                                           fontSize: "0.75rem",
// //                                           cursor: "pointer",
// //                                         }}>
// //                                         <Edit2 size={12} /> Edit
// //                                       </button>
// //                                     )}
// //                                     <button
// //                                       onClick={() =>
// //                                         setDeleteModal({
// //                                           show: true,
// //                                           msgId: msg._id,
// //                                         })
// //                                       }
// //                                       style={{
// //                                         display: "flex",
// //                                         alignItems: "center",
// //                                         gap: "8px",
// //                                         width: "100%",
// //                                         padding: "8px 12px",
// //                                         background: "none",
// //                                         border: "none",
// //                                         color: "#ff4444",
// //                                         fontSize: "0.75rem",
// //                                         cursor: "pointer",
// //                                       }}>
// //                                       <Trash2 size={12} /> Delete
// //                                     </button>
// //                                   </div>
// //                                 )}
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div
// //                             style={{
// //                               margin: 0,
// //                               paddingBottom: "12px",
// //                               lineHeight: "1.4",
// //                             }}>
// //                             {renderMessageContent(msg)}
// //                           </div>
// //                           <div
// //                             style={{
// //                               display: "flex",
// //                               alignItems: "center",
// //                               justifyContent: "flex-end",
// //                               gap: "4px",
// //                               marginTop: "-4px",
// //                             }}>
// //                             {msg.isEdited && (
// //                               <span style={{ fontSize: "8px", opacity: 0.5 }}>
// //                                 edited
// //                               </span>
// //                             )}
// //                             <span style={{ fontSize: "9px", opacity: 0.5 }}>
// //                               {formatTime(msg.createdAt)}
// //                             </span>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </React.Fragment>
// //                   );
// //                 })
// //               )}
// //               <div ref={scrollRef} />
// //             </div>

// //             <form
// //               className="input-area-modern"
// //               onSubmit={sendMessage}
// //               style={{
// //                 padding: "16px",
// //                 gap: "8px",
// //                 borderTop: "1px solid var(--glass-border)",
// //                 background: editingMessage
// //                   ? "rgba(0, 210, 255, 0.08)"
// //                   : "rgba(255,255,255,0.02)",
// //               }}>
// //               {editingMessage && (
// //                 <div
// //                   style={{
// //                     width: "100%",
// //                     display: "flex",
// //                     justifyContent: "space-between",
// //                     alignItems: "center",
// //                     marginBottom: "10px",
// //                   }}>
// //                   <span style={{ fontSize: "11px", color: "#00d2ff" }}>
// //                     Editing message...
// //                   </span>
// //                   <X
// //                     size={14}
// //                     style={{ cursor: "pointer", opacity: 0.7 }}
// //                     onClick={() => {
// //                       setEditingMessage(null);
// //                       setMessage("");
// //                     }}
// //                   />
// //                 </div>
// //               )}
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   gap: "10px",
// //                   width: "100%",
// //                   alignItems: "center",
// //                 }}>
// //                 <input
// //                   type="file"
// //                   ref={fileInputRef}
// //                   style={{ display: "none" }}
// //                   onChange={handleFileUpload}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => fileInputRef.current.click()}
// //                   style={{
// //                     background: "none",
// //                     border: "none",
// //                     color: "var(--accent)",
// //                     cursor: "pointer",
// //                     padding: "5px",
// //                   }}>
// //                   <Paperclip size={20} />
// //                 </button>
// //                 <input
// //                   value={message}
// //                   onChange={(e) => setMessage(e.target.value)}
// //                   placeholder={
// //                     editingMessage ? "Update message..." : "Type a message..."
// //                   }
// //                   className="glass-input-chat"
// //                   style={{
// //                     padding: "12px 16px",
// //                     borderRadius: "12px",
// //                     fontSize: "0.9rem",
// //                     flex: 1,
// //                     background: "rgba(255,255,255,0.05)",
// //                     border: "1px solid rgba(255,255,255,0.1)",
// //                     color: "#fff",
// //                   }}
// //                 />
// //                 <button
// //                   type="submit"
// //                   className="send-btn-neon"
// //                   disabled={!message.trim()}
// //                   style={{
// //                     width: "38px",
// //                     height: "38px",
// //                     borderRadius: "10px",
// //                   }}>
// //                   {editingMessage ? <Check size={18} /> : <Send size={18} />}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// //aab was grt

// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   MessageSquare,
// //   Send,
// //   Hash,
// //   ArrowLeft,
// //   X,
// //   Edit2,
// //   Trash2,
// //   Check,
// //   ChevronDown,
// //   AlertCircle,
// //   Paperclip,
// //   FileText,
// //   ExternalLink,
// //   User as UserIcon,
// //   Image as ImageIcon,
// // } from "lucide-react";

// // export default function ChatDrawer({ socket, user, isOpen, onClose }) {
// //   const [selectedChat, setSelectedChat] = useState(null);
// //   const [employees, setEmployees] = useState([]); // NEW: Store fetched users
// //   const [message, setMessage] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [editingMessage, setEditingMessage] = useState(null);
// //   const [activeMenu, setActiveMenu] = useState(null);
// //   const [deleteModal, setDeleteModal] = useState({ show: false, msgId: null });
// //   const [fullScreenImage, setFullScreenImage] = useState(null);
// //   const [hasUnread, setHasUnread] = useState(false);

// //   const scrollRef = useRef();
// //   const fileInputRef = useRef();

// //   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

// //   // --- Socket Listeners ---
// //   useEffect(() => {
// //     if (!socket) return;

// //     // Fetch initial users
// //     socket.emit("get_users");

// //     socket.on("user_list", (data) => setEmployees(data));

// //     socket.on("private_chat_ready", (data) => {
// //       setSelectedChat({
// //         id: data.conversationId,
// //         name: data.name,
// //         type: "private",
// //       });
// //     });

// //     const handleReceiveMessage = (msg) => {
// //       if (
// //         msg.conversationId === "global_all" &&
// //         selectedChat?.id !== "global_all"
// //       ) {
// //         setHasUnread(true);
// //       }
// //       if (msg.conversationId === selectedChat?.id) {
// //         setMessages((prev) => [...prev, msg]);
// //       }
// //     };

// //     const handleChatHistory = (history) => setMessages(history);
// //     const handleUpdateMessage = (updatedMsg) => {
// //       setMessages((prev) =>
// //         prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
// //       );
// //     };
// //     const handleDeleteMessage = (messageId) => {
// //       setMessages((prev) => prev.filter((m) => m._id !== messageId));
// //     };

// //     socket.on("receive_message", handleReceiveMessage);
// //     socket.on("chat_history", handleChatHistory);
// //     socket.on("message_updated", handleUpdateMessage);
// //     socket.on("message_deleted", handleDeleteMessage);

// //     return () => {
// //       socket.off("user_list");
// //       socket.off("private_chat_ready");
// //       socket.off("receive_message", handleReceiveMessage);
// //       socket.off("chat_history", handleChatHistory);
// //       socket.off("message_updated", handleUpdateMessage);
// //       socket.off("message_deleted", handleDeleteMessage);
// //     };
// //   }, [socket, selectedChat]);

// //   useEffect(() => {
// //     if (selectedChat && socket) {
// //       setMessages([]);
// //       socket.emit("join_room", selectedChat.id);
// //       if (selectedChat.id === "global_all") setHasUnread(false);
// //     }
// //   }, [selectedChat, socket]);

// //   useEffect(() => {
// //     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   // --- Actions ---
// //   const startPrivateChat = (targetUser) => {
// //     socket.emit("start_private_chat", {
// //       participantId: targetUser._id,
// //       userId: user.id,
// //     });
// //     // Set temp name until ID comes back from socket
// //     setSelectedChat({ id: "loading", name: targetUser.name, type: "private" });
// //   };

// //   const sendMessage = (e) => {
// //     e.preventDefault();
// //     if (
// //       !message.trim() ||
// //       !selectedChat ||
// //       !socket ||
// //       selectedChat.id === "loading"
// //     )
// //       return;

// //     if (editingMessage) {
// //       socket.emit("edit_message", {
// //         messageId: editingMessage._id,
// //         text: message,
// //         conversationId: selectedChat.id,
// //       });
// //       setEditingMessage(null);
// //     } else {
// //       const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());
// //       socket.emit("send_message", {
// //         conversationId: selectedChat.id,
// //         text: message,
// //         senderId: user.id,
// //         senderName: user.name,
// //         fileType: isLink ? "link" : "text",
// //       });
// //     }
// //     setMessage("");
// //   };

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file || !socket || !selectedChat) return;
// //     const reader = new FileReader();
// //     reader.onloadend = () => {
// //       socket.emit("send_message", {
// //         conversationId: selectedChat.id,
// //         senderId: user.id,
// //         senderName: user.name,
// //         text: "",
// //         fileUrl: reader.result,
// //         fileName: file.name,
// //         fileType: file.type.startsWith("image/") ? "image" : "doc",
// //       });
// //     };
// //     reader.readAsDataURL(file);
// //     e.target.value = null;
// //   };

// //   const renderMessageContent = (msg) => {
// //     if (msg.fileType === "image") {
// //       return (
// //         <img
// //           src={msg.fileUrl}
// //           alt="upload"
// //           style={{ maxWidth: "250px", borderRadius: "8px", cursor: "pointer" }}
// //           onClick={() => setFullScreenImage(msg.fileUrl)}
// //         />
// //       );
// //     }
// //     if (msg.fileType === "doc") {
// //       return (
// //         <a
// //           href={msg.fileUrl}
// //           download={msg.fileName}
// //           style={{
// //             display: "flex",
// //             alignItems: "center",
// //             gap: "8px",
// //             color: "inherit",
// //             textDecoration: "none",
// //             background: "rgba(255,255,255,0.1)",
// //             padding: "8px",
// //             borderRadius: "8px",
// //           }}>
// //           <FileText size={18} />{" "}
// //           <span style={{ fontSize: "0.7rem" }}>{msg.fileName}</span>
// //         </a>
// //       );
// //     }
// //     return msg.text;
// //   };

// //   const formatTime = (dateStr) =>
// //     dateStr
// //       ? new Date(dateStr).toLocaleTimeString([], {
// //           hour: "2-digit",
// //           minute: "2-digit",
// //         })
// //       : "";

// //   return (
// //     <div
// //       className={`page-content glass ${isOpen ? "open" : ""}`}
// //       style={{
// //         display: "flex",
// //         flexDirection: "column",
// //         overflow: "hidden",
// //         position: "relative",
// //       }}>
// //       {/* FULLSCREEN IMAGE */}
// //       {fullScreenImage && (
// //         <div
// //           style={{
// //             position: "absolute",
// //             inset: 0,
// //             zIndex: 200,
// //             background: "rgba(0,0,0,0.9)",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //           }}
// //           onClick={() => setFullScreenImage(null)}>
// //           <img
// //             src={fullScreenImage}
// //             alt="Full size"
// //             style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
// //           />
// //         </div>
// //       )}

// //       {/* HEADER */}
// //       <div
// //         className="chat-header"
// //         style={{
// //           padding: "12px 16px",
// //           borderBottom: "1px solid var(--glass-border)",
// //           display: "flex",
// //           alignItems: "center",
// //         }}>
// //         {!selectedChat ? (
// //           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //             <MessageSquare size={18} color="var(--accent)" />
// //             <h4 style={{ margin: 0, fontSize: "0.9rem" }}>Messenger</h4>
// //           </div>
// //         ) : (
// //           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
// //             <button
// //               onClick={() => setSelectedChat(null)}
// //               style={{
// //                 background: "none",
// //                 border: "none",
// //                 color: "white",
// //                 cursor: "pointer",
// //               }}>
// //               <ArrowLeft size={18} />
// //             </button>
// //             <h4 style={{ margin: 0, fontSize: "0.9rem" }}>
// //               {selectedChat.name}
// //             </h4>
// //           </div>
// //         )}
// //       </div>

// //       <div
// //         className="chat-body"
// //         style={{
// //           flex: 1,
// //           display: "flex",
// //           flexDirection: "column",
// //           overflow: "hidden",
// //         }}>
// //         {!selectedChat ? (
// //           <div
// //             className="feed-scroll"
// //             style={{ padding: "10px", overflowY: "auto" }}>
// //             {/* GROUPS */}
// //             <p
// //               className="mini-label"
// //               style={{ opacity: 0.6, fontSize: "0.7rem", paddingLeft: "10px" }}>
// //               CHANNELS
// //             </p>
// //             {groups.map((group) => (
// //               <div
// //                 key={group.id}
// //                 className="chat-item"
// //                 onClick={() => setSelectedChat(group)}
// //                 style={{ position: "relative", cursor: "pointer" }}>
// //                 <div className="group-icon-hex global">
// //                   <Hash size={14} />
// //                 </div>
// //                 <div className="chat-details">
// //                   <span className="chat-name">{group.name}</span>
// //                 </div>
// //                 {hasUnread && (
// //                   <div
// //                     style={{
// //                       position: "absolute",
// //                       right: "15px",
// //                       width: "8px",
// //                       height: "8px",
// //                       background: "#ff4444",
// //                       borderRadius: "50%",
// //                     }}
// //                   />
// //                 )}
// //               </div>
// //             ))}

// //             {/* EMPLOYEES LIST */}
// //             <p
// //               className="mini-label"
// //               style={{
// //                 opacity: 0.6,
// //                 fontSize: "0.7rem",
// //                 paddingLeft: "10px",
// //                 marginTop: "20px",
// //               }}>
// //               DIRECT MESSAGES
// //             </p>
// //             {employees.length > 0 ? (
// //               employees.map((emp) => (
// //                 <div
// //                   key={emp._id}
// //                   className="chat-item"
// //                   onClick={() => startPrivateChat(emp)}
// //                   style={{ cursor: "pointer" }}>
// //                   <div
// //                     className="group-icon-hex"
// //                     style={{ background: "rgba(255,255,255,0.05)" }}>
// //                     <UserIcon size={14} />
// //                   </div>
// //                   <div className="chat-details">
// //                     <span className="chat-name">{emp.name}</span>
// //                     <span className="mini-label" style={{ fontSize: "10px" }}>
// //                       {emp.role} • {emp.pulseStatus}
// //                     </span>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p
// //                 style={{
// //                   fontSize: "0.7rem",
// //                   textAlign: "center",
// //                   marginTop: "10px",
// //                   opacity: 0.5,
// //                 }}>
// //                 No other employees online
// //               </p>
// //             )}
// //           </div>
// //         ) : (
// //           <div
// //             style={{
// //               display: "flex",
// //               flexDirection: "column",
// //               height: "100%",
// //             }}>
// //             <div
// //               className="message-area feed-scroll"
// //               style={{ flex: 1, padding: "20px 14px", overflowY: "auto" }}>
// //               {messages.map((msg, i) => {
// //                 const isMine =
// //                   msg.sender === user.id || msg.senderId === user.id;
// //                 return (
// //                   <div
// //                     key={msg._id || i}
// //                     style={{
// //                       display: "flex",
// //                       flexDirection: "column",
// //                       alignItems: isMine ? "flex-end" : "flex-start",
// //                       marginBottom: "12px",
// //                     }}>
// //                     <div
// //                       className={`msg-bubble ${isMine ? "mine" : "theirs"}`}
// //                       style={{
// //                         padding: "10px 14px",
// //                         borderRadius: "12px",
// //                         maxWidth: "80%",
// //                         background: isMine
// //                           ? "var(--accent)"
// //                           : "rgba(255,255,255,0.1)",
// //                         color: isMine ? "#000" : "#fff",
// //                       }}>
// //                       {!isMine && (
// //                         <div
// //                           style={{
// //                             fontSize: "0.65rem",
// //                             fontWeight: "bold",
// //                             marginBottom: "4px",
// //                             color: "var(--accent)",
// //                           }}>
// //                           {msg.senderName}
// //                         </div>
// //                       )}
// //                       {renderMessageContent(msg)}
// //                       <div
// //                         style={{
// //                           fontSize: "0.6rem",
// //                           textAlign: "right",
// //                           marginTop: "4px",
// //                           opacity: 0.6,
// //                         }}>
// //                         {formatTime(msg.createdAt)}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //               <div ref={scrollRef} />
// //             </div>

// //             <form
// //               className="input-area-modern"
// //               onSubmit={sendMessage}
// //               style={{
// //                 padding: "12px",
// //                 display: "flex",
// //                 gap: "8px",
// //                 borderTop: "1px solid rgba(255,255,255,0.1)",
// //               }}>
// //               <input
// //                 type="file"
// //                 ref={fileInputRef}
// //                 style={{ display: "none" }}
// //                 onChange={handleFileUpload}
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => fileInputRef.current.click()}
// //                 style={{
// //                   background: "none",
// //                   border: "none",
// //                   color: "var(--accent)",
// //                 }}>
// //                 <Paperclip size={18} />
// //               </button>
// //               <input
// //                 value={message}
// //                 onChange={(e) => setMessage(e.target.value)}
// //                 placeholder="Type message..."
// //                 style={{
// //                   flex: 1,
// //                   background: "rgba(255,255,255,0.05)",
// //                   border: "none",
// //                   borderRadius: "8px",
// //                   padding: "8px 12px",
// //                   color: "white",
// //                 }}
// //               />
// //               <button
// //                 type="submit"
// //                 disabled={!message.trim() || selectedChat.id === "loading"}
// //                 style={{
// //                   background: "var(--accent)",
// //                   border: "none",
// //                   borderRadius: "8px",
// //                   padding: "8px",
// //                 }}>
// //                 <Send size={18} />
// //               </button>
// //             </form>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useRef } from "react";
// import {
//   MessageSquare,
//   Send,
//   Hash,
//   ArrowLeft,
//   X,
//   Edit2,
//   Trash2,
//   Check,
//   ChevronDown,
//   AlertCircle,
//   Paperclip,
//   FileText,
//   ExternalLink,
//   User as UserIcon,
//   Image as ImageIcon,
// } from "lucide-react";

// export default function ChatDrawer({ socket, user, isOpen, onClose }) {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [deleteModal, setDeleteModal] = useState({ show: false, msgId: null });
//   const [fullScreenImage, setFullScreenImage] = useState(null);
//   const [hasUnread, setHasUnread] = useState(false);

//   const scrollRef = useRef();
//   const fileInputRef = useRef();

//   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

//   // --- Socket Listeners ---
//   useEffect(() => {
//     if (!socket) return;

//     // Fetch initial users
//     socket.emit("get_users");

//     socket.on("user_list", (data) => {
//       // Filter out the current user so they can't chat with themselves
//       const filtered = data.filter((emp) => emp._id !== user.id);
//       setEmployees(filtered);
//     });

//     socket.on("private_chat_ready", (data) => {
//       setSelectedChat({
//         id: data.conversationId,
//         name: data.name || "Direct Message",
//         type: "private",
//       });
//     });

//     const handleReceiveMessage = (msg) => {
//       if (
//         msg.conversationId === "global_all" &&
//         selectedChat?.id !== "global_all"
//       ) {
//         setHasUnread(true);
//       }
//       if (msg.conversationId === selectedChat?.id) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     };

//     const handleChatHistory = (history) => setMessages(history);
//     const handleUpdateMessage = (updatedMsg) => {
//       setMessages((prev) =>
//         prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
//       );
//     };
//     const handleDeleteMessage = (messageId) => {
//       setMessages((prev) => prev.filter((m) => m._id !== messageId));
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("chat_history", handleChatHistory);
//     socket.on("message_updated", handleUpdateMessage);
//     socket.on("message_deleted", handleDeleteMessage);

//     return () => {
//       socket.off("user_list");
//       socket.off("private_chat_ready");
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("chat_history", handleChatHistory);
//       socket.off("message_updated", handleUpdateMessage);
//       socket.off("message_deleted", handleDeleteMessage);
//     };
//   }, [socket, selectedChat, user.id]);

//   useEffect(() => {
//     if (selectedChat && socket && selectedChat.id !== "loading") {
//       setMessages([]);
//       socket.emit("join_room", selectedChat.id);
//       if (selectedChat.id === "global_all") setHasUnread(false);
//     }
//   }, [selectedChat, socket]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- Actions ---
//   const startPrivateChat = (targetUser) => {
//     socket.emit("start_private_chat", {
//       participantId: targetUser._id,
//       userId: user.id,
//     });
//     // Set temp state to prevent interaction until server responds
//     setSelectedChat({ id: "loading", name: targetUser.name, type: "private" });
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (
//       !message.trim() ||
//       !selectedChat ||
//       !socket ||
//       selectedChat.id === "loading"
//     )
//       return;

//     if (editingMessage) {
//       socket.emit("edit_message", {
//         messageId: editingMessage._id,
//         text: message,
//         conversationId: selectedChat.id,
//       });
//       setEditingMessage(null);
//     } else {
//       const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());
//       socket.emit("send_message", {
//         conversationId: selectedChat.id,
//         text: message,
//         senderId: user.id,
//         senderName: user.name,
//         fileType: isLink ? "link" : "text",
//       });
//     }
//     setMessage("");
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file || !socket || !selectedChat) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       socket.emit("send_message", {
//         conversationId: selectedChat.id,
//         senderId: user.id,
//         senderName: user.name,
//         text: "",
//         fileUrl: reader.result,
//         fileName: file.name,
//         fileType: file.type.startsWith("image/") ? "image" : "doc",
//       });
//     };
//     reader.readAsDataURL(file);
//     e.target.value = null;
//   };

//   const renderMessageContent = (msg) => {
//     if (msg.fileType === "image") {
//       return (
//         <img
//           src={msg.fileUrl}
//           alt="upload"
//           style={{ maxWidth: "250px", borderRadius: "8px", cursor: "pointer" }}
//           onClick={() => setFullScreenImage(msg.fileUrl)}
//         />
//       );
//     }
//     if (msg.fileType === "doc") {
//       return (
//         <a
//           href={msg.fileUrl}
//           download={msg.fileName}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             color: "inherit",
//             textDecoration: "none",
//             background: "rgba(255,255,255,0.1)",
//             padding: "8px",
//             borderRadius: "8px",
//           }}>
//           <FileText size={18} />
//           <span style={{ fontSize: "0.7rem" }}>{msg.fileName}</span>
//         </a>
//       );
//     }
//     return msg.text;
//   };

//   const formatTime = (dateStr) =>
//     dateStr
//       ? new Date(dateStr).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//   return (
//     <div
//       className={`page-content glass ${isOpen ? "open" : ""}`}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         position: "relative",
//       }}>
//       {/* FULLSCREEN IMAGE */}
//       {fullScreenImage && (
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             zIndex: 200,
//             background: "rgba(0,0,0,0.9)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           onClick={() => setFullScreenImage(null)}>
//           <img
//             src={fullScreenImage}
//             alt="Full size"
//             style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
//           />
//         </div>
//       )}

//       {/* HEADER */}
//       <div
//         className="chat-header"
//         style={{
//           padding: "12px 16px",
//           borderBottom: "1px solid var(--glass-border)",
//           display: "flex",
//           alignItems: "center",
//         }}>
//         {!selectedChat ? (
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <MessageSquare size={18} color="var(--accent)" />
//             <h4 style={{ margin: 0, fontSize: "0.9rem" }}>Messenger</h4>
//           </div>
//         ) : (
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <button
//               onClick={() => setSelectedChat(null)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "white",
//                 cursor: "pointer",
//               }}>
//               <ArrowLeft size={18} />
//             </button>
//             <h4 style={{ margin: 0, fontSize: "0.9rem" }}>
//               {selectedChat.name}
//             </h4>
//           </div>
//         )}
//       </div>

//       <div
//         className="chat-body"
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}>
//         {!selectedChat ? (
//           <div
//             className="feed-scroll"
//             style={{ padding: "10px", overflowY: "auto" }}>
//             {/* GROUPS */}
//             <p
//               className="mini-label"
//               style={{ opacity: 0.6, fontSize: "0.7rem", paddingLeft: "10px" }}>
//               CHANNELS
//             </p>
//             {groups.map((group) => (
//               <div
//                 key={group.id}
//                 className="chat-item"
//                 onClick={() => setSelectedChat(group)}
//                 style={{ position: "relative", cursor: "pointer" }}>
//                 <div className="group-icon-hex global">
//                   <Hash size={14} />
//                 </div>
//                 <div className="chat-details">
//                   <span className="chat-name">{group.name}</span>
//                 </div>
//                 {hasUnread && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       right: "15px",
//                       width: "8px",
//                       height: "8px",
//                       background: "#ff4444",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 )}
//               </div>
//             ))}

//             {/* EMPLOYEES LIST */}
//             <p
//               className="mini-label"
//               style={{
//                 opacity: 0.6,
//                 fontSize: "0.7rem",
//                 paddingLeft: "10px",
//                 marginTop: "20px",
//               }}>
//               DIRECT MESSAGES
//             </p>
//             {employees.length > 0 ? (
//               employees.map((emp) => (
//                 <div
//                   key={emp._id}
//                   className="chat-item"
//                   onClick={() => startPrivateChat(emp)}
//                   style={{ cursor: "pointer" }}>
//                   <div
//                     className="group-icon-hex"
//                     style={{ background: "rgba(255,255,255,0.05)" }}>
//                     <UserIcon size={14} />
//                   </div>
//                   <div className="chat-details">
//                     <span className="chat-name">{emp.name}</span>
//                     <span className="mini-label" style={{ fontSize: "10px" }}>
//                       {emp.role} • {emp.pulseStatus}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p
//                 style={{
//                   fontSize: "0.7rem",
//                   textAlign: "center",
//                   marginTop: "10px",
//                   opacity: 0.5,
//                 }}>
//                 No other employees online
//               </p>
//             )}
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               height: "100%",
//             }}>
//             <div
//               className="message-area feed-scroll"
//               style={{ flex: 1, padding: "20px 14px", overflowY: "auto" }}>
//               {messages.map((msg, i) => {
//                 const isMine =
//                   msg.sender === user.id || msg.senderId === user.id;
//                 return (
//                   <div
//                     key={msg._id || i}
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: isMine ? "flex-end" : "flex-start",
//                       marginBottom: "12px",
//                     }}>
//                     <div
//                       className={`msg-bubble ${isMine ? "mine" : "theirs"}`}
//                       style={{
//                         padding: "10px 14px",
//                         borderRadius: "12px",
//                         maxWidth: "80%",
//                         background: isMine
//                           ? "var(--accent)"
//                           : "rgba(255,255,255,0.1)",
//                         color: isMine ? "#000" : "#fff",
//                       }}>
//                       {!isMine && (
//                         <div
//                           style={{
//                             fontSize: "0.65rem",
//                             fontWeight: "bold",
//                             marginBottom: "4px",
//                             color: "var(--accent)",
//                           }}>
//                           {msg.senderName}
//                         </div>
//                       )}
//                       {renderMessageContent(msg)}
//                       <div
//                         style={{
//                           fontSize: "0.6rem",
//                           textAlign: "right",
//                           marginTop: "4px",
//                           opacity: 0.6,
//                         }}>
//                         {formatTime(msg.createdAt)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>

//             <form
//               className="input-area-modern"
//               onSubmit={sendMessage}
//               style={{
//                 padding: "12px",
//                 display: "flex",
//                 gap: "8px",
//                 borderTop: "1px solid rgba(255,255,255,0.1)",
//               }}>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleFileUpload}
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   color: "var(--accent)",
//                 }}>
//                 <Paperclip size={18} />
//               </button>
//               <input
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type message..."
//                 style={{
//                   flex: 1,
//                   background: "rgba(255,255,255,0.05)",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "8px 12px",
//                   color: "white",
//                 }}
//               />
//               <button
//                 type="submit"
//                 disabled={!message.trim() || selectedChat.id === "loading"}
//                 style={{
//                   background: "var(--accent)",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "8px",
//                 }}>
//                 <Send size={18} />
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import {
//   MessageSquare,
//   Send,
//   Hash,
//   ArrowLeft,
//   X,
//   Edit2,
//   Trash2,
//   Check,
//   ChevronDown,
//   AlertCircle,
//   Paperclip,
//   FileText,
//   ExternalLink,
//   User as UserIcon,
//   Image as ImageIcon,
// } from "lucide-react";

// export default function ChatDrawer({ socket, user, isOpen, onClose }) {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [deleteModal, setDeleteModal] = useState({ show: false, msgId: null });
//   const [fullScreenImage, setFullScreenImage] = useState(null);
//   const [hasUnread, setHasUnread] = useState(false);

//   const scrollRef = useRef();
//   const fileInputRef = useRef();

//   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

//   // --- Socket Listeners ---
//   useEffect(() => {
//     if (!socket) return;

//     socket.emit("get_users");

//     socket.on("user_list", (data) => {
//       const filtered = data.filter((emp) => emp._id !== user.id);
//       setEmployees(filtered);
//     });

//     socket.on("private_chat_ready", (data) => {
//       setSelectedChat({
//         id: data.conversationId,
//         name: data.name || "Direct Message",
//         type: "private",
//       });
//     });

//     const handleReceiveMessage = (msg) => {
//       if (
//         msg.conversationId === "global_all" &&
//         selectedChat?.id !== "global_all"
//       ) {
//         setHasUnread(true);
//       }

//       if (msg.conversationId === selectedChat?.id) {
//         setMessages((prev) => {
//           // Prevent duplicates if the message we just received is our own optimistic update
//           // We check for DB _id matching existing messages or tempId matching
//           const isDuplicate = prev.some(
//             (m) =>
//               (msg._id && m._id === msg._id) ||
//               (msg.tempId && m.tempId === msg.tempId),
//           );
//           if (isDuplicate) return prev;
//           return [...prev, msg];
//         });
//       }
//     };

//     const handleChatHistory = (history) => setMessages(history);

//     const handleUpdateMessage = (updatedMsg) => {
//       setMessages((prev) =>
//         prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
//       );
//     };

//     const handleDeleteMessage = (messageId) => {
//       setMessages((prev) => prev.filter((m) => m._id !== messageId));
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("chat_history", handleChatHistory);
//     socket.on("message_updated", handleUpdateMessage);
//     socket.on("message_deleted", handleDeleteMessage);

//     return () => {
//       socket.off("user_list");
//       socket.off("private_chat_ready");
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("chat_history", handleChatHistory);
//       socket.off("message_updated", handleUpdateMessage);
//       socket.off("message_deleted", handleDeleteMessage);
//     };
//   }, [socket, selectedChat, user.id]);

//   useEffect(() => {
//     if (selectedChat && socket && selectedChat.id !== "loading") {
//       setMessages([]);
//       socket.emit("join_room", selectedChat.id);
//       if (selectedChat.id === "global_all") setHasUnread(false);
//     }
//   }, [selectedChat, socket]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- Actions ---
//   const startPrivateChat = (targetUser) => {
//     socket.emit("start_private_chat", {
//       participantId: targetUser._id,
//       userId: user.id,
//     });
//     setSelectedChat({ id: "loading", name: targetUser.name, type: "private" });
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (
//       !message.trim() ||
//       !selectedChat ||
//       !socket ||
//       selectedChat.id === "loading"
//     )
//       return;

//     if (editingMessage) {
//       socket.emit("edit_message", {
//         messageId: editingMessage._id,
//         text: message,
//         conversationId: selectedChat.id,
//       });
//       setEditingMessage(null);
//     } else {
//       const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());
//       const tempId = Date.now().toString();

//       const optimisticMessage = {
//         _id: tempId,
//         tempId: tempId,
//         conversationId: selectedChat.id,
//         text: message,
//         senderId: user.id,
//         senderName: user.name,
//         fileType: isLink ? "link" : "text",
//         createdAt: new Date().toISOString(),
//       };

//       // IMMEDIATELY update UI for both Direct Messages and The Hub
//       setMessages((prev) => [...prev, optimisticMessage]);

//       socket.emit("send_message", {
//         conversationId: selectedChat.id,
//         text: message,
//         senderId: user.id,
//         senderName: user.name,
//         fileType: isLink ? "link" : "text",
//         tempId: tempId, // Pass tempId to server so it can echo it back for deduplication
//       });
//     }
//     setMessage("");
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file || !socket || !selectedChat) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const tempId = Date.now().toString();
//       const optimisticFile = {
//         _id: tempId,
//         tempId: tempId,
//         conversationId: selectedChat.id,
//         senderId: user.id,
//         senderName: user.name,
//         text: "",
//         fileUrl: reader.result,
//         fileName: file.name,
//         fileType: file.type.startsWith("image/") ? "image" : "doc",
//         createdAt: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, optimisticFile]);

//       socket.emit("send_message", {
//         ...optimisticFile,
//         _id: undefined, // Let server generate real ID
//       });
//     };
//     reader.readAsDataURL(file);
//     e.target.value = null;
//   };

//   const renderMessageContent = (msg) => {
//     if (msg.fileType === "image") {
//       return (
//         <img
//           src={msg.fileUrl}
//           alt="upload"
//           style={{ maxWidth: "250px", borderRadius: "8px", cursor: "pointer" }}
//           onClick={() => setFullScreenImage(msg.fileUrl)}
//         />
//       );
//     }
//     if (msg.fileType === "doc") {
//       return (
//         <a
//           href={msg.fileUrl}
//           download={msg.fileName}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             color: "inherit",
//             textDecoration: "none",
//             background: "rgba(255,255,255,0.1)",
//             padding: "8px",
//             borderRadius: "8px",
//           }}>
//           <FileText size={18} />
//           <span style={{ fontSize: "0.7rem" }}>{msg.fileName}</span>
//         </a>
//       );
//     }
//     return msg.text;
//   };

//   const formatTime = (dateStr) =>
//     dateStr
//       ? new Date(dateStr).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//   return (
//     <div
//       className={`page-content glass ${isOpen ? "open" : ""}`}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//         position: "relative",
//       }}>
//       {fullScreenImage && (
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             zIndex: 200,
//             background: "rgba(0,0,0,0.9)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           onClick={() => setFullScreenImage(null)}>
//           <img
//             src={fullScreenImage}
//             alt="Full size"
//             style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
//           />
//         </div>
//       )}

//       <div
//         className="chat-header"
//         style={{
//           padding: "12px 16px",
//           borderBottom: "1px solid var(--glass-border)",
//           display: "flex",
//           alignItems: "center",
//         }}>
//         {!selectedChat ? (
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <MessageSquare size={18} color="var(--accent)" />
//             <h4 style={{ margin: 0, fontSize: "0.9rem" }}>Messenger</h4>
//           </div>
//         ) : (
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <button
//               onClick={() => setSelectedChat(null)}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "white",
//                 cursor: "pointer",
//               }}>
//               <ArrowLeft size={18} />
//             </button>
//             <h4 style={{ margin: 0, fontSize: "0.9rem" }}>
//               {selectedChat.name}
//             </h4>
//           </div>
//         )}
//       </div>

//       <div
//         className="chat-body"
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}>
//         {!selectedChat ? (
//           <div
//             className="feed-scroll"
//             style={{ padding: "10px", overflowY: "auto" }}>
//             <p
//               className="mini-label"
//               style={{ opacity: 0.6, fontSize: "0.7rem", paddingLeft: "10px" }}>
//               CHANNELS
//             </p>
//             {groups.map((group) => (
//               <div
//                 key={group.id}
//                 className="chat-item"
//                 onClick={() => setSelectedChat(group)}
//                 style={{ position: "relative", cursor: "pointer" }}>
//                 <div className="group-icon-hex global">
//                   <Hash size={14} />
//                 </div>
//                 <div className="chat-details">
//                   <span className="chat-name">{group.name}</span>
//                 </div>
//                 {hasUnread && (
//                   <div
//                     style={{
//                       position: "absolute",
//                       right: "15px",
//                       width: "8px",
//                       height: "8px",
//                       background: "#ff4444",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 )}
//               </div>
//             ))}

//             <p
//               className="mini-label"
//               style={{
//                 opacity: 0.6,
//                 fontSize: "0.7rem",
//                 paddingLeft: "10px",
//                 marginTop: "20px",
//               }}>
//               DIRECT MESSAGES
//             </p>
//             {employees.length > 0 ? (
//               employees.map((emp) => (
//                 <div
//                   key={emp._id}
//                   className="chat-item"
//                   onClick={() => startPrivateChat(emp)}
//                   style={{ cursor: "pointer" }}>
//                   <div
//                     className="group-icon-hex"
//                     style={{ background: "rgba(255,255,255,0.05)" }}>
//                     <UserIcon size={14} />
//                   </div>
//                   <div className="chat-details">
//                     <span className="chat-name">{emp.name}</span>
//                     <span className="mini-label" style={{ fontSize: "10px" }}>
//                       {emp.role} • {emp.pulseStatus}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p
//                 style={{
//                   fontSize: "0.7rem",
//                   textAlign: "center",
//                   marginTop: "10px",
//                   opacity: 0.5,
//                 }}>
//                 No other employees online
//               </p>
//             )}
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               height: "100%",
//             }}>
//             <div
//               className="message-area feed-scroll"
//               style={{ flex: 1, padding: "20px 14px", overflowY: "auto" }}>
//               {messages.map((msg, i) => {
//                 const isMine =
//                   msg.sender === user.id || msg.senderId === user.id;
//                 return (
//                   <div
//                     key={msg._id || i}
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: isMine ? "flex-end" : "flex-start",
//                       marginBottom: "12px",
//                     }}>
//                     <div
//                       className={`msg-bubble ${isMine ? "mine" : "theirs"}`}
//                       style={{
//                         padding: "10px 14px",
//                         borderRadius: "12px",
//                         maxWidth: "80%",
//                         background: isMine
//                           ? "var(--accent)"
//                           : "rgba(255,255,255,0.1)",
//                         color: isMine ? "#000" : "#fff",
//                       }}>
//                       {!isMine && (
//                         <div
//                           style={{
//                             fontSize: "0.65rem",
//                             fontWeight: "bold",
//                             marginBottom: "4px",
//                             color: "var(--accent)",
//                           }}>
//                           {msg.senderName}
//                         </div>
//                       )}
//                       {renderMessageContent(msg)}
//                       <div
//                         style={{
//                           fontSize: "0.6rem",
//                           textAlign: "right",
//                           marginTop: "4px",
//                           opacity: 0.6,
//                         }}>
//                         {formatTime(msg.createdAt)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>

//             <form
//               className="input-area-modern"
//               onSubmit={sendMessage}
//               style={{
//                 padding: "12px",
//                 display: "flex",
//                 gap: "8px",
//                 borderTop: "1px solid rgba(255,255,255,0.1)",
//               }}>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleFileUpload}
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   color: "var(--accent)",
//                 }}>
//                 <Paperclip size={18} />
//               </button>
//               <input
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type message..."
//                 style={{
//                   flex: 1,
//                   background: "rgba(255,255,255,0.05)",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "8px 12px",
//                   color: "white",
//                 }}
//               />
//               <button
//                 type="submit"
//                 disabled={!message.trim() || selectedChat.id === "loading"}
//                 style={{
//                   background: "var(--accent)",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "8px",
//                 }}>
//                 <Send size={18} />
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//ab was grt

// import React, { useState, useEffect, useRef } from "react";
// import {
//   MessageSquare,
//   Send,
//   Hash,
//   ArrowLeft,
//   X,
//   Edit2,
//   Trash2,
//   Check,
//   ChevronDown,
//   AlertCircle,
//   Paperclip,
//   FileText,
//   ExternalLink,
//   User as UserIcon,
//   Image as ImageIcon,
// } from "lucide-react";

// export default function ChatDrawer({ socket, user, isOpen, onClose }) {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [editingMessage, setEditingMessage] = useState(null);
//   const [fullScreenImage, setFullScreenImage] = useState(null);
//   const [hasUnread, setHasUnread] = useState(false);

//   const scrollRef = useRef();
//   const fileInputRef = useRef();

//   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

//   // --- Socket Listeners ---
//   useEffect(() => {
//     if (!socket) return;

//     socket.emit("get_users");

//     socket.on("user_list", (data) => {
//       const filtered = data.filter((emp) => emp._id !== user.id);
//       setEmployees(filtered);
//     });

//     socket.on("private_chat_ready", (data) => {
//       setSelectedChat({
//         id: data.conversationId,
//         name: data.name || "Direct Message",
//         type: "private",
//       });
//     });

//     const handleReceiveMessage = (msg) => {
//       if (
//         msg.conversationId === "global_all" &&
//         selectedChat?.id !== "global_all"
//       ) {
//         setHasUnread(true);
//       }

//       if (msg.conversationId === selectedChat?.id) {
//         setMessages((prev) => {
//           const isDuplicate = prev.some(
//             (m) =>
//               (msg._id && m._id === msg._id) ||
//               (msg.tempId && m.tempId === msg.tempId),
//           );
//           if (isDuplicate) return prev;
//           return [...prev, msg];
//         });
//       }
//     };

//     const handleChatHistory = (history) => setMessages(history);
//     const handleUpdateMessage = (updatedMsg) => {
//       setMessages((prev) =>
//         prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
//       );
//     };
//     const handleDeleteMessage = (messageId) => {
//       setMessages((prev) => prev.filter((m) => m._id !== messageId));
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("chat_history", handleChatHistory);
//     socket.on("message_updated", handleUpdateMessage);
//     socket.on("message_deleted", handleDeleteMessage);

//     return () => {
//       socket.off("user_list");
//       socket.off("private_chat_ready");
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("chat_history", handleChatHistory);
//       socket.off("message_updated", handleUpdateMessage);
//       socket.off("message_deleted", handleDeleteMessage);
//     };
//   }, [socket, selectedChat, user.id]);

//   useEffect(() => {
//     if (selectedChat && socket && selectedChat.id !== "loading") {
//       setMessages([]);
//       socket.emit("join_room", selectedChat.id);
//       if (selectedChat.id === "global_all") setHasUnread(false);
//     }
//   }, [selectedChat, socket]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (
//       !message.trim() ||
//       !selectedChat ||
//       !socket ||
//       selectedChat.id === "loading"
//     )
//       return;

//     const tempId = Date.now().toString();
//     const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());

//     const optimisticMessage = {
//       _id: tempId,
//       tempId: tempId,
//       conversationId: selectedChat.id,
//       text: message,
//       senderId: user.id,
//       senderName: user.name,
//       fileType: isLink ? "link" : "text",
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, optimisticMessage]);

//     socket.emit("send_message", {
//       conversationId: selectedChat.id,
//       text: message,
//       senderId: user.id,
//       senderName: user.name,
//       fileType: isLink ? "link" : "text",
//       tempId: tempId,
//     });
//     setMessage("");
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file || !socket || !selectedChat) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const tempId = Date.now().toString();
//       const optimisticFile = {
//         _id: tempId,
//         tempId: tempId,
//         conversationId: selectedChat.id,
//         senderId: user.id,
//         senderName: user.name,
//         text: "",
//         fileUrl: reader.result,
//         fileName: file.name,
//         fileType: file.type.startsWith("image/") ? "image" : "doc",
//         createdAt: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, optimisticFile]);
//       socket.emit("send_message", { ...optimisticFile, _id: undefined });
//     };
//     reader.readAsDataURL(file);
//     e.target.value = null;
//   };

//   const formatTime = (dateStr) =>
//     dateStr
//       ? new Date(dateStr).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//   return (
//     <div
//       className={`page-content glass ${isOpen ? "open" : ""}`}
//       style={{
//         height: "100%",
//         width: "100%",
//         maxWidth: "100%",
//         borderLeft: "1px solid var(--glass-border)",
//         borderRadius: "0 18px 18px 0",
//         background: "rgba(15, 23, 42, 0.8)",
//       }}>
//       {/* Header */}
//       <div
//         style={{
//           padding: "20px",
//           borderBottom: "1px solid var(--glass-border)",
//           display: "flex",
//           alignItems: "center",
//           gap: "12px",
//         }}>
//         {selectedChat ? (
//           <button
//             onClick={() => setSelectedChat(null)}
//             className="nav-link"
//             style={{ width: "40px", padding: "8px", marginBottom: 0 }}>
//             <ArrowLeft size={18} />
//           </button>
//         ) : (
//           <MessageSquare size={20} color="var(--accent)" />
//         )}
//         <div>
//           <h3 style={{ fontSize: "1rem" }}>
//             {selectedChat ? selectedChat.name : "Intelligence Feed"}
//           </h3>
//           <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
//             {selectedChat
//               ? selectedChat.type === "global"
//                 ? "System-wide Channel"
//                 : "Encrypted Direct"
//               : "Active Connections"}
//           </span>
//         </div>
//       </div>

//       {/* Body */}
//       <div
//         style={{ flex: 1, overflowY: "auto", padding: "15px" }}
//         className="feed-scroll">
//         {!selectedChat ? (
//           <>
//             <p
//               className="section-header"
//               style={{ fontSize: "0.65rem", marginBottom: "10px" }}>
//               Priority Channels
//             </p>
//             {groups.map((g) => (
//               <div
//                 key={g.id}
//                 className="talent-item glass"
//                 onClick={() => setSelectedChat(g)}
//                 style={{
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "12px",
//                   marginBottom: "8px",
//                 }}>
//                 <div
//                   style={{
//                     background: "var(--accent-soft)",
//                     padding: "8px",
//                     borderRadius: "8px",
//                     color: "var(--accent)",
//                   }}>
//                   <Hash size={16} />
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
//                     {g.name}
//                   </div>
//                   <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
//                     General broadcast
//                   </div>
//                 </div>
//                 {hasUnread && (
//                   <div
//                     className="dot"
//                     style={{
//                       color: "var(--accent)",
//                       background: "var(--accent)",
//                     }}
//                   />
//                 )}
//               </div>
//             ))}

//             <p
//               className="section-header"
//               style={{
//                 fontSize: "0.65rem",
//                 marginTop: "20px",
//                 marginBottom: "10px",
//               }}>
//               Secure Lines
//             </p>
//             {employees.map((emp) => (
//               <div
//                 key={emp._id}
//                 className="talent-item glass"
//                 onClick={() =>
//                   socket.emit("start_private_chat", {
//                     participantId: emp._id,
//                     userId: user.id,
//                   })
//                 }
//                 style={{
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "12px",
//                   marginBottom: "8px",
//                 }}>
//                 <div
//                   style={{
//                     background: "rgba(255,255,255,0.05)",
//                     padding: "8px",
//                     borderRadius: "50%",
//                     border: "1px solid var(--glass-border)",
//                   }}>
//                   <UserIcon size={16} />
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>
//                     {emp.name}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "0.7rem",
//                       color:
//                         emp.pulseStatus === "Active"
//                           ? "var(--success)"
//                           : "var(--text-dim)",
//                     }}>
//                     {emp.pulseStatus} • {emp.role}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </>
//         ) : (
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//             {messages.map((msg, i) => {
//               const isMine = msg.sender === user.id || msg.senderId === user.id;
//               return (
//                 <div
//                   key={msg._id || i}
//                   style={{
//                     alignSelf: isMine ? "flex-end" : "flex-start",
//                     maxWidth: "85%",
//                   }}>
//                   {!isMine && (
//                     <small
//                       style={{
//                         fontSize: "0.6rem",
//                         marginLeft: "4px",
//                         display: "block",
//                         marginBottom: "2px",
//                       }}>
//                       {msg.senderName}
//                     </small>
//                   )}
//                   <div
//                     className="glass"
//                     style={{
//                       padding: "10px 14px",
//                       borderRadius: isMine
//                         ? "15px 15px 2px 15px"
//                         : "15px 15px 15px 2px",
//                       background: isMine
//                         ? "var(--accent)"
//                         : "rgba(255,255,255,0.07)",
//                       color: isMine ? "#000" : "#fff",
//                       border: isMine ? "none" : "1px solid var(--glass-border)",
//                       boxShadow: isMine
//                         ? "0 4px 15px var(--accent-soft)"
//                         : "none",
//                     }}>
//                     {msg.fileType === "image" ? (
//                       <img
//                         src={msg.fileUrl}
//                         style={{ maxWidth: "100%", borderRadius: "8px" }}
//                         onClick={() => setFullScreenImage(msg.fileUrl)}
//                       />
//                     ) : msg.fileType === "doc" ? (
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                         }}>
//                         <FileText size={16} />
//                         <span style={{ fontSize: "0.8rem" }}>
//                           {msg.fileName}
//                         </span>
//                       </div>
//                     ) : (
//                       <span style={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
//                         {msg.text}
//                       </span>
//                     )}
//                     <div
//                       style={{
//                         fontSize: "0.55rem",
//                         textAlign: "right",
//                         marginTop: "4px",
//                         opacity: 0.5,
//                       }}>
//                       {formatTime(msg.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={scrollRef} />
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       {selectedChat && (
//         <form
//           onSubmit={sendMessage}
//           style={{
//             padding: "15px",
//             borderTop: "1px solid var(--glass-border)",
//             background: "rgba(0,0,0,0.2)",
//           }}>
//           <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//             <button
//               type="button"
//               onClick={() => fileInputRef.current.click()}
//               style={{
//                 color: "var(--text-dim)",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//               }}>
//               <Paperclip size={20} />
//             </button>
//             <input
//               className="glass-input"
//               placeholder="Terminal message..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               style={{
//                 flex: 1,
//                 borderRadius: "20px",
//                 fontSize: "0.85rem",
//                 padding: "8px 15px",
//               }}
//             />
//             <button
//               type="submit"
//               className="action-btn"
//               style={{
//                 borderRadius: "50%",
//                 width: "40px",
//                 height: "40px",
//                 padding: 0,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}>
//               <Send size={18} />
//             </button>
//           </div>
//           <input
//             type="file"
//             ref={fileInputRef}
//             hidden
//             onChange={handleFileUpload}
//           />
//         </form>
//       )}

//       {/* Fullscreen Image Overlay */}
//       {fullScreenImage && (
//         <div
//           className="overlay"
//           style={{ zIndex: 2000 }}
//           onClick={() => setFullScreenImage(null)}>
//           <img
//             src={fullScreenImage}
//             style={{
//               maxHeight: "85vh",
//               maxWidth: "85vw",
//               borderRadius: "12px",
//               border: "2px solid var(--accent)",
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
//ab was grt

// import React, { useState, useEffect, useRef } from "react";
// import {
//   MessageSquare,
//   Send,
//   Hash,
//   ArrowLeft,
//   Paperclip,
//   FileText,
//   User as UserIcon,
//   Circle,
// } from "lucide-react";

// export default function ChatDrawer({ socket, user, isOpen, onClose }) {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [fullScreenImage, setFullScreenImage] = useState(null);
//   const [hasUnread, setHasUnread] = useState(false);

//   const scrollRef = useRef();
//   const fileInputRef = useRef();

//   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

//   useEffect(() => {
//     if (!socket) return;
//     socket.emit("get_users");
//     socket.on("user_list", (data) => {
//       const filtered = data.filter((emp) => emp._id !== user.id);
//       setEmployees(filtered);
//     });
//     socket.on("private_chat_ready", (data) => {
//       setSelectedChat({
//         id: data.conversationId,
//         name: data.name || "Direct Message",
//         type: "private",
//       });
//     });

//     const handleReceiveMessage = (msg) => {
//       if (
//         msg.conversationId === "global_all" &&
//         selectedChat?.id !== "global_all"
//       ) {
//         setHasUnread(true);
//       }
//       if (msg.conversationId === selectedChat?.id) {
//         setMessages((prev) => {
//           const isDuplicate = prev.some(
//             (m) =>
//               (msg._id && m._id === msg._id) ||
//               (msg.tempId && m.tempId === msg.tempId),
//           );
//           if (isDuplicate) return prev;
//           return [...prev, msg];
//         });
//       }
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("chat_history", (history) => setMessages(history));

//     return () => {
//       socket.off("user_list");
//       socket.off("private_chat_ready");
//       socket.off("receive_message", handleReceiveMessage);
//     };
//   }, [socket, selectedChat, user.id]);

//   useEffect(() => {
//     if (selectedChat && socket && selectedChat.id !== "loading") {
//       setMessages([]);
//       socket.emit("join_room", selectedChat.id);
//       if (selectedChat.id === "global_all") setHasUnread(false);
//     }
//   }, [selectedChat, socket]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!message.trim() || !selectedChat || !socket) return;
//     const tempId = Date.now().toString();
//     const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());

//     const optimisticMessage = {
//       _id: tempId,
//       tempId: tempId,
//       conversationId: selectedChat.id,
//       text: message,
//       senderId: user.id,
//       senderName: user.name,
//       fileType: isLink ? "link" : "text",
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, optimisticMessage]);
//     socket.emit("send_message", {
//       ...optimisticMessage,
//       senderId: user.id,
//     });
//     setMessage("");
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file || !socket || !selectedChat) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const tempId = Date.now().toString();
//       const optimisticFile = {
//         _id: tempId,
//         tempId,
//         conversationId: selectedChat.id,
//         senderId: user.id,
//         senderName: user.name,
//         text: "",
//         fileUrl: reader.result,
//         fileName: file.name,
//         fileType: file.type.startsWith("image/") ? "image" : "doc",
//         createdAt: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, optimisticFile]);
//       socket.emit("send_message", { ...optimisticFile, _id: undefined });
//     };
//     reader.readAsDataURL(file);
//     e.target.value = null;
//   };

//   const formatTime = (dateStr) =>
//     dateStr
//       ? new Date(dateStr).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//   return (
//     <div
//       className={`page-content glass ${isOpen ? "open" : ""}`}
//       style={{
//         height: "calc(100vh - 40px)",
//         display: "flex",
//         flexDirection: "row", // Horizontal layout for desktop feel
//         overflow: "hidden",
//         padding: 0,
//         gap: 0,
//       }}>
//       {/* Sidebar: Chat List */}
//       <div
//         style={{
//           width: "320px",
//           borderRight: "1px solid var(--glass-border)",
//           display: "flex",
//           flexDirection: "column",
//           background: "rgba(0,0,0,0.2)",
//         }}>
//         <div
//           style={{
//             padding: "24px",
//             borderBottom: "1px solid var(--glass-border)",
//           }}>
//           <h2
//             style={{
//               fontSize: "1.2rem",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//             }}>
//             <MessageSquare size={20} color="var(--accent)" />
//             Messenger
//           </h2>
//         </div>

//         <div
//           className="feed-scroll"
//           style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
//           <p
//             className="section-header"
//             style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
//             NETWORK CHANNELS
//           </p>
//           {groups.map((g) => (
//             <div
//               key={g.id}
//               className={`talent-item glass ${selectedChat?.id === g.id ? "active" : ""}`}
//               onClick={() => setSelectedChat(g)}
//               style={{
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 marginBottom: "8px",
//                 background:
//                   selectedChat?.id === g.id ? "var(--accent-soft)" : "",
//               }}>
//               <div style={{ color: "var(--accent)" }}>
//                 <Hash size={18} />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
//                   {g.name}
//                 </div>
//               </div>
//               {hasUnread && (
//                 <Circle size={8} fill="var(--accent)" color="var(--accent)" />
//               )}
//             </div>
//           ))}

//           <p
//             className="section-header"
//             style={{
//               fontSize: "0.7rem",
//               color: "var(--text-dim)",
//               marginTop: "24px",
//             }}>
//             DIRECT ENCRYPTED
//           </p>
//           {employees.map((emp) => (
//             <div
//               key={emp._id}
//               className={`talent-item glass ${selectedChat?.name === emp.name ? "active" : ""}`}
//               onClick={() =>
//                 socket.emit("start_private_chat", {
//                   participantId: emp._id,
//                   userId: user.id,
//                 })
//               }
//               style={{
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 marginBottom: "8px",
//                 background:
//                   selectedChat?.name === emp.name ? "var(--accent-soft)" : "",
//               }}>
//               <div style={{ position: "relative" }}>
//                 <UserIcon size={18} />
//                 <div
//                   style={{
//                     position: "absolute",
//                     bottom: -2,
//                     right: -2,
//                     width: 8,
//                     height: 8,
//                     borderRadius: "50%",
//                     background:
//                       emp.pulseStatus === "Active"
//                         ? "var(--success)"
//                         : "var(--text-dim)",
//                     border: "2px solid #1e293b",
//                   }}
//                 />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>
//                   {emp.name}
//                 </div>
//                 <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
//                   {emp.role}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           background: "rgba(15, 23, 42, 0.4)",
//         }}>
//         {selectedChat ? (
//           <>
//             {/* Chat Header */}
//             <div
//               style={{
//                 padding: "18px 25px",
//                 borderBottom: "1px solid var(--glass-border)",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backdropFilter: "blur(10px)",
//               }}>
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 <div
//                   className="time-badge"
//                   style={{
//                     background: "var(--accent-soft)",
//                     color: "var(--accent)",
//                   }}>
//                   SECURE
//                 </div>
//                 <h3 style={{ fontSize: "1rem" }}>{selectedChat.name}</h3>
//               </div>
//             </div>

//             {/* Messages */}
//             <div
//               className="feed-scroll"
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 padding: "25px",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "15px",
//               }}>
//               {messages.map((msg, i) => {
//                 const isMine =
//                   msg.sender === user.id || msg.senderId === user.id;
//                 return (
//                   <div
//                     key={msg._id || i}
//                     style={{
//                       alignSelf: isMine ? "flex-end" : "flex-start",
//                       maxWidth: "70%",
//                     }}>
//                     <div
//                       style={{
//                         padding: "12px 16px",
//                         borderRadius: isMine
//                           ? "16px 16px 4px 16px"
//                           : "16px 16px 16px 4px",
//                         background: isMine
//                           ? "linear-gradient(135deg, var(--accent), #00d2ff)"
//                           : "var(--glass)",
//                         color: isMine ? "#000" : "#fff",
//                         border: isMine
//                           ? "none"
//                           : "1px solid var(--glass-border)",
//                         boxShadow: isMine
//                           ? "0 4px 15px rgba(0, 242, 254, 0.2)"
//                           : "none",
//                       }}>
//                       {!isMine && (
//                         <div
//                           style={{
//                             fontSize: "0.7rem",
//                             fontWeight: 700,
//                             marginBottom: "4px",
//                             color: "var(--accent)",
//                           }}>
//                           {msg.senderName}
//                         </div>
//                       )}

//                       {msg.fileType === "image" ? (
//                         <img
//                           src={msg.fileUrl}
//                           style={{
//                             maxWidth: "100%",
//                             borderRadius: "8px",
//                             marginTop: "5px",
//                           }}
//                           onClick={() => setFullScreenImage(msg.fileUrl)}
//                           alt="upload"
//                         />
//                       ) : msg.fileType === "doc" ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "10px",
//                             padding: "5px",
//                           }}>
//                           <FileText size={20} />
//                           <span style={{ fontSize: "0.85rem" }}>
//                             {msg.fileName}
//                           </span>
//                         </div>
//                       ) : (
//                         <span style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
//                           {msg.text}
//                         </span>
//                       )}

//                       <div
//                         style={{
//                           fontSize: "0.6rem",
//                           textAlign: "right",
//                           marginTop: "6px",
//                           opacity: 0.6,
//                         }}>
//                         {formatTime(msg.createdAt)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>

//             {/* Input Bar */}
//             <form
//               onSubmit={sendMessage}
//               style={{
//                 padding: "20px 25px",
//                 background: "rgba(0,0,0,0.3)",
//                 borderTop: "1px solid var(--glass-border)",
//               }}>
//               <div
//                 style={{ display: "flex", gap: "15px", alignItems: "center" }}>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current.click()}
//                   className="nav-link"
//                   style={{ width: "auto", padding: "10px", marginBottom: 0 }}>
//                   <Paperclip size={20} />
//                 </button>
//                 <input
//                   className="glass-input"
//                   placeholder="Transmit message..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   style={{
//                     flex: 1,
//                     padding: "12px 20px",
//                     borderRadius: "12px",
//                     border: "1px solid var(--glass-border)",
//                   }}
//                 />
//                 <button
//                   type="submit"
//                   className="action-btn"
//                   style={{
//                     height: "45px",
//                     width: "45px",
//                     borderRadius: "12px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}>
//                   <Send size={20} />
//                 </button>
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 onChange={handleFileUpload}
//               />
//             </form>
//           </>
//         ) : (
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               opacity: 0.3,
//             }}>
//             <MessageSquare size={60} />
//             <p
//               style={{
//                 marginTop: "15px",
//                 letterSpacing: "2px",
//                 fontSize: "0.8rem",
//               }}>
//               SELECT A FREQUENCY TO BEGIN
//             </p>
//           </div>
//         )}
//       </div>

//       {fullScreenImage && (
//         <div
//           className="overlay"
//           style={{ zIndex: 3000 }}
//           onClick={() => setFullScreenImage(null)}>
//           <img
//             src={fullScreenImage}
//             style={{
//               maxHeight: "90vh",
//               maxWidth: "90vw",
//               borderRadius: "12px",
//               border: "2px solid var(--accent)",
//             }}
//             alt="fullview"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

//abb was grt

// import React, { useState, useEffect, useRef } from "react";
// import {
//   MessageSquare,
//   Send,
//   Hash,
//   ArrowLeft,
//   Paperclip,
//   FileText,
//   User as UserIcon,
//   Circle,
//   Search,
//   ChevronLeft,
//   Menu,
// } from "lucide-react";

// export default function ChatDrawer({ socket, user, isOpen, onClose }) {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [fullScreenImage, setFullScreenImage] = useState(null);
//   const [hasUnread, setHasUnread] = useState(false);

//   // New States for Search and Sidebar
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const scrollRef = useRef();
//   const fileInputRef = useRef();

//   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

//   // --- Socket Logic ---
//   useEffect(() => {
//     if (!socket) return;
//     socket.emit("get_users");
//     socket.on("user_list", (data) => {
//       const filtered = data.filter((emp) => emp._id !== user.id);
//       setEmployees(filtered);
//     });
//     socket.on("private_chat_ready", (data) => {
//       setSelectedChat({
//         id: data.conversationId,
//         name: data.name || "Direct Message",
//         type: "private",
//       });
//     });

//     const handleReceiveMessage = (msg) => {
//       if (
//         msg.conversationId === "global_all" &&
//         selectedChat?.id !== "global_all"
//       ) {
//         setHasUnread(true);
//       }
//       if (msg.conversationId === selectedChat?.id) {
//         setMessages((prev) => {
//           const isDuplicate = prev.some(
//             (m) =>
//               (msg._id && m._id === msg._id) ||
//               (msg.tempId && m.tempId === msg.tempId),
//           );
//           if (isDuplicate) return prev;
//           return [...prev, msg];
//         });
//       }
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("chat_history", (history) => setMessages(history));

//     return () => {
//       socket.off("user_list");
//       socket.off("private_chat_ready");
//       socket.off("receive_message", handleReceiveMessage);
//     };
//   }, [socket, selectedChat, user.id]);

//   useEffect(() => {
//     if (selectedChat && socket && selectedChat.id !== "loading") {
//       setMessages([]);
//       socket.emit("join_room", selectedChat.id);
//       if (selectedChat.id === "global_all") setHasUnread(false);
//     }
//   }, [selectedChat, socket]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // --- Filtering Logic ---
//   const filteredGroups = groups.filter((g) =>
//     g.name.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const filteredEmployees = employees.filter(
//     (emp) =>
//       emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       emp.role.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!message.trim() || !selectedChat || !socket) return;
//     const tempId = Date.now().toString();
//     const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());

//     const optimisticMessage = {
//       _id: tempId,
//       tempId,
//       conversationId: selectedChat.id,
//       text: message,
//       senderId: user.id,
//       senderName: user.name,
//       fileType: isLink ? "link" : "text",
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, optimisticMessage]);
//     socket.emit("send_message", { ...optimisticMessage, senderId: user.id });
//     setMessage("");
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file || !socket || !selectedChat) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const tempId = Date.now().toString();
//       const optimisticFile = {
//         _id: tempId,
//         tempId,
//         conversationId: selectedChat.id,
//         senderId: user.id,
//         senderName: user.name,
//         text: "",
//         fileUrl: reader.result,
//         fileName: file.name,
//         fileType: file.type.startsWith("image/") ? "image" : "doc",
//         createdAt: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, optimisticFile]);
//       socket.emit("send_message", { ...optimisticFile, _id: undefined });
//     };
//     reader.readAsDataURL(file);
//     e.target.value = null;
//   };

//   const formatTime = (dateStr) =>
//     dateStr
//       ? new Date(dateStr).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//   return (
//     <div
//       className={`page-content glass ${isOpen ? "open" : ""}`}
//       style={{
//         height: "calc(100vh - 40px)",
//         display: "flex",
//         flexDirection: "row",
//         overflow: "hidden",
//         padding: 0,
//         gap: 0,
//         position: "relative",
//       }}>
//       {/* Sidebar: Chat List */}
//       <div
//         style={{
//           width: isSidebarOpen ? "320px" : "0px",
//           opacity: isSidebarOpen ? 1 : 0,
//           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//           borderRight: isSidebarOpen ? "1px solid var(--glass-border)" : "none",
//           display: "flex",
//           flexDirection: "column",
//           background: "rgba(0,0,0,0.2)",
//           overflow: "hidden",
//           whiteSpace: "nowrap",
//         }}>
//         {/* Sidebar Header & Search */}
//         <div style={{ padding: "20px" }}>
//           <h2
//             style={{
//               fontSize: "1.1rem",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               marginBottom: "15px",
//             }}>
//             <MessageSquare size={18} color="var(--accent)" />
//             Intelligence
//           </h2>

//           <div style={{ position: "relative" }}>
//             <Search
//               size={14}
//               style={{
//                 position: "absolute",
//                 left: "12px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 opacity: 0.5,
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search frequency..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 width: "83%",
//                 background: "rgba(255,255,255,0.05)",
//                 border: "1px solid var(--glass-border)",
//                 borderRadius: "8px",
//                 padding: "8px 10px 8px 30px",
//                 fontSize: "0.8rem",
//                 color: "#fff",
//                 outline: "none",
//               }}
//             />
//           </div>
//         </div>

//         <div
//           className="feed-scroll"
//           style={{ flex: 1, overflowY: "auto", padding: "0 15px 15px 15px" }}>
//           {filteredGroups.length > 0 && (
//             <>
//               <p
//                 className="section-header"
//                 style={{
//                   fontSize: "0.65rem",
//                   color: "var(--text-dim)",
//                   marginBottom: "8px",
//                 }}>
//                 CHANNELS
//               </p>
//               {filteredGroups.map((g) => (
//                 <div
//                   key={g.id}
//                   className={`talent-item glass ${selectedChat?.id === g.id ? "active" : ""}`}
//                   onClick={() => setSelectedChat(g)}
//                   style={{
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     marginBottom: "6px",
//                     background:
//                       selectedChat?.id === g.id ? "var(--accent-soft)" : "",
//                   }}>
//                   <div style={{ color: "var(--accent)" }}>
//                     <Hash size={16} />
//                   </div>
//                   <div
//                     style={{ flex: 1, fontSize: "0.85rem", fontWeight: 600 }}>
//                     {g.name}
//                   </div>
//                   {hasUnread && (
//                     <Circle
//                       size={6}
//                       fill="var(--accent)"
//                       color="var(--accent)"
//                     />
//                   )}
//                 </div>
//               ))}
//             </>
//           )}

//           {filteredEmployees.length > 0 && (
//             <>
//               <p
//                 className="section-header"
//                 style={{
//                   fontSize: "0.65rem",
//                   color: "var(--text-dim)",
//                   marginTop: "20px",
//                   marginBottom: "8px",
//                 }}>
//                 DIRECT MESSAGES
//               </p>
//               {filteredEmployees.map((emp) => (
//                 <div
//                   key={emp._id}
//                   className={`talent-item glass ${selectedChat?.name === emp.name ? "active" : ""}`}
//                   onClick={() =>
//                     socket.emit("start_private_chat", {
//                       participantId: emp._id,
//                       userId: user.id,
//                     })
//                   }
//                   style={{
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     marginBottom: "6px",
//                     background:
//                       selectedChat?.name === emp.name
//                         ? "var(--accent-soft)"
//                         : "",
//                   }}>
//                   <div style={{ position: "relative" }}>
//                     <UserIcon size={16} />
//                     <div
//                       style={{
//                         position: "absolute",
//                         bottom: -1,
//                         right: -1,
//                         width: 6,
//                         height: 6,
//                         borderRadius: "50%",
//                         background:
//                           emp.pulseStatus === "Active"
//                             ? "var(--success)"
//                             : "var(--text-dim)",
//                         border: "1px solid #1e293b",
//                       }}
//                     />
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: "0.8rem", fontWeight: 500 }}>
//                       {emp.name}
//                     </div>
//                     <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>
//                       {emp.role}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}

//           {filteredGroups.length === 0 && filteredEmployees.length === 0 && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "20px",
//                 opacity: 0.4,
//                 fontSize: "0.8rem",
//               }}>
//               No signals found.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           background: "rgba(15, 23, 42, 0.4)",
//         }}>
//         {selectedChat ? (
//           <>
//             {/* Chat Header */}
//             <div
//               style={{
//                 padding: "15px 25px",
//                 borderBottom: "1px solid var(--glass-border)",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backdropFilter: "blur(10px)",
//               }}>
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 {/* Sidebar Toggle Button */}
//                 <button
//                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                   style={{
//                     background: "rgba(255,255,255,0.05)",
//                     border: "1px solid var(--glass-border)",
//                     color: "#fff",
//                     cursor: "pointer",
//                     padding: "6px",
//                     borderRadius: "6px",
//                     display: "flex",
//                     alignItems: "center",
//                   }}>
//                   {isSidebarOpen ? (
//                     <ChevronLeft size={18} />
//                   ) : (
//                     <Menu size={18} />
//                   )}
//                 </button>

//                 <div>
//                   <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>
//                     {selectedChat.name}
//                   </h3>
//                   <div
//                     style={{
//                       fontSize: "0.6rem",
//                       color: "var(--accent)",
//                       letterSpacing: "1px",
//                     }}>
//                     ENCRYPTED CHANNEL
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Messages */}
//             <div
//               className="feed-scroll"
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 padding: "25px",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "15px",
//               }}>
//               {messages.map((msg, i) => {
//                 const isMine =
//                   msg.sender === user.id || msg.senderId === user.id;
//                 return (
//                   <div
//                     key={msg._id || i}
//                     style={{
//                       alignSelf: isMine ? "flex-end" : "flex-start",
//                       maxWidth: "70%",
//                     }}>
//                     <div
//                       style={{
//                         padding: "12px 16px",
//                         borderRadius: isMine
//                           ? "16px 16px 4px 16px"
//                           : "16px 16px 16px 4px",
//                         background: isMine
//                           ? "linear-gradient(135deg, var(--accent), #00d2ff)"
//                           : "var(--glass)",
//                         color: isMine ? "#000" : "#fff",
//                         border: isMine
//                           ? "none"
//                           : "1px solid var(--glass-border)",
//                       }}>
//                       {!isMine && (
//                         <div
//                           style={{
//                             fontSize: "0.7rem",
//                             fontWeight: 800,
//                             marginBottom: "4px",
//                             color: isMine ? "rgba(0,0,0,0.6)" : "var(--accent)",
//                           }}>
//                           {msg.senderName}
//                         </div>
//                       )}
//                       {msg.fileType === "image" ? (
//                         <img
//                           src={msg.fileUrl}
//                           style={{ maxWidth: "100%", borderRadius: "8px" }}
//                           onClick={() => setFullScreenImage(msg.fileUrl)}
//                           alt="upload"
//                         />
//                       ) : msg.fileType === "doc" ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "10px",
//                           }}>
//                           <FileText size={18} />
//                           <span style={{ fontSize: "0.8rem" }}>
//                             {msg.fileName}
//                           </span>
//                         </div>
//                       ) : (
//                         <span style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
//                           {msg.text}
//                         </span>
//                       )}
//                       <div
//                         style={{
//                           fontSize: "0.55rem",
//                           textAlign: "right",
//                           marginTop: "6px",
//                           opacity: 0.6,
//                         }}>
//                         {formatTime(msg.createdAt)}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>

//             {/* Input Bar */}
//             <form
//               onSubmit={sendMessage}
//               style={{
//                 padding: "20px 25px",
//                 background: "rgba(0,0,0,0.3)",
//                 borderTop: "1px solid var(--glass-border)",
//               }}>
//               <div
//                 style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current.click()}
//                   className="nav-link"
//                   style={{ width: "auto", padding: "8px", marginBottom: 0 }}>
//                   <Paperclip size={18} />
//                 </button>
//                 <input
//                   className="glass-input"
//                   placeholder="Transmit message..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   style={{
//                     flex: 1,
//                     padding: "10px 18px",
//                     borderRadius: "10px",
//                     border: "1px solid var(--glass-border)",
//                   }}
//                 />
//                 <button
//                   type="submit"
//                   className="send-btn-neon"
//                   style={{
//                     height: "40px",
//                     width: "40px",
//                     borderRadius: "10px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}>
//                   <Send size={18} />
//                 </button>
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 onChange={handleFileUpload}
//               />
//             </form>
//           </>
//         ) : (
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//             }}>
//             {!isSidebarOpen && (
//               <button
//                 onClick={() => setIsSidebarOpen(true)}
//                 style={{
//                   position: "absolute",
//                   top: "20px",
//                   left: "20px",
//                   background: "rgba(255,255,255,0.05)",
//                   border: "1px solid var(--glass-border)",
//                   color: "#fff",
//                   cursor: "pointer",
//                   padding: "8px",
//                   borderRadius: "8px",
//                 }}>
//                 <Menu size={20} />
//               </button>
//             )}
//             <MessageSquare size={60} style={{ opacity: 0.1 }} />
//             <p
//               style={{
//                 marginTop: "15px",
//                 letterSpacing: "2px",
//                 fontSize: "0.75rem",
//                 opacity: 0.3,
//               }}>
//               SELECT A SIGNAL TO MONITOR
//             </p>
//           </div>
//         )}
//       </div>

//       {fullScreenImage && (
//         <div
//           className="overlay"
//           style={{ zIndex: 3000 }}
//           onClick={() => setFullScreenImage(null)}>
//           <img
//             src={fullScreenImage}
//             style={{
//               maxHeight: "90vh",
//               maxWidth: "90vw",
//               borderRadius: "12px",
//               border: "2px solid var(--accent)",
//             }}
//             alt="fullview"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import {
//   MessageSquare,
//   Send,
//   Hash,
//   Paperclip,
//   FileText,
//   User as UserIcon,
//   Circle,
//   Search,
//   ChevronLeft,
//   Menu,
//   MoreVertical,
//   Edit2,
//   Trash2,
//   X,
//   Check,
// } from "lucide-react";

// export default function ChatDrawer({ socket, user, isOpen, onClose }) {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [fullScreenImage, setFullScreenImage] = useState(null);
//   const [hasUnread, setHasUnread] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // States for Edit/Delete functionality
//   const [activeMenuId, setActiveMenuId] = useState(null);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editBuffer, setEditBuffer] = useState("");

//   const scrollRef = useRef();
//   const fileInputRef = useRef();

//   const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

//   useEffect(() => {
//     if (!socket) return;
//     socket.emit("get_users");

//     socket.on("user_list", (data) => {
//       const filtered = data.filter((emp) => emp._id !== user.id);
//       setEmployees(filtered);
//     });

//     socket.on("private_chat_ready", (data) => {
//       setSelectedChat({
//         id: data.conversationId,
//         name: data.name || "Direct Message",
//         type: "private",
//       });
//     });

//     const handleReceiveMessage = (msg) => {
//       if (
//         msg.conversationId === "global_all" &&
//         selectedChat?.id !== "global_all"
//       ) {
//         setHasUnread(true);
//       }
//       if (msg.conversationId === selectedChat?.id) {
//         setMessages((prev) => {
//           const isDuplicate = prev.some(
//             (m) =>
//               (msg._id && m._id === msg._id) ||
//               (msg.tempId && m.tempId === msg.tempId),
//           );
//           if (isDuplicate) return prev;
//           return [...prev, msg];
//         });
//       }
//     };

//     // Listen for edits and deletions from other users
//     socket.on("message_edited", (updatedMsg) => {
//       setMessages((prev) =>
//         prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
//       );
//     });

//     socket.on("message_deleted", (deletedId) => {
//       setMessages((prev) => prev.filter((m) => m._id !== deletedId));
//     });

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("chat_history", (history) => setMessages(history));

//     return () => {
//       socket.off("user_list");
//       socket.off("private_chat_ready");
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("message_edited");
//       socket.off("message_deleted");
//     };
//   }, [socket, selectedChat, user.id]);

//   useEffect(() => {
//     if (selectedChat && socket && selectedChat.id !== "loading") {
//       setMessages([]);
//       socket.emit("join_room", selectedChat.id);
//       if (selectedChat.id === "global_all") setHasUnread(false);
//     }
//   }, [selectedChat, socket]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Filtering
//   const filteredGroups = groups.filter((g) =>
//     g.name.toLowerCase().includes(searchQuery.toLowerCase()),
//   );
//   const filteredEmployees = employees.filter(
//     (emp) =>
//       emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       emp.role.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   // Message Actions
//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!message.trim() || !selectedChat || !socket) return;
//     const tempId = Date.now().toString();
//     const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());

//     const optimisticMessage = {
//       _id: tempId,
//       tempId,
//       conversationId: selectedChat.id,
//       text: message,
//       senderId: user.id,
//       senderName: user.name,
//       fileType: isLink ? "link" : "text",
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, optimisticMessage]);
//     socket.emit("send_message", { ...optimisticMessage, senderId: user.id });
//     setMessage("");
//   };

//   const startEdit = (msg) => {
//     setEditingMessageId(msg._id);
//     setEditBuffer(msg.text);
//     setActiveMenuId(null);
//   };

//   const handleSaveEdit = (msgId) => {
//     if (!editBuffer.trim()) return;
//     socket.emit("edit_message", { messageId: msgId, newText: editBuffer });
//     setMessages((prev) =>
//       prev.map((m) =>
//         m._id === msgId ? { ...m, text: editBuffer, isEdited: true } : m,
//       ),
//     );
//     setEditingMessageId(null);
//   };

//   const handleDelete = (msgId) => {
//     if (window.confirm("Acknowledge: Permanent deletion of transmission?")) {
//       socket.emit("delete_message", msgId);
//       setMessages((prev) => prev.filter((m) => m._id !== msgId));
//       setActiveMenuId(null);
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file || !socket || !selectedChat) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const tempId = Date.now().toString();
//       const optimisticFile = {
//         _id: tempId,
//         tempId,
//         conversationId: selectedChat.id,
//         senderId: user.id,
//         senderName: user.name,
//         text: "",
//         fileUrl: reader.result,
//         fileName: file.name,
//         fileType: file.type.startsWith("image/") ? "image" : "doc",
//         createdAt: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, optimisticFile]);
//       socket.emit("send_message", { ...optimisticFile, _id: undefined });
//     };
//     reader.readAsDataURL(file);
//     e.target.value = null;
//   };

//   const formatTime = (dateStr) =>
//     dateStr
//       ? new Date(dateStr).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "";

//   return (
//     <div
//       className={`page-content glass ${isOpen ? "open" : ""}`}
//       style={{
//         height: "calc(100vh - 40px)",
//         display: "flex",
//         flexDirection: "row",
//         overflow: "hidden",
//         padding: 0,
//         gap: 0,
//         position: "relative",
//       }}>
//       {/* Sidebar: Chat List */}
//       <div
//         style={{
//           width: isSidebarOpen ? "320px" : "0px",
//           opacity: isSidebarOpen ? 1 : 0,
//           transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//           borderRight: isSidebarOpen ? "1px solid var(--glass-border)" : "none",
//           display: "flex",
//           flexDirection: "column",
//           background: "rgba(0,0,0,0.2)",
//           overflow: "hidden",
//           whiteSpace: "nowrap",
//         }}>
//         <div style={{ padding: "20px" }}>
//           <h2
//             style={{
//               fontSize: "1.1rem",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               marginBottom: "15px",
//             }}>
//             <MessageSquare size={18} color="var(--accent)" />
//             Intelligence
//           </h2>
//           <div style={{ position: "relative" }}>
//             <Search
//               size={14}
//               style={{
//                 position: "absolute",
//                 left: "12px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 opacity: 0.5,
//               }}
//             />
//             <input
//               type="text"
//               placeholder="Search frequency..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 width: "83%",
//                 background: "rgba(255,255,255,0.05)",
//                 border: "1px solid var(--glass-border)",
//                 borderRadius: "8px",
//                 padding: "8px 10px 8px 30px",
//                 fontSize: "0.8rem",
//                 color: "#fff",
//                 outline: "none",
//               }}
//             />
//           </div>
//         </div>

//         <div
//           className="feed-scroll"
//           style={{ flex: 1, overflowY: "auto", padding: "0 15px 15px 15px" }}>
//           {filteredGroups.length > 0 && (
//             <>
//               <p
//                 className="section-header"
//                 style={{
//                   fontSize: "0.65rem",
//                   color: "var(--text-dim)",
//                   marginBottom: "8px",
//                 }}>
//                 CHANNELS
//               </p>
//               {filteredGroups.map((g) => (
//                 <div
//                   key={g.id}
//                   className={`talent-item glass ${selectedChat?.id === g.id ? "active" : ""}`}
//                   onClick={() => setSelectedChat(g)}
//                   style={{
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     marginBottom: "6px",
//                     background:
//                       selectedChat?.id === g.id ? "var(--accent-soft)" : "",
//                   }}>
//                   <div style={{ color: "var(--accent)" }}>
//                     <Hash size={16} />
//                   </div>
//                   <div
//                     style={{ flex: 1, fontSize: "0.85rem", fontWeight: 600 }}>
//                     {g.name}
//                   </div>
//                   {hasUnread && (
//                     <Circle
//                       size={6}
//                       fill="var(--accent)"
//                       color="var(--accent)"
//                     />
//                   )}
//                 </div>
//               ))}
//             </>
//           )}

//           {filteredEmployees.length > 0 && (
//             <>
//               <p
//                 className="section-header"
//                 style={{
//                   fontSize: "0.65rem",
//                   color: "var(--text-dim)",
//                   marginTop: "20px",
//                   marginBottom: "8px",
//                 }}>
//                 DIRECT MESSAGES
//               </p>
//               {filteredEmployees.map((emp) => (
//                 <div
//                   key={emp._id}
//                   className={`talent-item glass ${selectedChat?.name === emp.name ? "active" : ""}`}
//                   onClick={() =>
//                     socket.emit("start_private_chat", {
//                       participantId: emp._id,
//                       userId: user.id,
//                     })
//                   }
//                   style={{
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "12px",
//                     marginBottom: "6px",
//                     background:
//                       selectedChat?.name === emp.name
//                         ? "var(--accent-soft)"
//                         : "",
//                   }}>
//                   <div style={{ position: "relative" }}>
//                     <UserIcon size={16} />
//                     <div
//                       style={{
//                         position: "absolute",
//                         bottom: -1,
//                         right: -1,
//                         width: 6,
//                         height: 6,
//                         borderRadius: "50%",
//                         background:
//                           emp.pulseStatus === "Active"
//                             ? "var(--success)"
//                             : "var(--text-dim)",
//                         border: "1px solid #1e293b",
//                       }}
//                     />
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: "0.8rem", fontWeight: 500 }}>
//                       {emp.name}
//                     </div>
//                     <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>
//                       {emp.role}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           background: "rgba(15, 23, 42, 0.4)",
//         }}>
//         {selectedChat ? (
//           <>
//             <div
//               style={{
//                 padding: "15px 25px",
//                 borderBottom: "1px solid var(--glass-border)",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backdropFilter: "blur(10px)",
//               }}>
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 <button
//                   onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                   style={{
//                     background: "rgba(255,255,255,0.05)",
//                     border: "1px solid var(--glass-border)",
//                     color: "#fff",
//                     cursor: "pointer",
//                     padding: "6px",
//                     borderRadius: "6px",
//                     display: "flex",
//                     alignItems: "center",
//                   }}>
//                   {isSidebarOpen ? (
//                     <ChevronLeft size={18} />
//                   ) : (
//                     <Menu size={18} />
//                   )}
//                 </button>
//                 <div>
//                   <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>
//                     {selectedChat.name}
//                   </h3>
//                   <div
//                     style={{
//                       fontSize: "0.6rem",
//                       color: "var(--accent)",
//                       letterSpacing: "1px",
//                     }}>
//                     ENCRYPTED CHANNEL
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div
//               className="feed-scroll"
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 padding: "25px",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "15px",
//               }}>
//               {messages.map((msg, i) => {
//                 const isMine =
//                   msg.sender === user.id || msg.senderId === user.id;
//                 const isEditing = editingMessageId === msg._id;

//                 return (
//                   <div
//                     key={msg._id || i}
//                     style={{
//                       alignSelf: isMine ? "flex-end" : "flex-start",
//                       maxWidth: "70%",
//                       position: "relative",
//                     }}>
//                     <div
//                       style={{
//                         padding: "12px 16px",
//                         borderRadius: isMine
//                           ? "16px 16px 4px 16px"
//                           : "16px 16px 16px 4px",
//                         background: isMine
//                           ? "linear-gradient(135deg, var(--accent), #00d2ff)"
//                           : "var(--glass)",
//                         color: isMine ? "#000" : "#fff",
//                         border: isMine
//                           ? "none"
//                           : "1px solid var(--glass-border)",
//                       }}>
//                       {!isMine && (
//                         <div
//                           style={{
//                             fontSize: "0.7rem",
//                             fontWeight: 800,
//                             marginBottom: "4px",
//                             color: "var(--accent)",
//                           }}>
//                           {msg.senderName}
//                         </div>
//                       )}

//                       {isEditing ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "8px",
//                           }}>
//                           <textarea
//                             value={editBuffer}
//                             onChange={(e) => setEditBuffer(e.target.value)}
//                             style={{
//                               background: "rgba(255,255,255,0.2)",
//                               border: "none",
//                               color: isMine ? "#000" : "#fff",
//                               borderRadius: "4px",
//                               padding: "5px",
//                               width: "100%",
//                               fontSize: "0.9rem",
//                             }}
//                           />
//                           <div
//                             style={{
//                               display: "flex",
//                               gap: "10px",
//                               justifyContent: "flex-end",
//                             }}>
//                             <X
//                               size={16}
//                               onClick={() => setEditingMessageId(null)}
//                               style={{ cursor: "pointer" }}
//                             />
//                             <Check
//                               size={16}
//                               onClick={() => handleSaveEdit(msg._id)}
//                               style={{ cursor: "pointer" }}
//                             />
//                           </div>
//                         </div>
//                       ) : (
//                         <>
//                           {msg.fileType === "image" ? (
//                             <img
//                               src={msg.fileUrl}
//                               style={{ maxWidth: "100%", borderRadius: "8px" }}
//                               onClick={() => setFullScreenImage(msg.fileUrl)}
//                               alt="upload"
//                             />
//                           ) : msg.fileType === "doc" ? (
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "10px",
//                               }}>
//                               <FileText size={18} />
//                               <span>{msg.fileName}</span>
//                             </div>
//                           ) : (
//                             <span
//                               style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
//                               {msg.text}
//                             </span>
//                           )}
//                         </>
//                       )}

//                       <div
//                         style={{
//                           fontSize: "0.55rem",
//                           textAlign: "right",
//                           marginTop: "6px",
//                           opacity: 0.6,
//                           display: "flex",
//                           justifyContent: "flex-end",
//                           gap: "5px",
//                         }}>
//                         {msg.isEdited && <span>(edited)</span>}
//                         {formatTime(msg.createdAt)}
//                       </div>

//                       {isMine && !isEditing && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             right: "-25px",
//                             top: "5px",
//                             cursor: "pointer",
//                             opacity: 0.5,
//                           }}
//                           onClick={() =>
//                             setActiveMenuId(
//                               activeMenuId === msg._id ? null : msg._id,
//                             )
//                           }>
//                           <MoreVertical size={16} color="#fff" />
//                         </div>
//                       )}

//                       {activeMenuId === msg._id && (
//                         <div
//                           className="glass"
//                           style={{
//                             position: "absolute",
//                             right: "-100px",
//                             top: "25px",
//                             zIndex: 10,
//                             borderRadius: "8px",
//                             overflow: "hidden",
//                             display: "flex",
//                             flexDirection: "column",
//                           }}>
//                           <button
//                             onClick={() => startEdit(msg)}
//                             style={{
//                               padding: "8px 12px",
//                               background: "none",
//                               border: "none",
//                               color: "#fff",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "8px",
//                               cursor: "pointer",
//                               fontSize: "0.75rem",
//                             }}>
//                             <Edit2 size={12} /> Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(msg._id)}
//                             style={{
//                               padding: "8px 12px",
//                               background: "none",
//                               border: "none",
//                               color: "#ff4d4d",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "8px",
//                               cursor: "pointer",
//                               fontSize: "0.75rem",
//                             }}>
//                             <Trash2 size={12} /> Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={scrollRef} />
//             </div>

//             <form
//               onSubmit={sendMessage}
//               style={{
//                 padding: "20px 25px",
//                 background: "rgba(0,0,0,0.3)",
//                 borderTop: "1px solid var(--glass-border)",
//               }}>
//               <div
//                 style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current.click()}
//                   className="nav-link"
//                   style={{ width: "auto", padding: "8px", marginBottom: 0 }}>
//                   <Paperclip size={18} />
//                 </button>
//                 <input
//                   className="glass-input"
//                   placeholder="Transmit message..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   style={{
//                     flex: 1,
//                     padding: "10px 18px",
//                     borderRadius: "10px",
//                     border: "1px solid var(--glass-border)",
//                   }}
//                 />
//                 <button
//                   type="submit"
//                   className="send-btn-neon"
//                   style={{
//                     height: "40px",
//                     width: "40px",
//                     borderRadius: "10px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}>
//                   <Send size={18} />
//                 </button>
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 hidden
//                 onChange={handleFileUpload}
//               />
//             </form>
//           </>
//         ) : (
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//             }}>
//             {!isSidebarOpen && (
//               <button
//                 onClick={() => setIsSidebarOpen(true)}
//                 style={{
//                   position: "absolute",
//                   top: "20px",
//                   left: "20px",
//                   background: "rgba(255,255,255,0.05)",
//                   border: "1px solid var(--glass-border)",
//                   color: "#fff",
//                   cursor: "pointer",
//                   padding: "8px",
//                   borderRadius: "8px",
//                 }}>
//                 <Menu size={20} />
//               </button>
//             )}
//             <MessageSquare size={60} style={{ opacity: 0.1 }} />
//             <p
//               style={{
//                 marginTop: "15px",
//                 letterSpacing: "2px",
//                 fontSize: "0.75rem",
//                 opacity: 0.3,
//               }}>
//               SELECT A SIGNAL TO MONITOR
//             </p>
//           </div>
//         )}
//       </div>

//       {fullScreenImage && (
//         <div
//           className="overlay"
//           style={{ zIndex: 3000 }}
//           onClick={() => setFullScreenImage(null)}>
//           <img
//             src={fullScreenImage}
//             style={{
//               maxHeight: "90vh",
//               maxWidth: "90vw",
//               borderRadius: "12px",
//               border: "2px solid var(--accent)",
//             }}
//             alt="fullview"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Hash,
  Paperclip,
  FileText,
  User as UserIcon,
  Circle,
  Search,
  ChevronLeft,
  Menu,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

export default function ChatDrawer({ socket, user, isOpen, onClose }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States for Edit/Delete functionality
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editBuffer, setEditBuffer] = useState("");
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const scrollRef = useRef();
  const fileInputRef = useRef();

  const groups = [{ id: "global_all", name: "The Hub", type: "global" }];

  useEffect(() => {
    if (!socket) return;
    socket.emit("get_users");

    socket.on("user_list", (data) => {
      const filtered = data.filter((emp) => emp._id !== user.id);
      setEmployees(filtered);
    });

    socket.on("private_chat_ready", (data) => {
      setSelectedChat({
        id: data.conversationId,
        name: data.name || "Direct Message",
        type: "private",
      });
    });

    const handleReceiveMessage = (msg) => {
      if (
        msg.conversationId === "global_all" &&
        selectedChat?.id !== "global_all"
      ) {
        setHasUnread(true);
      }
      if (msg.conversationId === selectedChat?.id) {
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (m) =>
              (msg._id && m._id === msg._id) ||
              (msg.tempId && m.tempId === msg.tempId),
          );
          if (isDuplicate) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("message_edited", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m)),
      );
    });

    socket.on("message_deleted", (deletedId) => {
      setMessages((prev) => prev.filter((m) => m._id !== deletedId));
    });

    socket.on("receive_message", handleReceiveMessage);
    socket.on("chat_history", (history) => setMessages(history));

    return () => {
      socket.off("user_list");
      socket.off("private_chat_ready");
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_edited");
      socket.off("message_deleted");
    };
  }, [socket, selectedChat, user.id]);

  useEffect(() => {
    if (selectedChat && socket && selectedChat.id !== "loading") {
      setMessages([]);
      socket.emit("join_room", selectedChat.id);
      if (selectedChat.id === "global_all") setHasUnread(false);
    }
  }, [selectedChat, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !socket) return;
    const tempId = Date.now().toString();
    const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.trim());

    const optimisticMessage = {
      _id: tempId,
      tempId,
      conversationId: selectedChat.id,
      text: message,
      senderId: user.id,
      senderName: user.name,
      fileType: isLink ? "link" : "text",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    socket.emit("send_message", { ...optimisticMessage, senderId: user.id });
    setMessage("");
  };

  const startEdit = (msg) => {
    setEditingMessageId(msg._id);
    setEditBuffer(msg.text);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (msgId) => {
    if (!editBuffer.trim()) return;
    socket.emit("edit_message", { messageId: msgId, newText: editBuffer });
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msgId ? { ...m, text: editBuffer, isEdited: true } : m,
      ),
    );
    setEditingMessageId(null);
  };

  const confirmDelete = () => {
    if (deleteConfirmationId) {
      socket.emit("delete_message", deleteConfirmationId);
      setMessages((prev) => prev.filter((m) => m._id !== deleteConfirmationId));
      setDeleteConfirmationId(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !socket || !selectedChat) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const tempId = Date.now().toString();
      const optimisticFile = {
        _id: tempId,
        tempId,
        conversationId: selectedChat.id,
        senderId: user.id,
        senderName: user.name,
        text: "",
        fileUrl: reader.result,
        fileName: file.name,
        fileType: file.type.startsWith("image/") ? "image" : "doc",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticFile]);
      socket.emit("send_message", { ...optimisticFile, _id: undefined });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <div
      className={`page-content glass ${isOpen ? "open" : ""}`}
      style={{
        height: "calc(100vh - 40px)",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        padding: 0,
        gap: 0,
        position: "relative",
      }}>
      {/* Sidebar: Chat List */}
      <div
        style={{
          width: isSidebarOpen ? "320px" : "0px",
          opacity: isSidebarOpen ? 1 : 0,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRight: isSidebarOpen ? "1px solid var(--glass-border)" : "none",
          display: "flex",
          flexDirection: "column",
          background: "rgba(0,0,0,0.2)",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}>
        <div style={{ padding: "20px" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}>
            <MessageSquare size={18} color="var(--accent)" /> Intelligence
          </h2>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.5,
              }}
            />
            <input
              type="text"
              placeholder="Search frequency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "83%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                padding: "8px 10px 8px 30px",
                fontSize: "0.8rem",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div
          className="feed-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "0 15px 15px 15px" }}>
          {filteredGroups.length > 0 && (
            <>
              <p
                className="section-header"
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-dim)",
                  marginBottom: "8px",
                }}>
                CHANNELS
              </p>
              {filteredGroups.map((g) => (
                <div
                  key={g.id}
                  className={`talent-item glass ${selectedChat?.id === g.id ? "active" : ""}`}
                  onClick={() => setSelectedChat(g)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "6px",
                    background:
                      selectedChat?.id === g.id ? "var(--accent-soft)" : "",
                  }}>
                  <div style={{ color: "var(--accent)" }}>
                    <Hash size={16} />
                  </div>
                  <div
                    style={{ flex: 1, fontSize: "0.85rem", fontWeight: 600 }}>
                    {g.name}
                  </div>
                  {hasUnread && (
                    <Circle
                      size={6}
                      fill="var(--accent)"
                      color="var(--accent)"
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {filteredEmployees.length > 0 && (
            <>
              <p
                className="section-header"
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-dim)",
                  marginTop: "20px",
                  marginBottom: "8px",
                }}>
                DIRECT MESSAGES
              </p>
              {filteredEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className={`talent-item glass ${selectedChat?.name === emp.name ? "active" : ""}`}
                  onClick={() =>
                    socket.emit("start_private_chat", {
                      participantId: emp._id,
                      userId: user.id,
                    })
                  }
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "6px",
                    background:
                      selectedChat?.name === emp.name
                        ? "var(--accent-soft)"
                        : "",
                  }}>
                  <div style={{ position: "relative" }}>
                    <UserIcon size={16} />
                    <div
                      style={{
                        position: "absolute",
                        bottom: -1,
                        right: -1,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background:
                          emp.pulseStatus === "Active"
                            ? "var(--success)"
                            : "var(--text-dim)",
                        border: "1px solid #1e293b",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                      {emp.name}
                    </div>
                    <div style={{ fontSize: "0.65rem", opacity: 0.5 }}>
                      {emp.role}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "rgba(15, 23, 42, 0.4)",
        }}>
        {selectedChat ? (
          <>
            <div
              style={{
                padding: "15px 25px",
                borderBottom: "1px solid var(--glass-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backdropFilter: "blur(10px)",
              }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--glass-border)",
                    color: "#fff",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  {isSidebarOpen ? (
                    <ChevronLeft size={18} />
                  ) : (
                    <Menu size={18} />
                  )}
                </button>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    {selectedChat.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--accent)",
                      letterSpacing: "1px",
                    }}>
                    ENCRYPTED CHANNEL
                  </div>
                </div>
              </div>
            </div>

            <div
              className="feed-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "25px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}>
              {messages.map((msg, i) => {
                const isMine =
                  msg.sender === user.id || msg.senderId === user.id;
                const isEditing = editingMessageId === msg._id;

                return (
                  <div
                    key={msg._id || i}
                    style={{
                      alignSelf: isMine ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                      position: "relative",
                    }}>
                    {/* Action Menu - Positions on Left for outgoing, Right for incoming (or can be fixed left as requested) */}
                    {activeMenuId === msg._id && (
                      <div
                        className="glass"
                        style={{
                          position: "absolute",
                          left: "-110px", // Opens on the left side
                          top: "0",
                          zIndex: 10,
                          borderRadius: "8px",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          background: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid var(--glass-border)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                        }}>
                        <button
                          onClick={() => startEdit(msg)}
                          style={{
                            padding: "8px 12px",
                            background: "none",
                            border: "none",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirmationId(msg._id);
                            setActiveMenuId(null);
                          }}
                          style={{
                            padding: "8px 12px",
                            background: "none",
                            border: "none",
                            color: "#ff4d4d",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}

                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: isMine
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        background: isMine
                          ? "linear-gradient(135deg, var(--accent), #00d2ff)"
                          : "var(--glass)",
                        color: isMine ? "#000" : "#fff",
                        border: isMine
                          ? "none"
                          : "1px solid var(--glass-border)",
                        position: "relative",
                      }}>
                      {!isMine && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            marginBottom: "4px",
                            color: "var(--accent)",
                          }}>
                          {msg.senderName}
                        </div>
                      )}

                      {isEditing ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}>
                          <textarea
                            value={editBuffer}
                            onChange={(e) => setEditBuffer(e.target.value)}
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              border: "none",
                              color: isMine ? "#000" : "#fff",
                              borderRadius: "4px",
                              padding: "5px",
                              width: "100%",
                              fontSize: "0.9rem",
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              justifyContent: "flex-end",
                            }}>
                            <X
                              size={16}
                              onClick={() => setEditingMessageId(null)}
                              style={{ cursor: "pointer" }}
                            />
                            <Check
                              size={16}
                              onClick={() => handleSaveEdit(msg._id)}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          {msg.fileType === "image" ? (
                            <img
                              src={msg.fileUrl}
                              style={{ maxWidth: "100%", borderRadius: "8px" }}
                              onClick={() => setFullScreenImage(msg.fileUrl)}
                              alt="upload"
                            />
                          ) : msg.fileType === "doc" ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}>
                              <FileText size={18} /> <span>{msg.fileName}</span>
                            </div>
                          ) : (
                            <span
                              style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
                              {msg.text}
                            </span>
                          )}
                        </>
                      )}

                      <div
                        style={{
                          fontSize: "0.55rem",
                          textAlign: "right",
                          marginTop: "6px",
                          opacity: 0.6,
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "5px",
                        }}>
                        {msg.isEdited && <span>(edited)</span>}
                        {formatTime(msg.createdAt)}
                      </div>

                      {/* Three Dots Icon - Positioned based on sender */}
                      {isMine && !isEditing && (
                        <div
                          style={{
                            position: "absolute",
                            left: "-25px",
                            top: "5px",
                            cursor: "pointer",
                            opacity: 0.5,
                          }}
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === msg._id ? null : msg._id,
                            )
                          }>
                          <MoreVertical size={16} color="#fff" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <form
              onSubmit={sendMessage}
              style={{
                padding: "20px 25px",
                background: "rgba(0,0,0,0.3)",
                borderTop: "1px solid var(--glass-border)",
              }}>
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="nav-link"
                  style={{ width: "auto", padding: "8px", marginBottom: 0 }}>
                  <Paperclip size={18} />
                </button>
                <input
                  className="glass-input"
                  placeholder="Transmit message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "1px solid var(--glass-border)",
                  }}
                />
                <button
                  type="submit"
                  className="send-btn-neon"
                  style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Send size={18} />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                onChange={handleFileUpload}
              />
            </form>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}>
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--glass-border)",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                }}>
                <Menu size={20} />
              </button>
            )}
            <MessageSquare size={60} style={{ opacity: 0.1 }} />
            <p
              style={{
                marginTop: "15px",
                letterSpacing: "2px",
                fontSize: "0.75rem",
                opacity: 0.3,
              }}>
              SELECT A SIGNAL TO MONITOR
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirmationId && (
        <div
          className="overlay"
          style={{
            zIndex: 4000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
          }}>
          <div
            className="glass"
            style={{
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(20px)",
            }}>
            <AlertTriangle
              size={40}
              color="#ff4d4d"
              style={{ marginBottom: "15px" }}
            />
            <h3 style={{ marginBottom: "10px", fontSize: "1.2rem" }}>
              Purge Transmission?
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                opacity: 0.7,
                marginBottom: "25px",
                lineHeight: "1.5",
              }}>
              Are you sure you want to permanently delete this signal? This
              action cannot be intercepted or reversed.
            </p>
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
              }}>
              <button
                onClick={() => setDeleteConfirmationId(null)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid var(--glass-border)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#ff4d4d",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {fullScreenImage && (
        <div
          className="overlay"
          style={{ zIndex: 3000 }}
          onClick={() => setFullScreenImage(null)}>
          <img
            src={fullScreenImage}
            style={{
              maxHeight: "90vh",
              maxWidth: "90vw",
              borderRadius: "12px",
              border: "2px solid var(--accent)",
            }}
            alt="fullview"
          />
        </div>
      )}
    </div>
  );
}