import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Unable to load landlord details.");
        }
        if (!ignore) {
          setLandlord(data);
          setError("");
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message);
        }
      }
    };

    fetchLandlord();
    return () => {
      ignore = true;
    };
  }, [listing.userRef]);

  if (error) {
    return (
      <p className="text-red-700 text-sm" role="alert">
        {error}
      </p>
    );
  }

  if (!landlord) {
    return (
      <p className="text-slate-600 text-sm" role="status">
        Loading landlord details...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p>
        Contact{" "}
        <span className="font-semibold">{landlord.username}</span> for{" "}
        <span className="font-semibold">{listing.name.toLowerCase()}</span>
      </p>
      <textarea
        name="message"
        id="message"
        rows="2"
        placeholder="Enter your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded-lg p-3"
      />
      <Link
        to={`mailto:${landlord.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
        className="w-full bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
      >
        Send Message
      </Link>
    </div>
  );
}
