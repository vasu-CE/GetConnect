import React, { useState, useMemo, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setPosts } from "@/redux/PostSlice"

const availableTechInterests = [
  "Web Development",
  "JavaScript",
  "Python",
  "Java",
  "Node.js",
  "Express.js",
  "React.js",
  "Vue.js",
  "CSS",
  "HTML",
  "SQL",
  "MongoDB",
  "Firebase",
  "GraphQL",
  "Machine Learning",
  "Data Science",
  "Artificial Intelligence",
  "Deep Learning",
  "Blockchain",
  "Cybersecurity",
  "Game Development",
  "Mobile App Development",
  "Android Development",
  "iOS Development",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Rust",
  "PHP",
  "Swift",
  "Kotlin",
  "TypeScript",
  "Cloud Computing",
  "AWS",
  "Azure",
  "Google Cloud",
  "Linux",
  "DevOps",
  "Software Testing",
  "Agile",
  "Scrum",
  "Project Management",
  "UI/UX Design",
  "Software Architecture",
  "DevSecOps",
  "Database Management",
  "Big Data",
  "Data Analytics",
  "Business Intelligence",
  "Serverless Computing",
  "Virtualization",
  "IoT (Internet of Things)",
  "Embedded Systems",
  "Networking",
  "Database Administration",
  "Continuous Integration",
  "Continuous Deployment",
  "Tech Startups",
  "E-commerce",
  "SEO for Developers",
  "Automated Testing",
  "Cloud Security",
  "Containerization",
  "Microservices",
  "API Development",
  "Serverless Architecture",
  "JavaScript Frameworks",
  "Agile Development",
  "Software Development",
  "Ruby on Rails",
  "React Native",
  "Flutter",
  "Testing Frameworks",
  "GraphQL API",
  "API Testing",
  "Tech Innovations",
  "Virtual Reality",
  "Augmented Reality",
  "5G Technology",
  "Quantum Computing",
  "Robotic Process Automation (RPA)",
  "Wearable Tech",
  "Edge Computing",
  "Tech for Good",
]

function Community() {
  const [search, setSearch] = useState("")
  const [selectedInterests, setSelectedInterests] = useState([])
  const [showAll, setShowAll] = useState(false)
  const dispatch = useDispatch();

  const filteredInterests = useMemo(() => {
    return availableTechInterests.filter((interest) => interest.toLowerCase().includes(search.toLowerCase()))
  }, [search])

  const displayedInterests = showAll ? filteredInterests : filteredInterests.slice(0, 20)

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const clearSelection = () => {
    setSelectedInterests([])
  }


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/post/allpost/interests`,
          { userInterest: selectedInterests },
          { withCredentials: true }
        );
        

        if (response.data.success) {
          dispatch(setPosts(response.data.posts));
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchPosts();
  }, [selectedInterests])
  

  return (
    <div className="w-full bg-background p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Community</h3>
  
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search interests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 focus-visible:ring-transparent focus-visible:border-gray-400 border-2"
      />
  
      {/* Selected Interests */}
      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedInterests.map((interest) => (
            <Badge key={interest} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2">
              {interest}
              <X className="h-4 w-4 cursor-pointer" onClick={() => toggleInterest(interest)} />
            </Badge>
          ))}
          <Button variant="outline" size="sm" onClick={clearSelection}>
            Clear All
          </Button>
        </div>
      )}
  
      {/* Interests Grid */}
      <div className="interestList grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-4 overflow-auto max-h-[46vh]">
        {displayedInterests.length > 0 ? (
          displayedInterests.map((interest) => (
            <Button
              key={interest}
              variant={selectedInterests.includes(interest) ? "secondary" : "outline"}
              className="text-wrap"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Button>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">No interests found.</p>
        )}
      </div>
  
      {/* Show More / Show Less Button */}
      {filteredInterests.length > 20 && (
        <div className="flex justify-center mt-4">
          <Button variant="link" onClick={() => setShowAll(!showAll)} className="w-full">
            {showAll ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}
    </div>
  )
  
}

export default Community