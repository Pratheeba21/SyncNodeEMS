// ... existing imports

const initSocket = (io) => {
  io.on("connection", (socket) => {
    // ... get_users, join_room, start_private_chat logic stays same

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

    // ... edit_message, delete_message logic stays same
  });
};

module.exports = initSocket;
