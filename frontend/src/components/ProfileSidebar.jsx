import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { PlusCircle, Edit2, UserPlus, Mail, User } from "lucide-react"
import CreatePost from "./CreatePost"

const ProfileSidebar = () => {
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  const CreateProfileNavigator = () => navigate("/profile/create")
  const EditNavigator = () => navigate("/profile/edit")

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-28 h-28 border-2">
            <AvatarImage src={user?.profilePicture} alt="Profile" className="object-cover" />
            <AvatarFallback>{user?.userName?.charAt(0) || "G"}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-foreground">{user?.userName || "Guest User"}</h3>
          </div>
          {user?.bio && <p className="text-sm text-center text-muted-foreground">{user.bio}</p>}
          {user?.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {user.interests.slice(0, 3).map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
              {user.interests.length > 3 && <Badge variant="secondary">+{user.interests.length - 3}</Badge>}
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2 p-6">
        <CreatePost />
        {!user && (
          <Button onClick={CreateProfileNavigator} className="w-full" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Create a Profile
          </Button>
        )}
        {user && (
          <>
            <Button onClick={CreateProfileNavigator} className="w-full" variant="outline">
              <User className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
            
            <Button onClick={EditNavigator} className="w-full" variant="outline">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
           

          </>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProfileSidebar

