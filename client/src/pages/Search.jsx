import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

const defaultSidebarData = {
  searchTerm: "",
  type: "all",
  parking: false,
  furnished: false,
  offer: false,
  sort: "createdAt",
  order: "desc",
};

const getSidebarDataFromSearch = (search) => {
  const urlParams = new URLSearchParams(search);

  return {
    searchTerm: urlParams.get("searchTerm") || "",
    type: ["all", "rent", "sale"].includes(urlParams.get("type"))
      ? urlParams.get("type")
      : defaultSidebarData.type,
    parking: urlParams.get("parking") === "true",
    furnished: urlParams.get("furnished") === "true",
    offer: urlParams.get("offer") === "true",
    sort: urlParams.get("sort") || defaultSidebarData.sort,
    order: urlParams.get("order") || defaultSidebarData.order,
  };
};

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState(() =>
    getSidebarDataFromSearch(location.search),
  );
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    // Keep the sidebar controls synchronized with navigation from the header or browser history.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarData(getSidebarDataFromSearch(location.search));

    let ignore = false;
    const fetchListings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await response.json();

        if (!response.ok || data.success === false || !Array.isArray(data)) {
          throw new Error(data.message || "Unable to load listings.");
        }

        if (!ignore) {
          setListings(data);
        }
      } catch (fetchError) {
        if (!ignore) {
          setListings([]);
          setError(fetchError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchListings();
    return () => {
      ignore = true;
    };
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebarData((previous) => ({ ...previous, type: id }));
      return;
    }

    if (id === "searchTerm") {
      setSidebarData((previous) => ({ ...previous, searchTerm: value }));
      return;
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebarData((previous) => ({ ...previous, [id]: Boolean(checked) }));
      return;
    }

    if (id === "sort_order") {
      const [sort = defaultSidebarData.sort, order = defaultSidebarData.order] =
        value.split("_");
      setSidebarData((previous) => ({ ...previous, sort, order }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-semibold">Type:</span>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <label htmlFor="all">Rent &amp; Sale</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <label htmlFor="sale">Sale</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span className="font-semibold">Amenities:</span>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <label htmlFor="parking">Parking</label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort_order" className="font-semibold">
              Sort:
            </label>
            <select
              id="sort_order"
              onChange={handleChange}
              value={`${sidebarData.sort}_${sidebarData.order}`}
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full" role="status">
              Loading...
            </p>
          )}
          {!loading && error && (
            <p className="text-xl text-red-700" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {!loading &&
            !error &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
}
