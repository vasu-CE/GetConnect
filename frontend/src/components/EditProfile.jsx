import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Loader, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [availableInterests, setAvailableInterests] = useState([]);
  const [oldInterests, setOldInterests] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const [formData, setFormData] = useState({
    userName: "",
    bio: "",
    profilePic: null,
    resume: null,
    gender: "male",
    interests: [],
    deleteInterest: "",
  });

  useEffect(() => {
    const fetchInterests = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/render/interests`,
          {
            withCredentials: true,
          }
        );

        setOldInterests(response.data.oldInterest);
        setAvailableInterests(response.data.newInterest);
      } catch (error) {
        toast.error("Error fetching interests:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchInterests();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "interests") {
      if (!formData.interests.includes(value)) {
        setFormData({
          ...formData,
          interests: [...formData.interests, value],
        });
      }
    } else if (name === "deleteInterest") {
      setFormData({
        ...formData,
        interests: formData.interests.filter((interest) => interest !== value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setAuthUser(response.data.user));
        navigate("/home");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#D8BFD8]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700">Change Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder={user?.userName}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-gray-700">Change Bio</label>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder={user?.bio}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Profile Picture */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">
            Change Profile Picture:
          </label>
          <input
            type="file"
            name="profilePic"
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        {/* Insert Interest */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Interests
          </label>
          <select
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
          >
            <option value="">Select an Interest</option>
            {availableInterests.map((interest, index) => (
              <option key={index} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>

        {/* Delete Interest */}
        <div className="mb-4">
          <label className="block text-gray-700">Delete Interest</label>
          <select
            name="deleteInterest"
            value={formData.deleteInterest}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {oldInterests.map((interest, index) => (
              <option key={index} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>

        {/* Resume */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Resume:</label>
          <input
            type="file"
            name="resume"
            onChange={handleChange}
            className="mt-2"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Gender</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
                className="mr-2"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={formData.gender === "Other"}
                onChange={handleChange}
                className="mr-2"
              />
              Other
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition duration-200"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <span>Loading...</span>
              <Loader />
            </div>
          ) : (
            "Upload"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
