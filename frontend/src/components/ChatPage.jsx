import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { setMessages } from "@/redux/chatSlice"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Search, Send, UserPlus } from "lucide-react"


const ChatPage = () => {
  const { id } = useParams()
  const user = useSelector((state) => state.auth.user)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { messages } = useSelector((store) => store.chat)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/render/chat/${user._id}`, {
          withCredentials: true,
        })
        setUsers(response.data.users || [])
        const selected = response.data.users.find((u) => u._id === id)
        setSelectedUser(selected || response.data.users?.[0] || null)
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching users")
      }
    }
    fetchUsers()
  }, [user?._id, id])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return

      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/messages/all/${selectedUser?._id}`, {
          withCredentials: true,
        })
        if (response.data.success) {
          dispatch(setMessages({userId : selectedUser?._id , messages : response.data.messages || []}))
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error fetching messages")
      }
    }
    fetchMessages()
  }, [selectedUser?._id , dispatch])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser?._id) return

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/messages/send/${selectedUser._id}`,
        { textMessage: newMessage },
        { withCredentials: true },
      )

      if (response.data.success) {
        dispatch(setMessages({
          userId: selectedUser._id,
          messages: [...(messages[selectedUser._id] || []), response.data.newMessage]
        }));
        setNewMessage("")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending message")
    }
  }

  const filteredUsers = users.filter((user) => user?.userName?.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleProfileClick = (userId) => {
    navigate(`/view/${userId}/profile`)
  }

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser)
    navigate(`/render/chat/${selectedUser._id}`)
  }

  return (
    <div className="flex h-[89vh] bg-gray-100 mt-5">
      <Card className="w-80 h-[88vh] rounded-none border-r">
        <CardHeader className="p-4 space-y-2">
          <CardTitle>Chats</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 focus-visible:ring-transparent"
            />
          </div>
        </CardHeader>
        <ScrollArea className="h-[calc(88vh-8rem)]">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                selectedUser?._id === user._id ? "bg-secondary" : "hover:bg-secondary/50"
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePicture} alt={user.userName} />
                <AvatarFallback>{user.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="text-sm font-medium leading-none">{user.userName}</p>
                <p className="text-sm text-muted-foreground">{user.bio || "No bio"}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </Card>
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <Card className="rounded-none border-b">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedUser.profilePicture} alt={selectedUser.userName} />
                      <AvatarFallback>{selectedUser.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedUser.userName}</h2>
                      <p className="text-sm text-muted-foreground">{selectedUser.bio || "No bio"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleProfileClick(selectedUser._id)}>
                    <UserPlus className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
            <ScrollArea className="flex-1 p-4 h-[calc(88vh-10rem)]">
              {messages[selectedUser._id]?.map((msg, index) => (
                <div key={index} className={`flex ${msg.senderId === user._id ? "justify-end" : "justify-start"} mb-4`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.senderId === user._id ? "bg-gray-800 text-white" : "bg-white text-black"
                    }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <Separator />
            <CardFooter className="p-4">
              <form onSubmit={sendMessage} className="flex w-full space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border border-gray-300 focus-visible:border-gray-400 focus-visible:ring-transparent"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage

