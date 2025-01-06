import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ChatPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/render/chat/${user._id}`,
          {
            withCredentials: true,
          }
        );
          setUsers(response.data.users || []);
          // console.log("hyy");
          const selected = response.data.users.find((u) => u._id === id);
          setSelectedUser(selected || response.data.users?.[0] || null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching users");
      }
    };
    fetchUsers();
  }, [user?._id, id]);

  // Fetch messages when selected user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return;
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/messages/all/${selectedUser._id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          dispatch(setMessages(response.data.messages || []));
          
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching messages");
      }
    };
    fetchMessages();
  }, [selectedUser?._id, messages ]);


  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser?._id) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/messages/send/${selectedUser._id}`,
        { textMessage: newMessage },
        { withCredentials: true }
      );
      // console.log(selectedUser._id)

      if (response.data.success) {
        dispatch(setMessages([...messages, response.data.newMessage]));
        setNewMessage("");
       
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending message");
    }
  };

  // Filter users by search query
  const filteredUsers = users.filter((user) =>
    user?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to user profile
  const handleProfileClick = (userId) => {
    navigate(`/view/${userId}/profile`);
  };

  // Select chat user
  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    navigate(`/render/chat/${selectedUser._id}`);
  };

  return (
    <div className="flex h-[90vh] bg-gray-100 pt-4">
      {/* Users Sidebar */}
      <div className="w-1/4 bg-white shadow-lg">
        <div className="px-4 py-3 bg-gray-300 text-gray-900 font-bold text-center">
          Chat Users
        </div>
        <div className="px-4 py-2 bg-gray-300 border-b">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-sm border rounded-full focus:outline-none"
          />
        </div>
        <div className="overflow-y-auto h-full">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center p-3 cursor-pointer transition-all ${
                selectedUser?._id === user._id ? "bg-purple-100" : "hover:bg-gray-100"
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-semibold">{user.userName}</p>
                <p className="text-xs text-gray-500">{user.bio || "No bio"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-3/4 bg-gray-50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div
              onClick={() => handleProfileClick(selectedUser._id)}
              className="flex items-center px-4 py-3 bg-gray-400 text-white border-b cursor-pointer"
            >
              <img
                src={selectedUser.profilePicture || "/default-avatar.png"}
                alt={selectedUser.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-semibold text-lg">{selectedUser.userName}</p>
                <p className="text-sm">{selectedUser.bio || "No bio"}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-100">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-lg shadow-md max-w-xs ${
                      msg.senderId === user._id
                        ? "bg-purple-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="mt-1 text-xs opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="flex items-center px-4 py-3 bg-white border-t">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 ml-3 font-semibold text-white bg-purple-500 rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
