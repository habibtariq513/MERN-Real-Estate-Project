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
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    // Keep the sidebar controls synchronized with navigation from the header or browser history.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarData(getSidebarDataFromSearch(location.search));

    let ignore = false;
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      setError("");

      try {
        const response = await fetch(`/api/listing/get?${urlParams.toString()}`);
        const data = await response.json();

        if (!response.ok || data.success === false || !Array.isArray(data)) {
          throw new Error(data.message || "Unable to load listings.");
        }

        if (!ignore) {
          setListings(data);
          setShowMore(data.length > 8);
        }
      } catch (fetchError) {
        if (!ignore) {
          setListings([]);
          setShowMore(false);
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

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", String(listings.length));

    try {
      const response = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setListings((previous) => [...previous, ...data]);
        setShowMore(data.length > 8);
      }
    } catch {
      setShowMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="border-b border-slate-200 bg-white md:w-[340px] md:shrink-0 md:border-b-0 md:border-r">
        <div className="mx-auto max-w-2xl p-5 sm:p-7 md:sticky md:top-20 md:max-w-none">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Sahand Estate
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Find your next place
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Set your preferences to discover homes that fit your lifestyle.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
            <div>
              <label
                htmlFor="searchTerm"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search area or keyword
              </label>
              <input
                type="text"
                id="searchTerm"
                placeholder="Try a neighborhood or keyword"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-700">
                Property type
              </legend>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Rent & Sale", checked: sidebarData.type === "all" },
                  { id: "rent", label: "Rent", checked: sidebarData.type === "rent" },
                  { id: "sale", label: "Sale", checked: sidebarData.type === "sale" },
                ].map(({ id, label, checked }) => (
                  <label
                    key={id}
                    htmlFor={id}
                    className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-medium transition ${
                      checked
                        ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={id}
                      className="sr-only"
                      onChange={handleChange}
                      checked={checked}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <label
                htmlFor="offer"
                className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  id="offer"
                  className="h-4 w-4 rounded accent-emerald-700"
                  onChange={handleChange}
                  checked={sidebarData.offer}
                />
                Show special offers
              </label>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-slate-700">
                Amenities
              </legend>
              <div className="flex flex-col gap-3">
                {[
                  { id: "parking", label: "Parking available", checked: sidebarData.parking },
                  { id: "furnished", label: "Furnished", checked: sidebarData.furnished },
                ].map(({ id, label, checked }) => (
                  <label
                    key={id}
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                  >
                    <input
                      type="checkbox"
                      id={id}
                      className="h-4 w-4 rounded accent-emerald-700"
                      onChange={handleChange}
                      checked={checked}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="sort_order"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Sort results
              </label>
              <select
                id="sort_order"
                onChange={handleChange}
                value={`${sidebarData.sort}_${sidebarData.order}`}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="regularPrice_desc">Price: high to low</option>
                <option value="regularPrice_asc">Price: low to high</option>
                <option value="createdAt_desc">Newest first</option>
                <option value="createdAt_asc">Oldest first</option>
              </select>
            </div>

            <button className="rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
              Search listings
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-white px-5 py-7 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-medium text-emerald-700">
                Explore properties
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Listing results
              </h2>
            </div>
            {!loading && !error && (
              <p className="text-sm text-slate-500">
                {listings.length} {listings.length === 1 ? "property" : "properties"} found
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-5 p-5 sm:justify-start sm:p-8">
          {loading && (
            <p className="w-full py-16 text-center text-lg font-medium text-slate-600" role="status">
              Finding properties for you...
            </p>
          )}
          {!loading && error && (
            <p className="w-full rounded-xl border border-red-200 bg-red-50 p-5 text-red-700" role="alert">
              {error}
            </p>
          )}
          {!loading && !error && listings.length === 0 && (
            <div className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No properties found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your search term or relaxing a filter.
              </p>
            </div>
          )}
          {!loading &&
            !error &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              type="button"
              onClick={onShowMoreClick}
              className="w-full rounded-xl border border-emerald-700 bg-white px-5 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Show more properties
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
