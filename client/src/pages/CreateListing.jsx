import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/utrwkdln/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "mern_estate_preset";

const storeImage = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: data,
  });
  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    throw new Error(
      result.error?.message || "Cloudinary image upload failed.",
    );
  }

  return result.secure_url;
};

export function ListingForm({ isUpdate = false }) {
  const fileInputRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingListing, setFetchingListing] = useState(isUpdate);

  useEffect(() => {
    if (!isUpdate) return undefined;

    let ignore = false;
    const fetchListing = async () => {
      setFetchingListing(true);
      setError(false);

      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Unable to load listing.");
        }
        if (!ignore) {
          setFormData({
            ...data,
            imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
          });
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message);
        }
      } finally {
        if (!ignore) {
          setFetchingListing(false);
        }
      }
    };

    fetchListing();
    return () => {
      ignore = true;
    };
  }, [isUpdate, params.listingId]);

  const handleChange = (e) => {
    const { id, checked, type, value } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((previous) => ({ ...previous, type: id }));
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData((previous) => ({ ...previous, [id]: checked }));
    } else if (type === "number" || type === "text" || type === "textarea") {
      setFormData((previous) => ({ ...previous, [id]: value }));
    }
  };

  const handleImageSubmit = async () => {
    if (
      files.length === 0 ||
      files.length + formData.imageUrls.length >= 7
    ) {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }

    setImageUploadError(false);
    setUploading(true);

    try {
      const urls = await Promise.all(files.map((file) => storeImage(file)));
      setFormData((previous) => ({
        ...previous,
        imageUrls: previous.imageUrls.concat(urls),
      }));
      setFiles([]);
      fileInputRef.current.value = "";
    } catch (uploadError) {
      setImageUploadError(uploadError.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((previous) => ({
      ...previous,
      imageUrls: previous.imageUrls.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      return;
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      setError("Discount price must be lower than regular price");
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch(
        isUpdate
          ? `/api/listing/update/${params.listingId}`
          : "/api/listing/create",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        },
      );
      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || "Unable to create listing.");
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  if (isUpdate && !formData._id) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
        <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-slate-900">
          Update a Listing
        </h1>
        <p className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700" role="alert">
          {fetchingListing ? "Loading listing..." : error || "Listing not found."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Sahand Estate
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {isUpdate ? "Update your listing" : "Create a listing"}
        </h1>
        <p className="mt-2 text-slate-500">
          {isUpdate
            ? "Make changes to your property details and photos."
            : "Share your property with people looking for their next home."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Property details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tell people what makes this property special.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                Listing title
              </label>
              <input
                type="text"
                placeholder="e.g. Bright apartment near the park"
                id="name"
                maxLength="62"
                minLength="10"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                placeholder="Describe the property, its highlights, and nearby amenities..."
                id="description"
                required
                rows="5"
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-semibold text-slate-700">
                Property address
              </label>
              <input
                type="text"
                placeholder="Street, neighborhood, or city"
                id="address"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-700">
                Listing type
              </legend>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "sale", label: "For sale", checked: formData.type === "sale" },
                  { id: "rent", label: "For rent", checked: formData.type === "rent" },
                ].map(({ id, label, checked }) => (
                  <label
                    key={id}
                    htmlFor={id}
                    className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                      checked
                        ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={id}
                      className="sr-only"
                      checked={checked}
                      onChange={handleChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-700">
                Features
              </legend>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: "parking", label: "Parking spot", checked: formData.parking },
                  { id: "furnished", label: "Furnished", checked: formData.furnished },
                  { id: "offer", label: "Special offer", checked: formData.offer },
                ].map(({ id, label, checked }) => (
                  <label
                    key={id}
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-emerald-300"
                  >
                    <input
                      type="checkbox"
                      id={id}
                      className="h-4 w-4 rounded accent-emerald-700"
                      checked={checked}
                      onChange={handleChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="bedrooms" className="mb-2 block text-sm font-semibold text-slate-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="bathrooms" className="mb-2 block text-sm font-semibold text-slate-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Pricing
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Set a clear and competitive price.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="regularPrice" className="mb-2 block text-sm font-semibold text-slate-700">
                  Regular price ($ / month)
                </label>
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  value={formData.regularPrice}
                  onChange={handleChange}
                />
              </div>
              {formData.offer && (
                <div>
                  <label htmlFor="discountPrice" className="mb-2 block text-sm font-semibold text-slate-700">
                    Discount price ($ / month)
                  </label>
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                Property photos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload up to 6 images. The first image will be the cover.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="min-w-0 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-2 text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                type="file"
                id="images"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                disabled={uploading}
                className="rounded-xl border border-emerald-700 px-5 py-3 text-sm font-bold uppercase text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload photos"}
              </button>
            </div>
            {imageUploadError && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {imageUploadError}
              </p>
            )}
            {formData.imageUrls.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={url}
                      alt={`Listing photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute right-2 top-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-red-700 shadow transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button
            disabled={loading || uploading || fetchingListing}
            className="rounded-xl bg-emerald-700 px-5 py-4 font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? isUpdate
                ? "Updating..."
                : "Creating..."
              : isUpdate
                ? "Save listing changes"
                : "Publish listing"}
          </button>
        </section>
      </form>
    </div>
    </main>
  );
}

export default function CreateListing() {
  return <ListingForm />;
}
