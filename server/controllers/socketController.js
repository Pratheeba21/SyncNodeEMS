// const Message = require("../models/Message");

// const initSocket = (io) => {
//   io.on("connection", (socket) => {
//     const { userId } = socket.handshake.query;

//     socket.on("join_room", async (roomID) => {
//       socket.join(roomID);
//       try {
//         const history = await Message.find({ conversationId: roomID })
//           .sort({ createdAt: 1 })
//           .limit(100);
//         socket.emit("chat_history", history);
//       } catch (err) {
//         console.error("Error fetching history:", err);
//       }
//     });

//     socket.on("send_message", async (data) => {
//       const {
//         conversationId,
//         text,
//         senderId,
//         senderName,
//         fileUrl,
//         fileName,
//         fileType,
//       } = data;
//       try {
//         const newMessage = new Message({
//           conversationId,
//           sender: senderId,
//           senderName,
//           text,
//           fileUrl,
//           fileName,
//           fileType: fileType || "text",
//         });
//         await newMessage.save();
//         io.to(conversationId).emit("receive_message", newMessage);
//       } catch (err) {
//         console.error("Error saving message:", err);
//       }
//     });

//     socket.on("edit_message", async (data) => {
//       const { messageId, text, conversationId } = data;
//       try {
//         const updatedMessage = await Message.findByIdAndUpdate(
//           messageId,
//           { text, isEdited: true },
//           { new: true },
//         );
//         if (updatedMessage) {
//           io.to(conversationId).emit("message_updated", updatedMessage);
//         }
//       } catch (err) {
//         console.error("Error editing message:", err);
//       }
//     });

//     socket.on("delete_message", async (data) => {
//       const { messageId, conversationId } = data;
//       try {
//         await Message.findByIdAndDelete(messageId);
//         io.to(conversationId).emit("message_deleted", messageId);
//       } catch (err) {
//         console.error("Error deleting message:", err);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log(`User ${userId} disconnected`);
//     });
//   });
// };

// module.exports = initSocket;

//abb was grt

// const Message = require("../models/Message");
// const Conversation = require("../models/Conversation");
// const User = require("../models/User"); // Import User model

// const initSocket = (io) => {
//   io.on("connection", (socket) => {
//     const { userId } = socket.handshake.query;
//     console.log(`User connected: ${userId}`);

//     // --- NEW: Fetch All Employees for the Chat List ---
//     socket.on("get_users", async () => {
//       try {
//         // Fetch all users except the current one
//         const users = await User.find({ _id: { $ne: userId } })
//           .select("name email role pulseStatus")
//           .lean();
//         socket.emit("user_list", users);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       }
//     });

//     socket.on("join_room", async (roomID) => {
//       socket.join(roomID);
//       try {
//         const history = await Message.find({ conversationId: roomID })
//           .sort({ createdAt: 1 })
//           .limit(100);
//         socket.emit("chat_history", history);
//       } catch (err) {
//         console.error("Error fetching history:", err);
//       }
//     });

//     socket.on("start_private_chat", async ({ participantId, userId }) => {
//       try {
//         let conversation = await Conversation.findOne({
//           type: "private",
//           participants: { $all: [participantId, userId] },
//         });

//         if (!conversation) {
//           conversation = new Conversation({
//             participants: [participantId, userId],
//             type: "private",
//           });
//           await conversation.save();
//         }

//         socket.emit("private_chat_ready", {
//           conversationId: conversation._id.toString(),
//           participantId,
//         });
//       } catch (err) {
//         console.error("Error starting private chat:", err);
//       }
//     });

//     socket.on("send_message", async (data) => {
//       const {
//         conversationId,
//         text,
//         senderId,
//         senderName,
//         fileUrl,
//         fileName,
//         fileType,
//       } = data;
//       try {
//         const newMessage = new Message({
//           conversationId,
//           sender: senderId,
//           senderName,
//           text,
//           fileUrl,
//           fileName,
//           fileType: fileType || "text",
//         });
//         await newMessage.save();

//         await Conversation.findByIdAndUpdate(conversationId, {
//           lastMessage: newMessage._id,
//         });

//         io.to(conversationId).emit("receive_message", newMessage);
//       } catch (err) {
//         console.error("Error saving message:", err);
//       }
//     });

//     socket.on("edit_message", async (data) => {
//       const { messageId, text, conversationId } = data;
//       try {
//         const updatedMessage = await Message.findByIdAndUpdate(
//           messageId,
//           { text, isEdited: true },
//           { new: true },
//         );
//         if (updatedMessage) {
//           io.to(conversationId).emit("message_updated", updatedMessage);
//         }
//       } catch (err) {
//         console.error("Error editing message:", err);
//       }
//     });

//     socket.on("delete_message", async (data) => {
//       const { messageId, conversationId } = data;
//       try {
//         await Message.findByIdAndDelete(messageId);
//         io.to(conversationId).emit("message_deleted", messageId);
//       } catch (err) {
//         console.error("Error deleting message:", err);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log(`User ${userId} disconnected`);
//     });
//   });
// };

// module.exports = initSocket;

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;
    console.log(`User connected: ${userId}`);

    // --- Fetch All Employees for the Chat List ---
    socket.on("get_users", async () => {
      try {
        // Fetch all users except the current one
        const users = await User.find({ _id: { $ne: userId } })
          .select("name email role pulseStatus")
          .lean();
        socket.emit("user_list", users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    });

    socket.on("join_room", async (roomID) => {
      socket.join(roomID);
      try {
        const history = await Message.find({ conversationId: roomID })
          .sort({ createdAt: 1 })
          .limit(100);
        socket.emit("chat_history", history);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    });

    // Handle starting/finding a private conversation
    socket.on("start_private_chat", async ({ participantId, userId }) => {
      try {
        let conversation = await Conversation.findOne({
          type: "private",
          participants: { $all: [participantId, userId] },
        });

        if (!conversation) {
          conversation = new Conversation({
            participants: [participantId, userId],
            type: "private",
          });
          await conversation.save();
        }

        // Return the conversation ID so the client can join the room
        socket.emit("private_chat_ready", {
          conversationId: conversation._id.toString(),
          name: "Direct Message", // You can refine this on frontend
        });
      } catch (err) {
        console.error("Error starting private chat:", err);
      }
    });

    // socket.on("send_message", async (data) => {
    //   const {
    //     conversationId,
    //     text,
    //     senderId,
    //     senderName,
    //     fileUrl,
    //     fileName,
    //     fileType,
    //   } = data;
    //   try {
    //     const newMessage = new Message({
    //       conversationId,
    //       sender: senderId,
    //       senderName,
    //       text,
    //       fileUrl,
    //       fileName,
    //       fileType: fileType || "text",
    //     });
    //     await newMessage.save();

    //     await Conversation.findByIdAndUpdate(conversationId, {
    //       lastMessage: newMessage._id,
    //     });

    //     io.to(conversationId).emit("receive_message", newMessage);
    //   } catch (err) {
    //     console.error("Error saving message:", err);
    //   }
    // });
        socket.on("send_message", async (data) => {
          const {
            conversationId,
            text,
            senderId,
            senderName,
            fileUrl,
            fileName,
            fileType,
            tempId, // <--- Get tempId from client
          } = data;
          try {
            const newMessage = new Message({
              conversationId,
              sender: senderId,
              senderName,
              text,
              fileUrl,
              fileName,
              fileType: fileType || "text",
            });
            await newMessage.save();

            await Conversation.findByIdAndUpdate(conversationId, {
              lastMessage: newMessage._id,
            });

            // Convert to object and add tempId back so client can deduplicate
            const messageResponse = newMessage.toObject();
            messageResponse.tempId = tempId;

            io.to(conversationId).emit("receive_message", messageResponse);
          } catch (err) {
            console.error("Error saving message:", err);
          }
        });

    socket.on("edit_message", async (data) => {
      const { messageId, text, conversationId } = data;
      try {
        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { text, isEdited: true },
          { new: true },
        );
        if (updatedMessage) {
          io.to(conversationId).emit("message_updated", updatedMessage);
        }
      } catch (err) {
        console.error("Error editing message:", err);
      }
    });

    socket.on("delete_message", async (data) => {
      const { messageId, conversationId } = data;
      try {
        await Message.findByIdAndDelete(messageId);
        io.to(conversationId).emit("message_deleted", messageId);
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};

module.exports = initSocket;