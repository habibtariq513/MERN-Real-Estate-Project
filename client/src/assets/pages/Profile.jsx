import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);

  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || data.success === false || !Array.isArray(data)) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch {
      setShowListingsError(true);
    }
  };

  const handleFileUpload = (file) => {
    setFileUploadError("");
    setUpdateSuccess(false);
    setIsUploading(true);
    setFilePerc(0);

    const data = new FormData();
    data.append("file", file);

    data.append("upload_preset", "mern_estate_preset");

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setFilePerc(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const uploadedImageData = JSON.parse(xhr.responseText);
          if (!uploadedImageData.secure_url) {
            throw new Error(
              "The image upload response did not include an image URL.",
            );
          }
          setFormData((previous) => ({
            ...previous,
            avatar: uploadedImageData.secure_url,
          }));
        } catch (uploadError) {
          setFileUploadError(uploadError.message);
          setFilePerc(0);
        }
      } else {
        setFileUploadError("Image upload failed. Please try again.");
        setFilePerc(0);
      }
    });

    xhr.addEventListener("error", () => {
      setIsUploading(false);
      setFileUploadError(
        "Image upload failed. Please check your connection and try again.",
      );
      setFilePerc(0);
    });

    xhr.open(
      "POST",
      "https://api.cloudinary.com/v1_1/utrwkdln/image/upload",
      true,
    );
    xhr.send(data);
  };

  const handleChange = (e) => {
    setUpdateSuccess(false);
    setFormData((previous) => ({
      ...previous,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(
          data.message || `Profile update failed (${res.status}).`,
        );
      }

      dispatch(updateUserSuccess(data));
      setFormData({});
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
     }
  };

  const handleSignOut = async () => {
     try {
       dispatch(signOutUserStart());
       const res = await fetch("/api/auth/signout");
       const data = await res.json();
       if (data.success === false) {
         dispatch(signOutUserFailure(data.message));
         return;
       }

       dispatch(signOutUserSuccess(data));
     } catch (error) {
       dispatch(signOutUserFailure(error.message));
     }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) handleFileUpload(selectedFile);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current?.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700" role="alert">
              {fileUploadError}
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          value={formData.username ?? currentUser.username ?? ""}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          value={formData.email ?? currentUser.email ?? ""}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          value={formData.password ?? ""}
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading || isUploading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase cursor-pointer hover:opacity-95 disabled:opacity-80"
        >
          {loading
            ? "Updating..."
            : isUploading
              ? "Uploading image..."
              : "Update"}
        </button>
        {error && (
          <p className="text-red-700" role="alert">
            {error}
          </p>
        )}
        {updateSuccess && (
          <p className="text-green-700" role="status">
            Profile updated successfully.
          </p>
        )}
      </form>

      <button
        type="button"
        onClick={handleShowListings}
        className="text-green-700 w-full mt-5"
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-2 text-sm" role="alert">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings.length > 0 && (
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-center text-2xl font-semibold">Your Listings</h2>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 bg-white shadow-sm"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain rounded-md"
                />
              </Link>

              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  className="text-red-700 uppercase text-xs hover:opacity-75"
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="text-green-700 uppercase text-xs hover:opacity-75"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          CREATE LISTING
        </Link>
      </div>
    </div>
  );
}
