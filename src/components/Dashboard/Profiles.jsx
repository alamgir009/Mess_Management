import React, { useEffect, useMemo, useState, useRef } from "react";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { fetchProfile, userUpdate } from "../../store/slices/userSlice";
import { fetchGrandTotalAmount, deleteMarketById, updateMarketById } from "../../store/slices/marketSlice";
import { deleteMealById, fetchAllMeals, fetchTotalMeals, updateMealById } from "../../store/slices/mealSlice";
import {
    HiCurrencyRupee, HiFire, HiShoppingCart, HiUserCircle, HiCalendar,
    HiClock, HiPencilAlt, HiTrash, HiDotsVertical, HiOutlineCog,
    HiX, HiOutlineMail
} from "react-icons/hi";
import { FiEdit, FiX } from "react-icons/fi";
import { PiBowlSteamFill } from "react-icons/pi";
import { MdOutlinePhone, MdOutlineMenu } from "react-icons/md";

const Profiles = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.userData);
    const { grandTotalAmount, marketLoading, marketError } = useSelector((state) => state.marketData);
    const { totalMeal, meal } = useSelector((state) => state.mealData);

    const [localProfile, setLocalProfile] = useState(profile || {});
    const [localGrandTotal, setLocalGrandTotal] = useState(grandTotalAmount || 0);
    const [localTotalMeal, setLocalTotalMeal] = useState(totalMeal || {});
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deletingMealId, setDeletingMealId] = useState(null);
    const [deletingMarketId, setDeletingMarketId] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMarket, setEditingMarket] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditMealModalOpen, setIsEditMealModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);
    const [isUpdatingMeal, setIsUpdatingMeal] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleProfileUpdate = async (updatedData) => {
        setIsUpdatingProfile(true);
        try {
            setLocalProfile(prev => ({ ...prev, ...updatedData }));
            setIsEditProfileModalOpen(false);
            toast.success("Profile updated successfully!");
            await dispatch(userUpdate(updatedData)).unwrap();
            dispatch(fetchProfile());
        } catch (error) {
            setLocalProfile(profile);
            toast.error(error?.message || "Failed to update profile");
            dispatch(fetchProfile());
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    useEffect(() => {
        if (profile) setLocalProfile(profile);
    }, [profile]);

    useEffect(() => {
        if (grandTotalAmount !== undefined) setLocalGrandTotal(grandTotalAmount);
    }, [grandTotalAmount]);

    useEffect(() => {
        if (totalMeal) setLocalTotalMeal(totalMeal);
    }, [totalMeal]);

    const mealCount = useMemo(() => {
        return localProfile?.mealDetails?.reduce((count, meal) => count + (meal.mealTime === "both" ? 2 : 1), 0) || 0;
    }, [localProfile?.mealDetails]);

    const marketCount = useMemo(() => {
        return localProfile?.marketDetails?.reduce((count, market) => count + (market.amount >= 1 ? market.amount : 0), 0) || 0;
    }, [localProfile?.marketDetails]);

    const mealCharge = useMemo(() => {
        if (!localGrandTotal || !localTotalMeal?.grandTotalMeal || localTotalMeal.grandTotalMeal === 0) return 0;
        return (localGrandTotal / localTotalMeal.grandTotalMeal).toFixed(2);
    }, [localGrandTotal, localTotalMeal]);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchGrandTotalAmount());
        dispatch(fetchTotalMeals());
        dispatch(fetchAllMeals());
    }, [dispatch]);

    const getWeekday = (date) => new Date(date).toLocaleString("default", { weekday: "long" });

    const handleMarketEdit = (market) => {
        setOpenMenuId(null);
        setEditingMarket(market);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingMarket(null);
    };

    const handleMarketUpdate = async (updatedData) => {
        setIsUpdating(true);
        try {
            const amountDifference = parseFloat(updatedData.amount) - editingMarket.amount;
            setLocalProfile(prev => ({
                ...prev,
                marketDetails: prev.marketDetails?.map(market =>
                    market._id === editingMarket._id
                        ? { ...market, items: updatedData.items, amount: parseFloat(updatedData.amount), date: updatedData.date }
                        : market
                ) || [],
                totalAmount: (prev.totalAmount || 0) + amountDifference
            }));
            setLocalGrandTotal(prev => prev + amountDifference);
            handleCloseEditModal();
            toast.success("Market item updated successfully!");
            await dispatch(updateMarketById({ id: editingMarket._id, marketData: updatedData })).unwrap();
            dispatch(fetchProfile());
            dispatch(fetchGrandTotalAmount());
        } catch (error) {
            const amountDifference = parseFloat(updatedData.amount) - editingMarket.amount;
            setLocalProfile(prev => ({
                ...prev,
                marketDetails: prev.marketDetails?.map(market => market._id === editingMarket._id ? editingMarket : market) || [],
                totalAmount: (prev.totalAmount || 0) - amountDifference
            }));
            setLocalGrandTotal(prev => prev - amountDifference);
            toast.error(error?.message || "Failed to update market item");
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
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: prev.mealDetails?.map(m => m._id === editingMeal._id ? { ...m, ...updatedData } : m) || []
            }));
            handleCloseMealEditModal();
            toast.success("Meal updated successfully!");
            await dispatch(updateMealById({ id: editingMeal._id, mealData: updatedData })).unwrap();
            dispatch(fetchProfile());
            dispatch(fetchAllMeals());
        } catch (error) {
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: prev.mealDetails?.map(m => m._id === editingMeal._id ? editingMeal : m) || []
            }));
            toast.error(error?.message || "Failed to update meal");
        } finally {
            setIsUpdatingMeal(false);
        }
    };

    const handleMealDelete = async (deletedMealId, deletedMealData) => {
        setOpenMenuId(null);
        setDeletingMealId(deletedMealId);
        try {
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
            setLocalProfile(prev => ({
                ...prev,
                mealDetails: [...(prev.mealDetails || []), deletedMealData]
            }));
            setLocalTotalMeal(prev => ({
                ...prev,
                grandTotalMeal: (prev.grandTotalMeal || 0) + (deletedMealData.mealTime === "both" ? 2 : 1)
            }));
            toast.error(error?.message || "Failed to delete meal");
        } finally {
            setDeletingMealId(null);
        }
    };

    const handleMarketDelete = async (deletedMarketId, deletedMarketAmount) => {
        setOpenMenuId(null);
        setDeletingMarketId(deletedMarketId);
        try {
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
            setLocalProfile(prev => ({
                ...prev,
                marketDetails: [...(prev.marketDetails || []), { _id: deletedMarketId, amount: deletedMarketAmount }],
                totalAmount: (prev.totalAmount || 0) + deletedMarketAmount
            }));
            setLocalGrandTotal(prev => prev + deletedMarketAmount);
            toast.error(error?.message || "Failed to delete market item");
        } finally {
            setDeletingMarketId(null);
        }
    };

    if (loading || marketLoading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-blue-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-400 rounded-full animate-spin"></div>
                    <p className="text-gray-300 text-sm md:text-lg font-medium">Loading...</p>
                </div>
            </div>
        );

    if (error || marketError)
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-blue-950 flex items-center justify-center p-4">
                <div className="bg-red-500/10 p-4 md:p-6 rounded-2xl border border-red-500/30 backdrop-blur-2xl shadow-2xl max-w-md">
                    <p className="text-red-400 text-sm md:text-lg">Error: {error || marketError}</p>
                </div>
            </div>
        );

    return (
        <div className="font-inter flex flex-col lg:flex-row text-white bg-gradient-to-br from-black/80 to-blue-900/50 min-h-screen relative overflow-x-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-64 h-64 md:w-80 md:h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-64 h-64 md:w-80 md:h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="menu-button lg:hidden fixed top-3 left-3 z-50 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg hover:from-white/20 hover:to-white/10 transition-all duration-300"
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
                {isSidebarOpen ? <FiX className="w-5 h-5 md:w-6 md:h-6" /> : <MdOutlineMenu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>

            {/* Sidebar */}
            <div className={`sidebar fixed lg:fixed top-0 left-0 w-full max-w-xs bg-gradient-to-br from-black/80 to-blue-900/50 backdrop-blur-2xl shadow-2xl border-r border-white/10 z-40 h-screen overflow-y-auto transition-all duration-300 transform rounded-lg lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-full custom-scrollbar text-gray-300">
                    <SideBar />
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-grow w-full pt-16 lg:pt-0 lg:ml-80 h-screen lg:h-auto overflow-y-auto">
                <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 max-w-7xl">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6">
                                {/* Profile Image */}
                                {localProfile?.image ? (
                                    <div className="relative group flex-shrink-0">
                                        <img
                                            src={localProfile.image}
                                            alt={localProfile.name}
                                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl object-cover border-2 border-white/30 shadow-lg"
                                            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                                        />
                                        <HiUserCircle className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-teal-400/80 hidden" />
                                    </div>
                                ) : (
                                    <HiUserCircle className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-teal-400/80 flex-shrink-0" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col gap-2 mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent truncate">
                                                {localProfile?.name || "User"}
                                            </h1>
                                            <button
                                                onClick={() => setIsEditProfileModalOpen(true)}
                                                className="flex items-center gap-1 text-white/70 hover:text-teal-400 transition-colors text-xs sm:text-sm"
                                            >
                                                <FiEdit className="w-4 h-4" />
                                                <span>Edit</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm backdrop-blur-lg border ${localProfile?.role === "admin"
                                                ? "text-purple-300 bg-purple-500/20 border-purple-500/30"
                                                : "text-teal-300 bg-teal-500/20 border-teal-500/30"
                                            }`}>
                                            {localProfile?.role || "user"}
                                        </span>
                                        {localProfile?.email && (
                                            <div className="flex items-center gap-1 text-white/70 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10 text-xs sm:text-sm truncate">
                                                <HiOutlineMail size={12} className="text-teal-400 flex-shrink-0" />
                                                <span className="truncate max-w-[120px] sm:max-w-[150px]">{localProfile.email}</span>
                                            </div>
                                        )}
                                        {localProfile?.phone && (
                                            <div className="flex items-center gap-1 text-white/70 bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10 text-xs sm:text-sm">
                                                <MdOutlinePhone size={12} className="text-teal-400 flex-shrink-0" />
                                                <span>{localProfile.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                        {[
                            {
                                icon: <HiCurrencyRupee />,
                                title: "Total Market",
                                value: `₹${localGrandTotal || 0}`,
                                bg: "from-blue-500/10 to-blue-600/10",
                                border: "border-blue-500/20"
                            },
                            {
                                icon: <PiBowlSteamFill />,
                                title: "Total Meal",
                                value: localTotalMeal?.grandTotalMeal || 0,
                                bg: "from-purple-500/10 to-purple-600/10",
                                border: "border-purple-500/20"
                            },
                            {
                                icon: <HiShoppingCart />,
                                title: "Meal Charge",
                                value: `₹${mealCharge}`,
                                bg: "from-teal-500/10 to-teal-600/10",
                                border: "border-teal-500/20"
                            },
                            {
                                icon: <HiCurrencyRupee />,
                                title: "Payment",
                                value: localProfile?.payment || "pending",
                                bg: localProfile?.payment === "success" ? "from-green-500/10 to-green-600/10" : "from-orange-500/10 to-orange-600/10",
                                border: localProfile?.payment === "success" ? "border-green-500/20" : "border-orange-500/20"
                            },
                            {
                                icon: <HiFire />,
                                title: "Gas Bill",
                                value: localProfile?.gasBill || "pending",
                                bg: localProfile?.gasBill === "success" ? "from-green-500/10 to-green-600/10" : "from-orange-500/10 to-orange-600/10",
                                border: localProfile?.gasBill === "success" ? "border-green-500/20" : "border-orange-500/20"
                            }
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className={`bg-gradient-to-br ${stat.bg} p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-2xl border ${stat.border} backdrop-blur-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:scale-105`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-center mb-2 text-lg sm:text-xl md:text-2xl">{stat.icon}</div>
                                    <p className="text-xs text-center text-white/70 truncate">{stat.title}</p>
                                    <p className="text-xs sm:text-sm md:text-base font-semibold text-white text-center truncate mt-1">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Market Details */}
                    {localProfile?.marketDetails?.length > 0 && (
                        <div className="bg-gradient-to-br from-white/10 to-white/5 p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                    <HiShoppingCart className="w-5 h-5 text-teal-400" />
                                </div>
                                <h2 className="lg:text-xl font-bold text-white">Market History</h2>
                            </div>
                            <span className="px-4 py-2 bg-teal-500/10 rounded-full border border-teal-500/20 text-teal-300 font-mono font-semibold">
                                ₹{localProfile.totalAmount || 0}
                            </span>
                        </div>

                                <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-lg sm:rounded-2xl border border-white/20 backdrop-blur-lg custom-scrollbar">
                                    <table className="w-full text-xs sm:text-sm">
                                        <thead className="bg-white/10 backdrop-blur-lg sticky top-0">
                                            <tr>
                                                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left font-semibold text-teal-300 border-b border-white/10 whitespace-nowrap">Item</th>
                                                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left font-semibold text-teal-300 border-b border-white/10 whitespace-nowrap">Amount</th>
                                                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left font-semibold text-teal-300 border-b border-white/10 whitespace-nowrap">Date</th>
                                                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left font-semibold text-teal-300 border-b border-white/10 hidden md:table-cell whitespace-nowrap">Day</th>
                                                <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center font-semibold text-teal-300 border-b border-white/10 whitespace-nowrap">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
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

                    {/* Meal Details */}
                    {localProfile?.mealDetails?.length > 0 && (
                        <div className="bg-gradient-to-br from-white/10 to-white/5 p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden mb-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                    <PiBowlSteamFill className="w-5 h-5 text-yellow-400" />
                                </div>
                                <h2 className="lg:text-xl font-bold text-white">Meal Log</h2>
                            </div>
                            <span className="px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-300 font-bold">
                                {mealCount} <span className="text-xs opacity-70 font-normal ml-1">Meals</span>
                            </span>
                        </div>

                                <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
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
                        </div>
                    )}

                    <Toaster position="top-center" reverseOrder={false} />
                </div>
            </div>

            {/* Modals */}
            {isEditModalOpen && editingMarket && (
                <EditMarketModal market={editingMarket} onClose={handleCloseEditModal} onUpdate={handleMarketUpdate} isUpdating={isUpdating} />
            )}
            {isEditMealModalOpen && editingMeal && (
                <EditMealModal meal={editingMeal} onClose={handleCloseMealEditModal} onUpdate={handleMealUpdate} isUpdating={isUpdatingMeal} />
            )}
            {isEditProfileModalOpen && (
                <EditProfileModal profile={localProfile} onClose={() => setIsEditProfileModalOpen(false)} onUpdate={handleProfileUpdate} isUpdating={isUpdatingProfile} />
            )}
        </div>
    );
};

const formatDate = (date) => {
    if (!date) return "Invalid Date";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Unified Modal Style Component
const ModalWrapper = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4">
        <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-gray-900/95 to-gray-800/95 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            {children}
        </div>
    </div>
);

// Edit Market Modal
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
        else if (parseFloat(formData.amount) <= 0) newErrors.amount = "Amount must be greater than 0";
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
        <ModalWrapper onClose={onClose}>
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 relative z-10">
                <h2 className="text-lg sm:text-xl font-semibold text-white/90">Edit Market Item</h2>
                <button onClick={onClose} disabled={isUpdating} className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50">
                    <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 relative z-10">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Item Name</label>
                    <div className="relative">
                        <select
                            name="items"
                            value={formData.items}
                            onChange={handleChange}
                            disabled={isUpdating}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl bg-gray-800/80 border ${errors.items ? 'border-red-400' : 'border-white/20'} text-white text-sm backdrop-blur-xl transition-all disabled:opacity-50 appearance-none cursor-pointer hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40`}
                        >
                            <option value="" className="bg-gray-800 text-white">Select an item</option>
                            {items_OPTIONS.map((item) => (
                                <option key={item} value={item} className="bg-gray-800 text-white hover:bg-gray-700">
                                    {item}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                    {errors.items && <p className="mt-1 text-xs text-red-400">{errors.items}</p>}
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        disabled={isUpdating}
                        step="0.01"
                        min="0"
                        placeholder="Enter amount"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/80 border ${errors.amount ? 'border-red-400' : 'border-white/20'} rounded-lg sm:rounded-2xl text-white placeholder-white/40 text-sm transition-all disabled:opacity-50 hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40`}
                    />
                    {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={isUpdating}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/80 border ${errors.date ? 'border-red-400' : 'border-white/20'} rounded-lg sm:rounded-2xl text-white text-sm transition-all disabled:opacity-50 hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40`}
                    />
                    {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} disabled={isUpdating} className="flex-1 px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium text-white/90 bg-gray-800/80 border border-white/20 hover:bg-gray-700/80 hover:border-white/40 transition-all disabled:opacity-50 text-sm">
                        Cancel
                    </button>
                    <button type="submit" disabled={isUpdating} className="flex-1 px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                        {isUpdating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Updating...
                            </>
                        ) : (
                            "Update Market"
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

// Edit Meal Modal
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
        <ModalWrapper onClose={onClose}>
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 relative z-10">
                <h2 className="text-lg sm:text-xl font-semibold text-white/90">Edit Meal</h2>
                <button onClick={onClose} disabled={isUpdating} className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50">
                    <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 relative z-10">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Meal Time</label>
                    <div className="relative">
                        <select
                            name="mealTime"
                            value={formData.mealTime}
                            onChange={handleChange}
                            disabled={isUpdating}
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl bg-gray-800/80 border ${errors.mealTime ? 'border-red-400' : 'border-white/20'} text-white text-sm backdrop-blur-xl transition-all disabled:opacity-50 appearance-none cursor-pointer hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40`}
                        >
                            <option value="" className="bg-gray-800 text-white">Select meal time</option>
                            {mealTimeOptions.map((time) => (
                                <option key={time} value={time} className="bg-gray-800 text-white hover:bg-gray-700">
                                    {time.charAt(0).toUpperCase() + time.slice(1)}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                    {errors.mealTime && <p className="mt-1 text-xs text-red-400">{errors.mealTime}</p>}
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={isUpdating}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/80 border ${errors.date ? 'border-red-400' : 'border-white/20'} rounded-lg sm:rounded-2xl text-white text-sm transition-all disabled:opacity-50 hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40 [color-scheme:dark]`}
                    />
                    {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} disabled={isUpdating} className="flex-1 px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium text-white/90 bg-gray-800/80 border border-white/20 hover:bg-gray-700/80 hover:border-white/40 transition-all disabled:opacity-50 text-sm">
                        Cancel
                    </button>
                    <button type="submit" disabled={isUpdating} className="flex-1 px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                        {isUpdating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Updating...
                            </>
                        ) : (
                            "Update Meal"
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

// Edit Profile Modal
const EditProfileModal = ({ profile, onClose, onUpdate, isUpdating }) => {
    const [formData, setFormData] = useState({
        name: profile?.name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        image: profile?.image || ""
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
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) onUpdate(formData);
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 relative z-10">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                    {formData.image ? (
                        <img src={formData.image} alt="Profile" className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg object-cover border border-white/20" onError={(e) => (e.currentTarget.style.display = "none")} />
                    ) : (
                        <HiUserCircle className="text-teal-400 text-2xl sm:text-3xl" />
                    )}
                    <span>Edit Profile</span>
                </h2>
                <button onClick={onClose} disabled={isUpdating} className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50">
                    <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 relative z-10">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isUpdating}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/80 border ${errors.name ? 'border-red-400' : 'border-white/20'} rounded-lg sm:rounded-2xl text-white text-sm transition-all disabled:opacity-50 hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isUpdating}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/80 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-lg sm:rounded-2xl text-white text-sm transition-all disabled:opacity-50 hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isUpdating}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/80 border border-white/20 rounded-lg sm:rounded-2xl text-white text-sm transition-all disabled:opacity-50 hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40"
                    />
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        disabled={isUpdating}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/80 border border-white/20 rounded-lg sm:rounded-2xl text-white text-sm transition-all disabled:opacity-50 hover:bg-gray-700/80 focus:bg-gray-700/80 focus:border-white/40"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} disabled={isUpdating} className="flex-1 px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium text-white/90 bg-gray-800/80 border border-white/20 hover:bg-gray-700/80 hover:border-white/40 transition-all disabled:opacity-50 text-sm">
                        Cancel
                    </button>
                    <button type="submit" disabled={isUpdating} className="flex-1 px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                        {isUpdating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Updating...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

// Market Row Component
// Market Row Component
const MarketRow = ({ market, getWeekday, onMarketDelete, onMarketEdit, openMenuId, setOpenMenuId, isDeleting }) => {
    const menuRef = useRef(null);
    const isMenuOpen = openMenuId === `market-${market._id}`;
    const [shouldOpenUp, setShouldOpenUp] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
        };
        if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen, setOpenMenuId]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        if (!isDeleting) {
            if (!isMenuOpen) {
                // Calculate if menu should open upward
                const menuButton = e.currentTarget;
                const rect = menuButton.getBoundingClientRect();
                const scrollContainer = menuButton.closest('.overflow-y-auto');
                
                if (scrollContainer) {
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const spaceBelow = containerRect.bottom - rect.bottom;
                    setShouldOpenUp(spaceBelow < 150); // Adjust threshold as needed
                }
            }
            setOpenMenuId(isMenuOpen ? null : `market-${market._id}`);
        }
    };

    return (
        <tr className={`hover:bg-white/20 transition-colors text-xs sm:text-sm ${isDeleting ? 'opacity-50' : ''}`}>
            <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-white/90 truncate">{market.items}</td>
            <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-lime-300 font-semibold whitespace-nowrap">₹{market.amount}</td>
            <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-white/80 whitespace-nowrap">
                <div className="flex items-center gap-1">
                    <HiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{formatDate(market.date)}</span>
                </div>
            </td>
            <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-white/70 hidden md:table-cell whitespace-nowrap">{getWeekday(market.date)}</td>
            <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center">
                <div className="relative inline-block" ref={menuRef}>
                    {isDeleting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-500"></div>
                    ) : (
                        <>
                            <button
                                onClick={toggleMenu}
                                className={`w-8 h-8 flex items-center justify-center transition-all duration-300
    ${isMenuOpen
                                        ? 'text-teal-400 bg-white/10 rounded-xl'
                                        : 'text-white/70 hover:text-teal-400 rounded-md'
                                    }`}
                            >
                                <HiOutlineCog
                                    className={`w-5 h-5 transition-transform duration-300
      ${isMenuOpen ? 'rotate-45' : 'rotate-0'}
    `}
                                />
                            </button>

                            {isMenuOpen && (
                                <div className={`absolute w-28 sm:w-32 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden transition-all
                                    ${shouldOpenUp 
                                        ? 'bottom-full mb-2 right-0' 
                                        : 'top-full mt-2 right-0'
                                    }`}>
                                    <button onClick={() => onMarketEdit(market)} className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm hover:bg-white/10 w-full text-left border-b border-white/10">
                                        <HiPencilAlt className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" /> Edit
                                    </button>
                                    <button onClick={() => onMarketDelete(market._id, market.amount) && window.confirm(`Delete "${market.items}"?`)} className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm hover:bg-white/10 w-full text-left text-red-400">
                                        <HiTrash className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
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

// Meal Card Component
const MealCard = ({ meal, getWeekday, onMealDelete, onMealEdit, openMenuId, setOpenMenuId, isDeleting }) => {
    const menuRef = useRef(null);
    const isMenuOpen = openMenuId === `meal-${meal._id}`;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
        };
        if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen, setOpenMenuId]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        if (!isDeleting) setOpenMenuId(isMenuOpen ? null : `meal-${meal._id}`);
    };

    return (
        <div className={`relative bg-white/5 rounded-lg sm:rounded-2xl border border-white/20 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 group ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="absolute inset-0 rounded-lg sm:rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>

            <div className="relative p-3 sm:p-4 z-10">
                <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <HiClock className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                        <span className="font-medium capitalize text-white/90 text-xs sm:text-sm truncate">{meal.mealTime}</span>
                    </div>

                    <div className="relative" ref={menuRef}>
                        {isDeleting ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-teal-500"></div>
                        ) : (
                            <>
                                <button onClick={toggleMenu} className={`w-5 h-5 flex items-center justify-center rounded transition-all ${isMenuOpen ? 'text-teal-400 bg-white/10' : 'text-white/70 hover:text-teal-400'}`}>
                                    <HiDotsVertical className="w-4 h-4" />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-28 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-lg shadow-2xl z-50">
                                        <button onClick={() => onMealEdit(meal)} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/10 w-full text-left border-b border-white/10">
                                            <HiPencilAlt className="w-3 h-3 text-blue-400" /> Edit
                                        </button>
                                        <button onClick={() => onMealDelete(meal._id, meal) && window.confirm(`Delete ${meal.mealTime} meal?`)} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/10 w-full text-left text-red-400">
                                            <HiTrash className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-xs text-white/70">
                    <div className="flex items-center gap-2 min-w-0">
                        <HiCalendar className="w-3 h-3 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{formatDate(meal.date)}</span>
                    </div>
                    <span className="px-2 py-1 bg-white/10 rounded-full text-white/80 text-xs w-fit">{getWeekday(meal.date).slice(0, 3)}</span>
                </div>
            </div>
        </div>
    );
};

export default Profiles;