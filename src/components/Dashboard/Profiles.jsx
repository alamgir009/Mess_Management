import React, { useEffect, useMemo } from "react";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchProfile } from "../../store/slices/userSlice";
import { fetchGrandTotalAmount } from "../../store/slices/marketSlice";
import { fetchAllMeals, fetchTotalMeals } from "../../store/slices/mealSlice";
import { HiCurrencyRupee, HiFire, HiShoppingCart, HiUserCircle, HiCalendar, HiClock } from "react-icons/hi";
import { PiBowlSteamFill } from "react-icons/pi";

const Profiles = () => {
    const dispatch = useDispatch();

    const { profile, loading, error } = useSelector((state) => state.userData);
    const { grandTotalAmount, marketLoading, marketError } = useSelector((state) => state.marketData);
    const { totalMeal } = useSelector((state) => state.mealData);

    // Memoized calculations
    const mealCount = useMemo(() => {
        return profile?.mealDetails?.reduce((count, meal) => count + (meal.mealTime === "both" ? 2 : 1), 0) || 0;
    }, [profile?.mealDetails]);

    const marketCount = useMemo(() => {
        return profile?.marketDetails?.reduce((count, market) => count + (market.amount >= 1 ? market.amount : 0), 0) || 0;
    }, [profile?.marketDetails]);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchGrandTotalAmount());
        dispatch(fetchTotalMeals());
        dispatch(fetchAllMeals());
    }, [dispatch]);

    const getWeekday = (date) => new Date(date).toLocaleString("default", { weekday: "long" });

    if (loading || marketLoading) return (
        <div className="min-h-screen bg-gradient-to-b from-black to-blue-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
        </div>
    );

    if (error || marketError) return (
        <div className="min-h-screen bg-gradient-to-b from-black to-blue-950 flex items-center justify-center">
            <div className="bg-red-500/20 p-6 rounded-lg border border-red-500 backdrop-blur-lg">
                <p className="text-red-400 text-lg">Error: {error || marketError}</p>
            </div>
        </div>
    );

    return (
        <div className="font-inter flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 min-h-screen">
            {/* SideBar remains untouched */}
            <div className="sidebar w-full lg:w-80 m-1 rounded-md bg-gray-950">
                <SideBar />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow m-1 p-4 space-y-6">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 p-6 rounded-2xl border border-white/10 backdrop-blur-lg shadow-xl">
                    <div className="flex items-center gap-4">
                        {profile?.image ? (
                            <img
                                src={profile.image}
                                alt={profile.name || "User Profile"}
                                className="w-16 h-16 rounded-full object-cover border border-white/20"
                                onError={(e) => (e.target.style.display = "none")} // Hides the image if it fails to load
                            />
                        ) : (
                            <HiUserCircle className="w-16 h-16 text-teal-400/80" />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
                                {profile?.name}
                            </h1>
                            <p className="flex items-center gap-2 text-teal-300">
                                <span
                                    className={
                                        profile?.role === "admin"
                                            ? "text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full"
                                            : "text-yellow-300 bg-teal-500/20 px-2 py-1 rounded-full"
                                    }
                                >
                                    {profile?.role}
                                </span>
                                <span className="text-white/60">•</span>
                                <span className="text-sm">{profile?.email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        {
                            icon: <HiCurrencyRupee className="w-6 h-6" />,
                            title: "Total Market",
                            value: `₹${grandTotalAmount || 0}`,
                            bg: "bg-blue-500/20"
                        },

                        {
                            icon: <PiBowlSteamFill className="w-6 h-6" />,
                            title: "Total Meal",
                            value: totalMeal?.grandTotalMeal,
                            bg: "bg-purple-500/20"
                        },

                        {
                            icon: <HiShoppingCart className="w-6 h-6" />,
                            title: "Meal Charge",
                            value: `₹${(grandTotalAmount / totalMeal?.grandTotalMeal).toFixed(2) || 0}`,
                            bg: "bg-teal-500/20"
                        },

                        {
                            icon: <HiCurrencyRupee className="w-6 h-6" />,
                            title: "Payment",
                            value: profile?.payment,
                            status: profile?.payment === "success" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                        },

                        {
                            icon: <HiFire className="w-6 h-6" />,
                            title: "Gas Bill",
                            value: profile?.gasBill,
                            status: profile?.gasBill === "success" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                        },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg || stat.status} p-4 rounded-xl border border-white/10 backdrop-blur-lg hover:bg-white/5 transition-all`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">{stat.icon}</div>
                                <div>
                                    <p className="text-sm text-gray-300">{stat.title}</p>
                                    <p className="text-xl font-semibold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Market Details Section */}
                {profile?.totalAmount && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
                        <div className="flex items-center gap-2 mb-6">
                            <HiShoppingCart className="w-6 h-6 text-teal-400" />
                            <h2 className="text-xl font-semibold">Your Market :</h2>
                            <span className="ml-2 text-teal-400">({profile.totalAmount} ₹)</span>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        {["Item", "Amount", "Date", "Day"].map((header, idx) => (
                                            <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-teal-300">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {profile.marketDetails.map((market, index) => (
                                        <tr key={market._id} className="hover:bg-white/5 transition-colors border-t border-white/10">
                                            <td className="px-4 py-3 font-medium">{market.items}</td>
                                            <td className="px-4 py-3 text-teal-400">₹{market.amount}</td>
                                            <td className="px-4 py-3 flex items-center gap-2">
                                                <HiCalendar className="w-4 h-4 text-gray-400" />
                                                {formatDate(market.date)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{getWeekday(market.date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Meal Details Section */}
                {profile?.mealDetails?.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
                        <div className="flex items-center gap-2 mb-6">
                            <PiBowlSteamFill className="w-6 h-6 text-purple-400" />
                            <h2 className="text-xl font-semibold">Your Meal :</h2>
                            <span className="ml-2 text-purple-400">({mealCount} meals)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {profile.mealDetails.map((meal, index) => (
                                <div key={meal._id} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <HiClock className="w-5 h-5 text-teal-400" />
                                        <span className="font-medium capitalize">{meal.mealTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <HiCalendar className="w-4 h-4" />
                                        {formatDate(meal.date)}
                                        <span className="ml-2 px-2 py-1 bg-white/5 rounded-full">
                                            {getWeekday(meal.date)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Toaster position="top-center" reverseOrder={false} />
            </div>
        </div>
    );
};

// Helper function to format date
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

export default Profiles;