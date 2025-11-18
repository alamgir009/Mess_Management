import React, { useEffect, useMemo, useState, useRef } from "react";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { fetchProfile } from "../../store/slices/userSlice";
import { fetchGrandTotalAmount, deleteMarketById, updateMarketById } from "../../store/slices/marketSlice";
import { deleteMealById, fetchAllMeals, fetchTotalMeals, updateMealById } from "../../store/slices/mealSlice";
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
    HiOutlineCog,
    HiX
} from "react-icons/hi";
import { PiBowlSteamFill } from "react-icons/pi";

const Profiles = () => {
    const dispatch = useDispatch();

    const { profile, loading, error } = useSelector((state) => state.userData);
    const { grandTotalAmount, marketLoading, marketError } = useSelector((state) => state.marketData);
    const { totalMeal, meal } = useSelector((state) => state.mealData);

    // Local state for immediate UI updates
    const [localProfile, setLocalProfile] = useState(profile || {});
    const [localGrandTotal, setLocalGrandTotal] = useState(grandTotalAmount || 0);
    const [localTotalMeal, setLocalTotalMeal] = useState(totalMeal || {});

    // Single state to track which menu is open (only one at a time)
    const [openMenuId, setOpenMenuId] = useState(null);

    // Loading states for delete operations
    const [deletingMealId, setDeletingMealId] = useState(null);
    const [deletingMarketId, setDeletingMarketId] = useState(null);

    // Edit modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMarket, setEditingMarket] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Edit modal states for Meal
    const [isEditMealModalOpen, setIsEditMealModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);
    const [isUpdatingMeal, setIsUpdatingMeal] = useState(false);

    // Update local states when Redux states change
    useEffect(() => {
        if (profile) {
            setLocalProfile(profile);
        }
    }, [profile]);

    useEffect(() => {
        if (grandTotalAmount !== undefined) {
            setLocalGrandTotal(grandTotalAmount);
        }
    }, [grandTotalAmount]);

    useEffect(() => {
        if (totalMeal) {
            setLocalTotalMeal(totalMeal);
        }
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

    // Function to open edit modal with market data
    const handleMarketEdit = (market) => {
        setOpenMenuId(null);
        setEditingMarket(market);
        setIsEditModalOpen(true);
    };

    // Function to close edit modal
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingMarket(null);
    };

    // Function to update market
    const handleMarketUpdate = async (updatedData) => {
        setIsUpdating(true);

        try {
            const oldAmount = editingMarket.amount;
            const newAmount = parseFloat(updatedData.amount);
            const amountDifference = newAmount - oldAmount;

            // Optimistically update local UI immediately for instant feedback
            setLocalProfile(prev => ({
                ...prev,
                marketDetails: prev.marketDetails?.map(market =>
                    market._id === editingMarket._id
                        ? {
                            ...market,
                            items: updatedData.items,
                            amount: newAmount,
                            date: updatedData.date
                        }
                        : market
                ) || [],
                totalAmount: (prev.totalAmount || 0) + amountDifference
            }));

            // Update grand total amount immediately
            setLocalGrandTotal(prev => prev + amountDifference);

            // Close modal immediately for better UX
            handleCloseEditModal();

            // Show success message immediately
            toast.success("Market item updated successfully!");

            // Update market in database via Redux action
            await dispatch(updateMarketById({
                id: editingMarket._id,
                marketData: {
                    items: updatedData.items,
                    amount: newAmount,
                    date: updatedData.date
                }
            })).unwrap();

            // Refresh data from server in background to ensure consistency
            dispatch(fetchProfile());
            dispatch(fetchGrandTotalAmount());

        } catch (error) {
            console.error("Error updating market item:", error);

            // Revert optimistic updates on error
            const oldAmount = editingMarket.amount;
            const newAmount = parseFloat(updatedData.amount);
            const amountDifference = newAmount - oldAmount;

            setLocalProfile(prev => ({
                ...prev,
                marketDetails: prev.marketDetails?.map(market =>
                    market._id === editingMarket._id
                        ? editingMarket
                        : market
                ) || [],
                totalAmount: (prev.totalAmount || 0) - amountDifference
            }));

            setLocalGrandTotal(prev => prev - amountDifference);

            toast.error(error?.message || "Failed to update market item. Changes reverted.");

            // Refresh from server to ensure consistency
            dispatch(fetchProfile());
            dispatch(fetchGrandTotalAmount());
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMealEdit = (meal) => {
        setOpenMenuId(null);
        setEditingMeal(meal);
        setIsEditMealModalOpen(true);
    };

    const handleCloseMealEditModal = () => {
        setIsEditMealModalOpen(false);
        setEditingMeal(null);
    };

    const handleMealUpdate = async (updatedData) => {
        setIsUpdatingMeal(true);
        try {
            // Optimistic update for meal
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: prev.mealDetails?.map(m =>
                    m._id === editingMeal._id
                        ? { ...m, ...updatedData }
                        : m
                ) || []
            }));

            handleCloseMealEditModal();
            toast.success("Meal updated successfully!");

            await dispatch(updateMealById({
                id: editingMeal._id,
                mealData: updatedData
            })).unwrap();

            dispatch(fetchProfile());
            dispatch(fetchAllMeals());
        } catch (error) {
            // Revert optimistic update on error
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: prev.mealDetails?.map(m =>
                    m._id === editingMeal._id
                        ? editingMeal
                        : m
                ) || []
            }));
            toast.error(error?.message || "Failed to update meal");
        } finally {
            setIsUpdatingMeal(false);
        }
    };

    // Function to delete meal from database and update UI
    const handleMealDelete = async (deletedMealId, deletedMealData) => {
        setOpenMenuId(null);
        setDeletingMealId(deletedMealId);

        try {
            // Optimistic update
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: prev.mealDetails?.filter(meal => meal._id !== deletedMealId) || []
            }));

            const mealReduction = deletedMealData.mealTime === "both" ? 2 : 1;
            setLocalTotalMeal(prev => ({
                ...prev,
                grandTotalMeal: (prev.grandTotalMeal || 0) - mealReduction
            }));

            toast.success("Meal deleted successfully!");

            await dispatch(deleteMealById(deletedMealId)).unwrap();

            dispatch(fetchProfile());
            dispatch(fetchTotalMeals());
            dispatch(fetchAllMeals());

        } catch (error) {
            console.error("Error deleting meal:", error);
            // Revert optimistic update on error
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: [...(prev.mealDetails || []), deletedMealData]
            }));
            setLocalTotalMeal(prev => ({
                ...prev,
                grandTotalMeal: (prev.grandTotalMeal || 0) + (deletedMealData.mealTime === "both" ? 2 : 1)
            }));
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
            // Optimistic update
            setLocalProfile(prev => ({
                ...prev,
                marketDetails: prev.marketDetails?.filter(market => market._id !== deletedMarketId) || [],
                totalAmount: (prev.totalAmount || 0) - deletedMarketAmount
            }));

            setLocalGrandTotal(prev => prev - deletedMarketAmount);

            toast.success("Market item deleted successfully!");

            await dispatch(deleteMarketById(deletedMarketId)).unwrap();

            dispatch(fetchProfile());
            dispatch(fetchGrandTotalAmount());

        } catch (error) {
            console.error("Error deleting market item:", error);
            // Revert optimistic update on error
            setLocalProfile(prev => ({
                ...prev,
                marketDetails: [...(prev.marketDetails || []), { _id: deletedMarketId, amount: deletedMarketAmount }],
                totalAmount: (prev.totalAmount || 0) + deletedMarketAmount
            }));
            setLocalGrandTotal(prev => prev + deletedMarketAmount);
            toast.error(error?.message || "Failed to delete market item. Please try again!");
        } finally {
            setDeletingMarketId(null);
        }
    };

    if (loading || marketLoading)
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black to-blue-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
                    <p className="text-gray-300 text-lg font-medium">Loading...</p>
                </div>
            </div>
        );

    if (error || marketError)
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-blue-950 flex items-center justify-center">
                <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/30 backdrop-blur-2xl shadow-2xl">
                    <p className="text-red-400 text-lg">Error: {error || marketError}</p>
                </div>
            </div>
        );

    return (
        <div className="font-inter flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 min-h-screen">
            {/* Sidebar */}
            <div className="sidebar w-full lg:w-80 m-1 rounded-2xl bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl">
                <SideBar />
            </div>

            {/* Main Content */}
            <div className="flex-grow m-1 p-4 space-y-6">
                {/* Profile Header */}
                <div className="bg-white/5 p-6 rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        {localProfile?.image ? (
                            <img
                                src={localProfile.image}
                                alt={localProfile.name || "User Profile"}
                                className="w-16 h-16 rounded-2xl object-cover border border-white/30 backdrop-blur-lg shadow-lg"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        ) : (
                            <HiUserCircle className="w-16 h-16 text-teal-400/80" />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
                                {localProfile?.name || "User"}
                            </h1>
                            <p className="flex items-center gap-2 text-teal-300">
                                <span
                                    className={
                                        localProfile?.role === "admin"
                                            ? "text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full backdrop-blur-lg border border-purple-500/30"
                                            : "text-yellow-300 bg-teal-500/20 px-3 py-1 rounded-full backdrop-blur-lg border border-teal-500/30"
                                    }
                                >
                                    {localProfile?.role || "user"}
                                </span>
                                <span className="text-white/60">•</span>
                                <span className="text-sm text-white/80">{localProfile?.email || "No email"}</span>
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
                            bg: "bg-blue-500/10"
                        },
                        {
                            icon: <PiBowlSteamFill className="w-6 h-6" />,
                            title: "Total Meal",
                            value: localTotalMeal?.grandTotalMeal || 0,
                            bg: "bg-purple-500/10"
                        },
                        {
                            icon: <HiShoppingCart className="w-6 h-6" />,
                            title: "Meal Charge",
                            value: `₹${mealCharge}`,
                            bg: "bg-teal-500/10"
                        },
                        {
                            icon: <HiCurrencyRupee className="w-6 h-6" />,
                            title: "Payment",
                            value: localProfile?.payment || "pending",
                            status:
                                localProfile?.payment === "success"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-orange-500/10 text-orange-400"
                        },
                        {
                            icon: <HiFire className="w-6 h-6" />,
                            title: "Gas Bill",
                            value: localProfile?.gasBill || "pending",
                            status:
                                localProfile?.gasBill === "success"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-orange-500/10 text-orange-400"
                        }
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className={`${stat.bg || stat.status} p-4 rounded-2xl border border-white/20 backdrop-blur-2xl shadow-2xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden group`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-lg border border-white/20">{stat.icon}</div>
                                <div>
                                    <p className="text-sm text-white/70">{stat.title}</p>
                                    <p className="text-xl font-semibold text-white">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Market Details Section */}
                {localProfile?.marketDetails?.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <HiShoppingCart className="w-6 h-6 text-teal-400" />
                                <h2 className="text-xl font-semibold text-white">Your Market :</h2>
                                <span className="ml-2 font-semibold text-teal-400">{localProfile.totalAmount || 0} ₹</span>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-white/20 backdrop-blur-lg">
                                <table className="w-full">
                                    <thead className="bg-white/10 backdrop-blur-lg">
                                        <tr>
                                            {["Item", "Amount", "Date", "Day", "Action"].map((header, idx) => (
                                                <th
                                                    key={idx}
                                                    className="px-4 py-3 text-left text-sm font-semibold text-teal-300 border-b border-white/10"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/5">
                                        {localProfile.marketDetails.map((market) => (
                                            <MarketRow
                                                key={market._id}
                                                market={market}
                                                getWeekday={getWeekday}
                                                onMarketDelete={handleMarketDelete}
                                                onMarketEdit={handleMarketEdit}
                                                openMenuId={openMenuId}
                                                setOpenMenuId={setOpenMenuId}
                                                isDeleting={deletingMarketId === market._id}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Meal Details Section */}
                {localProfile?.mealDetails?.length > 0 && (
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <PiBowlSteamFill className="w-6 h-6 text-yellow-300" />
                                <h2 className="text-xl font-semibold text-white">Your Meal :</h2>
                                <span className="ml-2 font-semibold text-yellow-300">{mealCount} 🍽️</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {localProfile.mealDetails.map((meal) => (
                                    <MealCard
                                        key={meal._id}
                                        meal={meal}
                                        getWeekday={getWeekday}
                                        onMealDelete={handleMealDelete}
                                        openMenuId={openMenuId}
                                        onMealEdit={handleMealEdit}
                                        setOpenMenuId={setOpenMenuId}
                                        isDeleting={deletingMealId === meal._id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <Toaster position="top-center" reverseOrder={false} />
            </div>

            {/* Edit Market Modal */}
            {isEditModalOpen && editingMarket && (
                <EditMarketModal
                    market={editingMarket}
                    onClose={handleCloseEditModal}
                    onUpdate={handleMarketUpdate}
                    isUpdating={isUpdating}
                />
            )}

            {/* Edit Meal Modal */}
            {isEditMealModalOpen && editingMeal && (
                <EditMealModal
                    meal={editingMeal}
                    onClose={handleCloseMealEditModal}
                    onUpdate={handleMealUpdate}
                    isUpdating={isUpdatingMeal}
                />
            )}

        </div>
    );
};

// Helper function to format date
const formatDate = (date) => {
    if (!date) return "Invalid Date";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Helper function to convert date to YYYY-MM-DD for input
const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Edit Market Modal Component
const EditMarketModal = ({ market, onClose, onUpdate, isUpdating }) => {
    const items_OPTIONS = ["Chicken", "Fish", "Beef", "Egg", "Veg", "Grocery"];
    const [formData, setFormData] = useState({
        items: market?.items || "",
        amount: market?.amount || "",
        date: formatDateForInput(market?.date) || ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.items.trim()) newErrors.items = "Item name is required";
        if (!formData.amount) newErrors.amount = "Amount is required";
        else if (parseFloat(formData.amount) <= 0)
            newErrors.amount = "Amount must be greater than 0";
        if (!formData.date) newErrors.date = "Date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onUpdate({
                items: formData.items.trim(),
                amount: parseFloat(formData.amount),
                date: new Date(formData.date).toISOString()
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
            <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300">

                {/* Top subtle glow border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white/90 tracking-tight">
                        Edit Market Item
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isUpdating}
                        className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-50"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Item Name */}
                    <div>
                        <label htmlFor="items" className="block text-sm font-medium text-white/70 mb-2">
                            Item Name
                        </label>
                        <div className="relative">
                            <select
                                id="items"
                                name="items"
                                value={formData.items}
                                onChange={handleChange}
                                disabled={isUpdating}
                                className={`w-full px-4 py-3 rounded-2xl bg-white/10 border ${errors.items ? 'border-red-400' : 'border-white/20'
                                    } text-white focus:outline-none focus:ring-0.5 focus:ring-teal-300 focus:border-teal-300
                backdrop-blur-xl appearance-none transition-all duration-200 disabled:opacity-50 [color-scheme:dark]`}
                            >
                                <option value="" className="bg-gray-900 text-gray-300">Select an item</option>
                                {items_OPTIONS.map((item) => (
                                    <option key={item} value={item} className="bg-gray-900 text-gray-200">
                                        {item}
                                    </option>
                                ))}
                            </select>

                            {/* iOS-style dropdown icon */}
                            <svg
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                        {errors.items && <p className="mt-1 text-sm text-red-400">{errors.items}</p>}
                    </div>

                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-white/70 mb-2">
                            Amount (₹)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            disabled={isUpdating}
                            step="0.01"
                            min="0"
                            placeholder="Enter amount"
                            className={`w-full px-4 py-3 bg-white/10 border ${errors.amount ? 'border-red-400' : 'border-white/20'
                                } rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-0.5 
              focus:ring-teal-300 focus:border-teal-300 transition-all duration-200 
              backdrop-blur-xl disabled:opacity-50`}
                        />
                        {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-white/70 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            disabled={isUpdating}
                            className={`w-full px-4 py-3 bg-white/10 border ${errors.date ? 'border-red-400' : 'border-white/20'
                                } rounded-2xl text-white focus:outline-none focus:ring-0.5 
              focus:ring-teal-300 focus:border-teal-300 transition-all duration-200 
              backdrop-blur-xl disabled:opacity-50`}
                        />
                        {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUpdating}
                            className="flex-1 px-4 py-3 rounded-2xl font-medium text-white/90 bg-white/10 border border-white/20
              hover:bg-white/20 transition-all duration-300 disabled:opacity-50 shadow-inner backdrop-blur-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 px-4 py-3 rounded-2xl font-medium text-black bg-gradient-to-r from-white to-gray-400 
              hover:from-gray-400 hover:to-white shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Market"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Edit Meal Modal Component
const EditMealModal = ({ meal, onClose, onUpdate, isUpdating }) => {
    const mealTimeOptions = ["night", "day", "both"];
    const [formData, setFormData] = useState({
        mealTime: meal?.mealTime || "",
        date: formatDateForInput(meal?.date) || ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.mealTime.trim()) newErrors.mealTime = "Meal time is required";
        if (!formData.date) newErrors.date = "Date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onUpdate({
                mealTime: formData.mealTime.trim(),
                date: new Date(formData.date).toISOString()
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
            <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300">

                {/* Top subtle glow border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white/90 tracking-tight">
                        Edit Meal
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isUpdating}
                        className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-50"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Meal Time */}
                    <div>
                        <label htmlFor="mealTime" className="block text-sm font-medium text-white/70 mb-2">
                            Meal Time
                        </label>
                        <div className="relative">
                            <select
                                id="mealTime"
                                name="mealTime"
                                value={formData.mealTime}
                                onChange={handleChange}
                                disabled={isUpdating}
                                className={`w-full px-4 py-3 rounded-2xl bg-white/10 border ${errors.mealTime ? 'border-red-400' : 'border-white/20'
                                    } text-white focus:outline-none focus:ring-0.5 focus:ring-teal-300 focus:border-teal-300
                backdrop-blur-xl appearance-none transition-all duration-200 disabled:opacity-50 [color-scheme:dark]`}
                            >
                                <option value="" className="bg-gray-900 text-gray-300">Select meal time</option>
                                {mealTimeOptions.map((time) => (
                                    <option key={time} value={time} className="bg-gray-900 text-gray-200">
                                        {time.charAt(0).toUpperCase() + time.slice(1)}
                                    </option>
                                ))}
                            </select>

                            {/* iOS-style dropdown icon */}
                            <svg
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                            </svg>
                        </div>
                        {errors.mealTime && <p className="mt-1 text-sm text-red-400">{errors.mealTime}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-white/70 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            disabled={isUpdating}
                            className={`w-full px-4 py-3 bg-white/10 border ${errors.date ? 'border-red-400' : 'border-white/20'
                                } rounded-2xl text-white focus:outline-none focus:ring-0.5 
              focus:ring-teal-300 focus:border-teal-300 transition-all duration-200 
              backdrop-blur-xl disabled:opacity-50`}
                        />
                        {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUpdating}
                            className="flex-1 px-4 py-3 rounded-2xl font-medium text-white/90 bg-white/10 border border-white/20
              hover:bg-white/20 transition-all duration-300 disabled:opacity-50 shadow-inner backdrop-blur-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 px-4 py-3 rounded-2xl font-medium text-black bg-gradient-to-r from-white to-gray-400 
              hover:from-gray-400 hover:to-white shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Meal"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// MarketRow Component for individual market items
const MarketRow = ({ market, getWeekday, onMarketDelete, onMarketEdit, openMenuId, setOpenMenuId, isDeleting }) => {
    const menuRef = useRef(null);

    const isMenuOpen = openMenuId === `market-${market._id}`;

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
        onMarketEdit(market);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${market.items}"?`)) {
            await onMarketDelete(market._id, market.amount);
        }
    };

    return (
        <tr className={`hover:bg-white/10 transition-colors duration-200 border-b border-white/10 last:border-b-0 ${isDeleting ? 'opacity-50' : ''}`}>
            <td className="px-4 py-3 font-medium text-white/90">{market.items}</td>
            <td className="px-4 py-3 text-lime-300 font-semibold">₹{market.amount}</td>
            <td className="px-4 py-3 flex items-center gap-2 text-white/80">
                <HiCalendar className="w-4 h-4 text-teal-400" />
                {formatDate(market.date)}
            </td>
            <td className="px-4 py-3 text-white/70">
                {getWeekday(market.date)}
            </td>
            <td className="px-4 py-3">
                <div className="relative" ref={menuRef}>
                    {isDeleting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-500"></div>
                    ) : (
                        <>
                            <HiOutlineCog
                                className={`w-5 h-5 cursor-pointer transition-all duration-200 ${isMenuOpen ? 'text-teal-400 rotate-90' : 'text-white/70 hover:text-teal-400'
                                    }`}
                                onClick={toggleMenu}
                            />
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 animate-fadeIn overflow-hidden">
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left transition-colors duration-200 border-b border-white/10"
                                    >
                                        <HiPencilAlt className="w-4 h-4 text-blue-400" /> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full text-left text-red-400 transition-colors duration-200"
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
const MealCard = ({ meal, getWeekday, onMealDelete, onMealEdit, openMenuId, setOpenMenuId, isDeleting }) => {
    const menuRef = useRef(null);

    const isMenuOpen = openMenuId === `meal-${meal._id}`;

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
        onMealEdit(meal);
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete this ${meal.mealTime} meal?`)) {
            await onMealDelete(meal._id, meal);
        }
    };

    return (
        <div className={`relative bg-white/5 rounded-2xl border border-white/20 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 group ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>

            <div className="relative p-4 z-10">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                        <HiClock className="w-5 h-5 text-teal-400" />
                        <span className="font-medium capitalize text-white/90">{meal.mealTime}</span>
                    </div>

                    <div className="relative" ref={menuRef}>
                        {isDeleting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-500"></div>
                        ) : (
                            <>
                                <HiDotsVertical
                                    className={`w-5 h-5 cursor-pointer transition-all duration-200 ${isMenuOpen ? 'text-teal-400' : 'text-white/70 hover:text-teal-400'
                                        }`}
                                    onClick={toggleMenu}
                                />

                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-32 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 animate-fadeIn">
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full rounded-t-2xl text-left transition-colors duration-200 border-b border-white/10"
                                        >
                                            <HiPencilAlt className="w-4 h-4 text-blue-400" /> Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 w-full rounded-b-2xl text-left text-red-400 transition-colors duration-200"
                                        >
                                            <HiTrash className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-white/70">
                    <div className="flex items-center gap-3">
                        <HiCalendar className="w-4 h-4 text-teal-400" />
                        <span>{formatDate(meal.date)}</span>
                        <span className="px-2 py-1 bg-white/10 rounded-full backdrop-blur-lg border border-white/10 text-white/80">
                            {getWeekday(meal.date)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profiles;