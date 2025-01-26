"use client"

import { setAuthUser } from "@/redux/authSlice"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { X } from "lucide-react"

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [availableInterests, setAvailableInterests] = useState([])
  const [oldInterests, setOldInterests] = useState([])

  const [formData, setFormData] = useState({
    userName: "",
    bio: "",
    profilePic: null,
    resume: null,
    gender: "Male",
    interests: [],
    deleteInterest: [],
  })

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/render/interests`, {
          withCredentials: true,
        })

        setOldInterests(response.data.oldInterest)
        setAvailableInterests(response.data.newInterest)
      } catch (error) {
        toast.error("Error fetching interests:", error)
      }
    }

    fetchInterests()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectInterest = (value) => {
    if (!formData.interests.includes(value)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, value],
      });
    }
  };

  const handleRemoveInterest = (value) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((interest) => interest !== value),
    });
  };

  const handleSelectDeleteInterest = (value) => {
    if (!formData.deleteInterest.includes(value)) {
      setFormData({
        ...formData,
        deleteInterest: [...formData.deleteInterest, value],
      });
    }
  };

  const handleRemoveDeleteInterest = (value) => {
    setFormData({
      ...formData,
      deleteInterest: formData.deleteInterest.filter(
        (interest) => interest !== value
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/profile/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      if (response.data.success) {
        toast.success(response.data.message)
        dispatch(setAuthUser(response.data.user))
        navigate("/home")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="userName">Change Username</Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder={user?.userName}
              />
            </div>

            <div>
              <Label htmlFor="bio">Change Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder={user?.bio}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="profilePic">Change Profile Picture</Label>
              <Input id="profilePic" type="file" name="profilePic" onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="interests">Select Interests</Label>
              <Select onValueChange={handleSelectInterest}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an Interest" />
                </SelectTrigger>
                <SelectContent>
                  {availableInterests.map((interest, index) => (
                    <SelectItem key={index} value={interest}>
                      {interest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {interest}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleRemoveInterest(interest)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="deleteInterest">Delete Interest</Label>
              <Select onValueChange={handleSelectDeleteInterest}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an interest to delete" />
                </SelectTrigger>
                <SelectContent>
                  {oldInterests.map((interest, index) => (
                    <SelectItem key={index} value={interest}>
                      {interest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.deleteInterest.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {interest}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleRemoveDeleteInterest(interest)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="resume">Resume</Label>
              <Input id="resume" type="file" name="resume" onChange={handleChange} />
            </div>

            <div>
              <Label>Gender</Label>
              <RadioGroup
                name="gender"
                value={formData.gender}
                onValueChange={(value) => handleChange({ target: { name: "gender", value } })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProfile

