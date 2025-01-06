import { setAuthUser } from '@/redux/authSlice';
import axios from 'axios';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function CreateProfile() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const[formData , setFormData] = useState({
        userName : "",
        bio: "",
        experience: "",
        interest: "",
        city: "",
        state: "",
        country: "",
        gender: "",
        profilePic: null,
        resume: null,
    });

    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state

    useEffect(() => {
      // Fetch interests from API
      const fetchInterests = async () => {
        setLoading(true); // Set loading to true at the start of the fetch
        try {
          const response = await axios.get(`${import.meta.env.VITE_URL}/render/interests`, {
            withCredentials: true,
          });
          setInterests(response.data.newInterest);
        } catch (err) {
          toast.error('Failed to fetch interests');
        } finally {
          setLoading(false); // Reset loading state after the operation
        }
      };
  
      fetchInterests();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
    
        setFormData({
          ...formData,
          [name]: type === "file" ? files[0] : value,
        });
    };
    
    const handleSubmit =async (e) => {
      e.preventDefault();
      setLoading(true); // Set loading to true when submitting
      try{
        const response =await axios.post(`${import.meta.env.VITE_URL}/user/register` , formData ,{
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials : true
        });
    
        if(response.data.success){
          toast.success(response.data.message);
          dispatch(setAuthUser(response.data.user));
          navigate('/home')
        }
      }catch(err){
        toast.error(err.message);
      } finally {
        setLoading(false); // Reset loading state after the operation
      }
    };

  return (
    <div className="flex justify-center items-center bg-[#D8BFD8] min-h-screen">
      <form
        className="bg-white p-8 rounded-md shadow-md w-full max-w-4xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center mb-4">Registration</h2>
        <div className="grid grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block mb-2 font-semibold">Username</label>
            <input
              type="text"
              name="userName"
              placeholder={user.userName}
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Bio */}
          <div>
            <label className="block mb-2 font-semibold">Bio</label>
            <input
              type="text"
              name="bio"
              placeholder={user?.bio || "bio..."}
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Experience */}
          <div>
            <label className="block mb-2 font-semibold">Experience:</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option>Select an option</option>
              <option value="0-1 year">0-1 year</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3+ years">3+ years</option>
            </select>
          </div>
          {/* Interest */}
          <div>
            <label className="block mb-2 font-semibold">Choose an interest:</label>
            <select
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option>Select an option</option>
              {interests.length > 0 ? (
                interests.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))
              ) : (
                <option>Loading interests...</option>
              )}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block mb-2 font-semibold">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option>Please Select City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
            </select>
          </div>
          {/* State */}
          <div>
            <label className="block mb-2 font-semibold">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option>Please Select State</option>
              <option value="California">California</option>
              <option value="Texas">Texas</option>
            </select>
          </div>
          {/* Country */}
          <div>
            <label className="block mb-2 font-semibold">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option>Please Select Country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
            </select>
          </div>
          {/* Gender */}
          <div>
            <label className="block mb-2 font-semibold">Gender *</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  checked={formData.gender === "Male"}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  checked={formData.gender === "Female"}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  onChange={handleChange}
                  checked={formData.gender === "Other"}
                />
                Other
              </label>
            </div>
          </div>
          {/* File Upload */}
          <div>
            <label className="block mb-2 font-semibold">Photo</label>
            <input
              type="file"
              name="profilePic"
              onChange={handleChange}
              className="block w-full text-sm"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Resume</label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              className="block w-full text-sm"
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="w-[30vw] bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition-all"
            disabled={loading} // Disable button while loading
          >
            {loading ?
              <div className='flex justify-center align-center'>
                Loading... <Loader />
              </div> : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProfile