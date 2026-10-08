import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;

    const timeoutId = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeoutId);
  }, [copied]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyError(false);
      setCopied(true);
    } catch {
      setCopyError(true);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchListing = async () => {
      setLoading(true);
      setError(false);
      setListing(null);

      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (!res.ok || data.success === false || !Array.isArray(data.imageUrls)) {
          throw new Error(data.message || "Unable to load listing.");
        }

        if (!ignore) {
          setListing(data);
        }
      } catch {
        if (!ignore) {
          setError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchListing();
    return () => {
      ignore = true;
    };
  }, [params.listingId]);

  return (
    <main>
      {loading && (
        <p className="text-center my-7 text-2xl" role="status">
          Loading...
        </p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-red-700" role="alert">
          Something went wrong!
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <div className="relative">
            <Swiper modules={[Navigation]} navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    role="img"
                    aria-label={`${listing.name} property photo`}
                    style={{
                      background: `url("${url}") center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy listing link"
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border bg-slate-100 shadow-md"
            >
              <FaShare className="text-slate-500" />
            </button>
            {copied && (
              <p
                className="absolute right-5 top-[4.75rem] z-10 rounded-md bg-slate-100 p-2 text-sm shadow-md"
                role="status"
              >
                Link copied!
              </p>
            )}
          </div>
          {copyError && (
            <p className="text-center text-sm text-red-700" role="alert">
              Unable to copy the listing link.
            </p>
          )}

          <section className="max-w-4xl mx-auto p-3 my-7 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">
              {listing.name} - $
              {Number(
                listing.offer ? listing.discountPrice : listing.regularPrice,
              ).toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </h1>

            <p className="flex items-center mt-2 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            <div className="flex gap-4">
              <p
                className={`w-full max-w-[200px] rounded-md p-1 text-center text-white ${
                  listing.type === "rent" ? "bg-red-900" : "bg-green-900"
                }`}
              >
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="w-full max-w-[200px] rounded-md bg-green-900 p-1 text-center text-white">
                  $
                  {(
                    Number(listing.regularPrice) -
                    Number(listing.discountPrice)
                  ).toLocaleString("en-US")}{" "}
                  OFF
                </p>
              )}
            </div>

            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>

            <ul className="flex flex-wrap items-center gap-4 text-sm font-semibold text-green-900 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms} {Number(listing.bedrooms) === 1 ? "bed" : "beds"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms}{" "}
                {Number(listing.bathrooms) === 1 ? "bath" : "baths"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}
