import { FaHome, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        // Sync the controlled input whenever React Router's query string changes.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchTerm(urlParams.get("searchTerm") || "");
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        navigate(`/search?${urlParams.toString()}`);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-6">
                <Link to="/" className="group flex shrink-0 items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm transition-colors group-hover:bg-emerald-800">
                        <FaHome aria-hidden="true" />
                    </span>
                    <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                        <span className="text-slate-800">Sahand</span>
                        <span className="text-emerald-700">Estate</span>
                    </span>
                </Link>

                <form
                    onSubmit={handleSubmit}
                    role="search"
                    className="order-3 flex w-full items-center rounded-full border border-slate-200 bg-slate-50 p-1.5 shadow-inner transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 sm:order-none sm:ml-auto sm:w-auto sm:max-w-md sm:flex-1"
                >
                    <input
                        type="text"
                        placeholder="Search properties..."
                        aria-label="Search properties"
                        className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                        <FaSearch aria-hidden="true" className="text-sm" />
                    </button>
                </form>

                <nav aria-label="Main navigation" className="ml-auto">
                    <ul className="flex items-center gap-1 sm:gap-2">
                        {[
                            { label: "Home", to: "/" },
                            { label: "About", to: "/about" },
                        ].map(({ label, to }) => {
                            const isActive = location.pathname === to;
                            return (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        aria-current={isActive ? "page" : undefined}
                                        className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                                            isActive
                                                ? "bg-emerald-50 text-emerald-800"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            );
                        })}
                        <li>
                            <Link
                                to="/profile"
                                aria-label={currentUser ? "Your profile" : "Sign in"}
                                className="ml-1 flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 sm:px-4"
                            >
                                {currentUser ? (
                                    <img
                                        className="h-7 w-7 rounded-full object-cover"
                                        src={currentUser.avatar}
                                        alt=""
                                    />
                                ) : (
                                    "Sign In"
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
