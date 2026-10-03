import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0); 
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // Reset any previous errors before starting
    setFileUploadError(false);

    const data = new FormData();
    data.append("file", file);
    
    // Using the Unsigned preset you created in Cloudinary
    data.append("upload_preset", "mern_estate_preset"); 

    // Create a new XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest();

    // 1. Listen to the upload progress event for real-time percentage
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setFilePerc(percentComplete); 
      }
    });

    // 2. Listen for when the request finishes
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Success! Parse the Cloudinary response and update the image
          const uploadedImageData = JSON.parse(xhr.responseText);
          setFormData({ ...formData, avatar: uploadedImageData.secure_url });
          setFileUploadError(false);
        } else {
          // If Cloudinary rejects it (e.g., file too large or wrong format)
          setFileUploadError(true);
          setFilePerc(0);
        }
      }
    };

    // 3. Open the connection and send the request to your specific Cloudinary URL
    xhr.open("POST", "https://api.cloudinary.com/v1_1/utrwkdln/image/upload", true);
    xhr.send(data);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          // Update src to show newly uploaded avatar instantly, fallback to currentUser
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        
        {/* Dynamic UI feedback matching the instructor's logic */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : ("")}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}