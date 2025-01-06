import React, { useEffect, useState } from "react";
import { Link, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SpotlightCard from "./ReactBeats/SpotLightCard";

function Project() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/projects/create`,
        { name: projectName },
        { withCredentials: true }
      );
      console.log("Project created");
      setProjectName("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get(`${import.meta.env.VITE_URL}/projects/all`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        toast.error(response.data.message);
      }
    };
    fetchProjects();
  }, [projects]);

  async function deleteProject(id) {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_URL}/projects/delete/${id}` ,{
        withCredentials : true
      })
      if (response.data.success) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== id)
        );
        toast.success("Project Deleated successfully!!");
      } else {
        toast.error("Server error");
      }
    }catch(err){
      toast.error(err.message);
    }
  }

  return (
    <div className="mt-5 ml-5 pt-10">
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-[8vw] h-[7vh] mb-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all">
              Create Project <Link />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold text-white">
                Create New Project
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={createProject} className="mt-4">
              <div className="mb-6">
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Project Name
                </label>
                <input
                  id="project-name"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  placeholder="Enter project name"
                  className="mt-2 block w-full p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex gap-4 flex-wrap">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => {
              navigate(`/project/${project._id}`, {
                state: { project },
              });
            }}
            className="w-44 h-44 flex flex-col justify-between items-center p-2 hover:cursor-pointer"
          >
            <SpotlightCard className="w-full h-full text-black" spotlightColor="rgba(0, 0, 0, 0.4)">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-semibold text-lg mb-1">{project.name}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <p>
                      <small>
                        <i className="ri-user-line"></i> Collaborators
                      </small>
                       :
                    </p>
                    <span className="font-medium">{project.users.length}</span>
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-red-500 hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to the parent element
                    deleteProject(project._id);
                  }}
                >Delete</Button>
              </div>
            </SpotlightCard>
          </div>        
        ))}
        </div>
      </div>
    </div>
  );
}

export default Project;
