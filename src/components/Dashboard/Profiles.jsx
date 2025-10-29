import React, { useEffect, useMemo, useState, useRef } from "react";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { fetchProfile } from "../../store/slices/userSlice";
import { fetchGrandTotalAmount, deleteMarketById } from "../../store/slices/marketSlice"; // Make sure deleteMarketById is exported from marketSlice
import { deleteMealById, fetchAllMeals, fetchTotalMeals } from "../../store/slices/mealSlice";
import {
    HiCurrencyRupee,
    HiFire,
    HiShoppingCart,
    HiUserCircle,
    HiCalendar,
    HiClock,
    HiPencilAlt,
    HiTrash,
    HiDotsVertical,
    HiOutlineCog
} from "react-icons/hi";
import { PiBowlSteamFill } from "react-icons/pi";

const Profiles = () => {
    const dispatch = useDispatch();

    const { profile, loading, error } = useSelector((state) => state.userData);
    const { grandTotalAmount, marketLoading, marketError } = useSelector((state) => state.marketData);
    const { totalMeal, meal } = useSelector((state) => state.mealData);

    // Local state for immediate UI updates
    const [localProfile, setLocalProfile] = useState(profile);
    const [localGrandTotal, setLocalGrandTotal] = useState(grandTotalAmount);
    const [localTotalMeal, setLocalTotalMeal] = useState(totalMeal);
    
    // Single state to track which menu is open (only one at a time)
    const [openMenuId, setOpenMenuId] = useState(null);
    
    // Loading states for delete operations
    const [deletingMealId, setDeletingMealId] = useState(null);
    const [deletingMarketId, setDeletingMarketId] = useState(null);

    // Update local states when Redux states change
    useEffect(() => {
        setLocalProfile(profile);
    }, [profile]);

    useEffect(() => {
        setLocalGrandTotal(grandTotalAmount);
    }, [grandTotalAmount]);

    useEffect(() => {
        setLocalTotalMeal(totalMeal);
    }, [totalMeal]);

    // Memoized calculations using local states
    const mealCount = useMemo(() => {
        return localProfile?.mealDetails?.reduce((count, meal) => count + (meal.mealTime === "both" ? 2 : 1), 0) || 0;
    }, [localProfile?.mealDetails]);

    const marketCount = useMemo(() => {
        return localProfile?.marketDetails?.reduce((count, market) => count + (market.amount >= 1 ? market.amount : 0), 0) || 0;
    }, [localProfile?.marketDetails]);

    // Calculate meal charge safely
    const mealCharge = useMemo(() => {
        if (!localGrandTotal || !localTotalMeal?.grandTotalMeal || localTotalMeal.grandTotalMeal === 0) {
            return 0;
        }
        return (localGrandTotal / localTotalMeal.grandTotalMeal).toFixed(2);
    }, [localGrandTotal, localTotalMeal]);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchGrandTotalAmount());
        dispatch(fetchTotalMeals());
        dispatch(fetchAllMeals());
    }, [dispatch]);

    const getWeekday = (date) => new Date(date).toLocaleString("default", { weekday: "long" });

    // Function to delete meal from database and update UI
    const handleMealDelete = async (deletedMealId, deletedMealData) => {
        setOpenMenuId(null);
        setDeletingMealId(deletedMealId);
        
        try {
            // Delete meal from database via Redux action
            await dispatch(deleteMealById(deletedMealId)).unwrap();
            
            // Update local profile meals
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: prev.mealDetails.filter(meal => meal._id !== deletedMealId)
            }));

            // Update total meals count
            const mealReduction = deletedMealData.mealTime === "both" ? 2 : 1;
            setLocalTotalMeal(prev => ({
                ...prev,
                grandTotalMeal: prev.grandTotalMeal - mealReduction
            }));
            
            // Refresh data from server to ensure consistency
            dispatch(fetchProfile());
            dispatch(fetchTotalMeals());
            dispatch(fetchAllMeals());
            
            toast.success("Meal deleted successfully!");
        } catch (error) {
            console.error("Error deleting meal:", error);
            toast.error(error?.message || "Failed to delete meal. Please try again!");
        } finally {
            setDeletingMealId(null);
        }
    };

    // Function to delete market from database and update UI
    const handleMarketDelete = async (deletedMarketId, deletedMarketAmount) => {
        setOpenMenuId(null);
        setDeletingMarketId(deletedMarketId);
        
        try {
            // Delete market from database via Redux action
            await dispatch(deleteMarketById(deletedMarketId)).unwrap();
            
            // Update local profile market details
            setLocalProfile(prev => ({
                ...prev,
                marketDetails: prev.marketDetails.filter(market => market._id !== deletedMarketId),
                totalAmount: (prev.totalAmount || 0) - deletedMarketAmount
            }));

            // Update grand total amount
            setLocalGrandTotal(prev => prev - deletedMarketAmount);
            
            // Refresh data from server to ensure consistency
            dispatch(fetchProfile());
            dispatch(fetchGrandTotalAmount());
            
            toast.success("Market item deleted successfully!");
        } catch (error) {
            console.error("Error deleting market item:", error);
            toast.error(error?.message || "Failed to delete market item. Please try again!");
        } finally {
            setDeletingMarketId(null);
        }
    };

    if (loading || marketLoading)
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-blue-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
            </div>
        );

    if (error || marketError)
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-blue-950 flex items-center justify-center">
                <div className="bg-red-500/20 p-6 rounded-lg border border-red-500 backdrop-blur-lg">
                    <p className="text-red-400 text-lg">Error: {error || marketError}</p>
                </div>
            </div>
        );

    return (
        <div className="font-inter flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 min-h-screen">
            {/* Sidebar */}
            <div className="sidebar w-full lg:w-80 m-1 rounded-md bg-gray-950">
                <SideBar />
            </div>

            {/* Main Content */}
            <div className="flex-grow m-1 p-4 space-y-6">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 p-6 rounded-2xl border border-white/10 backdrop-blur-lg shadow-xl">
                    <div className="flex items-center gap-4">
                        {localProfile?.image ? (
                            <img
                                src={localProfile.image}
                                alt={localProfile.name || "User Profile"}
                                className="w-16 h-16 rounded-full object-cover border border-white/20"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        ) : (
                            <HiUserCircle className="w-16 h-16 text-teal-400/80" />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
                                {localProfile?.name}
                            </h1>
                            <p className="flex items-center gap-2 text-teal-300">
                                <span
                                    className={
                                        localProfile?.role === "admin"
                                            ? "text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full"
                                            : "text-yellow-300 bg-teal-500/20 px-2 py-1 rounded-full"
                                    }
                                >
                                    {localProfile?.role}
                                </span>
                                <span className="text-white/60">•</span>
                                <span className="text-sm">{localProfile?.email}</span>
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
                            value: `₹${localGrandTotal || 0}`,
                            bg: "bg-blue-500/20"
                        },
                        {
                            icon: <PiBowlSteamFill className="w-6 h-6" />,
                            title: "Total Meal",
                            value: localTotalMeal?.grandTotalMeal || 0,
                            bg: "bg-purple-500/20"
                        },
                        {
                            icon: <HiShoppingCart className="w-6 h-6" />,
                            title: "Meal Charge",
                            value: `₹${mealCharge}`,
                            bg: "bg-teal-500/20"
                        },
                        {
                            icon: <HiCurrencyRupee className="w-6 h-6" />,
                            title: "Payment",
                            value: localProfile?.payment,
                            status:
                                localProfile?.payment === "success"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-orange-500/20 text-orange-400"
                        },
                        {
                            icon: <HiFire className="w-6 h-6" />,
                            title: "Gas Bill",
                            value: localProfile?.gasBill,
                            status:
                                localProfile?.gasBill === "success"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-orange-500/20 text-orange-400"
                        }
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className={`${stat.bg || stat.status} p-4 rounded-xl border border-white/10 backdrop-blur-lg hover:bg-white/5 transition-all`}
                        >
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
                {localProfile?.marketDetails?.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
                        <div className="flex items-center gap-2 mb-6">
                            <HiShoppingCart className="w-6 h-6 text-teal-400" />
                            <h2 className="text-xl font-semibold">Your Market :</h2>
                            <span className="ml-2 text-teal-400">({localProfile.totalAmount || 0} ₹)</span>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full">
                                <thead className="bg-white/10">
                                    <tr>
                                        {["Item", "Amount", "Date", "Day", "Action"].map((header, idx) => (
                                            <th
                                                key={idx}
                                                className="px-4 py-3 text-left text-sm font-semibold text-teal-300"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {localProfile.marketDetails.map((market) => (
                                        <MarketRow 
                                            key={market._id} 
                                            market={market} 
                                            getWeekday={getWeekday}
                                            onMarketDelete={handleMarketDelete}
                                            openMenuId={openMenuId}
                                            setOpenMenuId={setOpenMenuId}
                                            isDeleting={deletingMarketId === market._id}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Meal Details Section */}
                {localProfile?.mealDetails?.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
                        <div className="flex items-center gap-2 mb-6">
                            <PiBowlSteamFill className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-xl font-semibold">Your Meal :</h2>
                            <span className="ml-2 text-yellow-300">({mealCount} meals)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {localProfile.mealDetails.map((meal) => (
                                <MealCard 
                                    key={meal._id} 
                                    meal={meal} 
                                    getWeekday={getWeekday} 
                                    onMealDelete={handleMealDelete}
                                    openMenuId={openMenuId}
                                    setOpenMenuId={setOpenMenuId}
                                    isDeleting={deletingMealId === meal._id}
                                />
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

// MarketRow Component for individual market items
const MarketRow = ({ market, getWeekday, onMarketDelete, openMenuId, setOpenMenuId, isDeleting }) => {
    const menuRef = useRef(null);
    
    // Check if this specific menu is open
    const isMenuOpen = openMenuId === `market-${market._id}`;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen, setOpenMenuId]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        if (!isDeleting) {
            setOpenMenuId(isMenuOpen ? null : `market-${market._id}`);
        }
    };

    const handleEdit = () => {
        setOpenMenuId(null);
        alert(`Editing market: ${market.items}`);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${market.items}"?`)) {
            await onMarketDelete(market._id, market.amount);
        }
    };

    return (
        <tr className={`hover:bg-white/5 transition-colors border-t border-white/10 ${isDeleting ? 'opacity-50' : ''}`}>
            <td className="px-4 py-3 font-medium">{market.items}</td>
            <td className="px-4 py-3 text-teal-400">₹{market.amount}</td>
            <td className="px-4 py-3 flex items-center gap-2">
                <HiCalendar className="w-4 h-4 text-gray-400" />
                {formatDate(market.date)}
            </td>
            <td className="px-4 py-3 text-gray-400">
                {getWeekday(market.date)}
            </td>
            <td className="px-4 py-3">
                <div className="relative" ref={menuRef}>
                    {isDeleting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-500"></div>
                    ) : (
                        <>
                            <HiOutlineCog
                                className={`w-5 h-5 cursor-pointer transition-all ${
                                    isMenuOpen ? 'text-teal-400 rotate-90' : 'hover:text-teal-400'
                                }`}
                                onClick={toggleMenu}
                            />
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50 animate-fadeIn">
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left rounded-t-lg transition-colors"
                                    >
                                        <HiPencilAlt className="w-4 h-4 text-blue-400" /> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left text-red-400 rounded-b-lg transition-colors"
                                    >
                                        <HiTrash className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

// MealCard Component
const MealCard = ({ meal, getWeekday, onMealDelete, openMenuId, setOpenMenuId, isDeleting }) => {
    const menuRef = useRef(null);
    
    // Check if this specific menu is open
    const isMenuOpen = openMenuId === `meal-${meal._id}`;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen, setOpenMenuId]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        if (!isDeleting) {
            setOpenMenuId(isMenuOpen ? null : `meal-${meal._id}`);
        }
    };

    const handleEdit = () => {
        setOpenMenuId(null);
        alert(`Editing meal: ${meal.mealTime}`);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete this ${meal.mealTime} meal?`)) {
            await onMealDelete(meal._id, meal);
        }
    };

    return (
        <div className={`relative bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all ${isDeleting ? 'opacity-50' : ''}`}>
            {/* Top Row: Meal Time + Menu Icon */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <HiClock className="w-5 h-5 text-teal-400" />
                    <span className="font-medium capitalize">{meal.mealTime}</span>
                </div>

                <div className="relative" ref={menuRef}>
                    {isDeleting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-500"></div>
                    ) : (
                        <>
                            <HiDotsVertical
                                className={`w-5 h-5 cursor-pointer transition-all ${
                                    isMenuOpen ? 'text-teal-400' : 'hover:text-teal-400'
                                }`}
                                onClick={toggleMenu}
                            />

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50 animate-fadeIn">
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left rounded-t-lg transition-colors"
                                    >
                                        <HiPencilAlt className="w-4 h-4 text-blue-400" /> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left text-red-400 rounded-b-lg transition-colors"
                                    >
                                        <HiTrash className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Row: Date + Day */}
            <div className="flex justify-between items-center text-sm text-gray-400">
                <div className="flex items-center gap-3">
                    <HiCalendar className="w-4 h-4" />
                    <span>{formatDate(meal.date)}</span>
                    <span className="ml-2 px-2 py-1 bg-white/5 rounded-full">
                        {getWeekday(meal.date)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Profiles;