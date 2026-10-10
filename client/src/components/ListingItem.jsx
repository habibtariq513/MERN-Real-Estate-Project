import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const defaultImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

export default function ListingItem({ listing }) {
  const imageUrl = listing.imageUrls?.[0] || defaultImage;
  const price = Number(
    listing.offer ? listing.discountPrice : listing.regularPrice,
  ).toLocaleString("en-US");

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]"
    >
      <img
        src={imageUrl}
        alt={listing.name ? `${listing.name} listing cover` : "Listing cover"}
        className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-slate-700">
          {listing.name}
        </p>
        <div className="flex items-center gap-1 min-w-0">
          <MdLocationOn className="h-4 w-4 shrink-0 text-green-700" />
          <p className="text-sm text-gray-600 truncate w-full">
            {listing.address}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description}
        </p>
        <p className="text-slate-500 mt-2 font-semibold">
          ${price}
          {listing.type === "rent" && " / month"}
        </p>
        <div className="text-slate-700 flex gap-4 font-bold text-xs">
          <div>
            {Number(listing.bedrooms) > 1
              ? `${listing.bedrooms} beds`
              : `${listing.bedrooms} bed`}
          </div>
          <div>
            {Number(listing.bathrooms) > 1
              ? `${listing.bathrooms} baths`
              : `${listing.bathrooms} bath`}
          </div>
        </div>
      </div>
    </Link>
  );
}
