import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
          <section className="max-w-4xl mx-auto p-3">
            <h1 className="text-2xl font-semibold">{listing.name}</h1>
            <p className="mt-3 text-slate-700">{listing.description}</p>
          </section>
        </div>
      )}
    </main>
  );
}
