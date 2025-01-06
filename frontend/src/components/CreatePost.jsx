import axios from "axios";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { appendPost } from "../redux/PostSlice";
import { Loader } from "lucide-react";

function CreatePost({ className }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const dispatch = useDispatch();
  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);
    if (!file) {
      toast.error("Please provide File");
      setLoading(false); // Reset loading state
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/post/addPost`,
          formData,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          dispatch(appendPost(response.data.post));
          setCaption("");
          setFile(null);
          setDialogOpen(false);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false); // Reset loading state after the operation
      }
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={`w-full bg-slate-200 text-gray-900 py-2 rounded-md mb-2 hover:bg-slate-300 transition-all ${className}`}
        >
          Create Post
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Image:</label>
            <div
              {...getRootProps({
                className:
                  "border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer",
              })}
              className="rounded-lg"
            >
              <input {...getInputProps()} />
              <p className="text-gray-500">
                {file ? file.name : "Drag & drop an image, or click to select"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Caption:</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter your caption"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <>
                Posting... <Loader />
              </>
            ) : (
              "Post"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
