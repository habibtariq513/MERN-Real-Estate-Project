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
  const [listingDeleteError, setListingDeleteError] = useState("");
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

  const handleListingDelete = async (listingId) => {
    setListingDeleteError("");

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Unable to delete listing.",
        );
      }

      setUserListings((previous) =>
        previous.filter((listing) => listing._id !== listingId),
      );
    } catch (deleteError) {
      setListingDeleteError(deleteError.message);
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
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Sahand Estate
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your profile
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your account details and property listings.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex flex-col items-center border-b border-slate-100 pb-6">
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
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Change profile photo"
                className="group relative rounded-full p-1 ring-4 ring-emerald-50 transition hover:ring-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
              >
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt={`${currentUser.username || "User"} profile`}
                  className="h-24 w-24 rounded-full object-cover"
                />
                <span className="absolute inset-1 flex items-end justify-center rounded-full bg-gradient-to-t from-black/60 to-transparent pb-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  Change
                </span>
              </button>
              <p className="mt-3 text-sm font-medium text-slate-500">
                Click your photo to update it
              </p>
              {(fileUploadError || (filePerc > 0 && filePerc < 100) || filePerc === 100) && (
                <p className="mt-2 text-sm" role={fileUploadError ? "alert" : "status"}>
                  {fileUploadError ? (
                    <span className="text-red-700">{fileUploadError}</span>
                  ) : filePerc < 100 ? (
                    <span className="text-slate-600">{`Uploading ${filePerc}%`}</span>
                  ) : (
                    <span className="text-emerald-700">Profile photo uploaded.</span>
                  )}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username ?? currentUser.username ?? ""}
                  id="username"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email ?? currentUser.email ?? ""}
                  id="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep your current password"
                  value={formData.password ?? ""}
                  id="password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-sm focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  onChange={handleChange}
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
              {updateSuccess && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
                  Profile updated successfully.
                </p>
              )}

              <button
                disabled={loading || isUploading}
                className="rounded-xl bg-emerald-700 px-5 py-3.5 font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Updating..."
                  : isUploading
                    ? "Uploading image..."
                    : "Save profile"}
              </button>
            </form>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Account actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your properties and account access.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleShowListings}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
              >
                Show my listings
              </button>
              <Link
                to="/create-listing"
                className="rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Create a listing
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Sign out
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                Delete account
              </button>
            </div>
          </aside>
        </div>

        {(showListingsError || listingDeleteError) && (
          <div className="mt-5 space-y-2" role="alert">
            {showListingsError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Unable to load your listings. Please try again.
              </p>
            )}
            {listingDeleteError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {listingDeleteError}
              </p>
            )}
          </div>
        )}

        {userListings.length > 0 && (
          <section className="mt-8">
            <div className="mb-4">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Your properties
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Your listings
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {userListings.map((listing) => (
                <article
                  key={listing._id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
                >
                  <Link
                    to={`/listing/${listing._id}`}
                    className="shrink-0 overflow-hidden rounded-xl"
                  >
                    <img
                      src={listing.imageUrls?.[0]}
                      alt={`${listing.name} cover`}
                      className="h-16 w-16 object-cover transition-transform hover:scale-105 sm:h-20 sm:w-20"
                    />
                  </Link>
                  <Link
                    className="min-w-0 flex-1 font-semibold text-slate-800 hover:text-emerald-800"
                    to={`/listing/${listing._id}`}
                  >
                    <p className="truncate">{listing.name}</p>
                    <p className="mt-1 truncate text-sm font-normal text-slate-500">
                      {listing.address}
                    </p>
                  </Link>
                  <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className="text-xs font-bold uppercase text-emerald-700 hover:text-emerald-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      type="button"
                      className="text-xs font-bold uppercase text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
