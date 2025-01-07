import React, { Component, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Code2, HomeIcon, LibraryBig, LogOut, MessageCircle, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchusers = async () => {
      const response =await axios.get(`${import.meta.env.VITE_URL}/search/users` , {withCredentials : true});
      setUsers(response.data);
    }
    fetchusers();
  },[])

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearch(searchValue);

    if (searchValue.trim()) {
      const results = users.filter((user) =>
        user.userName?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  };

  const navigate = useNavigate();
  const LogoutHandeler = async () => {
    try{
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/logout` , {
        withCredentials : true
      });
      if(response.data.success){
        toast.success("Logout successfully")
        dispatch(setAuthUser(null));
        navigate('/')
      }else{
        toast.error(response.data.message)
      }
    }catch(err){
      toast.error(err.message);
    }
  }
  return (
    <div className="h-[5.5vh]">
      <div className="bg-bg shadow-lg fixed w-full z-50 top-0 left-0 ">
        <div className="w-7xl py-2 flex justify-between items-center">
          {/* Logo Section */}

          <div className="logo ml-10">
            <Link to="/home" className="block w-14 h-14">
              <img src="/getConnect.png" alt="Logo" className="w-full h-full object-cover" />
            </Link>
          </div>

          {/* Search Section */}
          <div className="relative w-96 ml-10">
            <Input
              id="search"
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              className="w-full p-3 rounded-full border-2 border-gray-300 focus-visible:ring-transparent  "
            />
             {filteredUsers.length > 0 && (
              <ul
                id="list"
                className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-xl max-h-48 overflow-y-auto"
              >
                {filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <Link onClick={() => {setSearch("");setFilteredUsers([])}} to={`/view/${user._id}/profile`}>{user.userName}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Nav Icons Section */}
          <div className="flex gap-5 mr-5">
            <Link to="/home" className="nav-link">
              <Button
                variant="outline"
                size="icon"
                className="text-tc w-full p-4"
              >
                <HomeIcon /> Home
              </Button>
            </Link>

            <Link to={`/render/chat/${user?._id}`} className="nav-link">
              <Button
                variant="outline"
                size="icon"
                className="text-tc w-full p-4"
              >
                <MessageCircle /> Messaging
              </Button>
            </Link>

            <Link to={"/projects"} className="nav-link">
              <Button
              variant='outline'
              size="icon"
              className="text-tc w-full p-4"
              >
                <Code2/> Project
              </Button>
            </Link>

            <Link to={"/quiz"} className="nav-link">
              <Button
              variant="outline"
              size="icon"
              className="text-tc w-full p-4"
              >
               <LibraryBig/> Quiz
              </Button>
            </Link>

            <Link to={`/view/${user?._id}/profile`} className="nav-link">
              <Button
                variant="outline"
                size="icon"
                className="text-tc w-full p-4"
              >
                <User /> Profile
              </Button>
            </Link>

            <Button  
              className="text-white w-full p-4 bg-red-500 hover:bg-red-600"
              onClick={LogoutHandeler}
            >
              <LogOut /> Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
