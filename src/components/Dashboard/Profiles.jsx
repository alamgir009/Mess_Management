import React, { useEffect, useState, useMemo, useCallback } from "react";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchProfile } from "../../store/slices/userSlice";

const Profiles = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.userData);

    // Memoized meal count calculation to avoid recalculating on every render
    const mealCount = useMemo(() => {
        if (profile?.mealDetails) {
            return profile.mealDetails.reduce((count, meal) => {
                if (meal.mealTime === "day" || meal.mealTime === "night") {
                    return count + 1;
                } else if (meal.mealTime === "both") {
                    return count + 2;
                }
                return count;
            }, 0);
        }
        return 0;
    }, [profile?.mealDetails]);

    // useCallback to avoid recreating fetchProfile on every render
    const fetchProfileData = useCallback(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);


    const getWeekday = (date) => {
        return new Date(date).toLocaleString("default", { weekday: "long" });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="font-inter flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen">
            <div className="sidebar w-screen m-1 rounded-md text-white lg:w-80 bg-gray-950">
                <SideBar />
            </div>

            <div className="flex-grow border rounded-md border-gray-500 m-1 p-4">
                <h1 className="text-center text-xl sm:text-2xl w-full mb-4">
                    Profile /{" "}
                    {profile ? (
                        <span className="text-sky-500 capitalize">{profile.role}</span>
                    ) : (
                        <p>No profile data available.</p>
                    )}
                </h1>

                {profile ? (
                    <div className="space-y-4">
                        <h2 className="text-lg text-center bg-teal-500 rounded-sm font-semibold">
                            Hello <span>{profile.name}</span>
                        </h2>

                        {/* Market Details */}
                        {profile.marketDetails && profile.marketDetails.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-400">
                                    Market Details: ( <span className="text-sky-400">{profile.marketDetails.length}</span> )
                                </h2>
                                <div className="max-h-64 overflow-y-auto rounded-lg shadow-lg border border-gray-700">
                                    <table className="min-w-full bg-gray-900 text-white">
                                        <thead>
                                            <tr className="bg-teal-500 text-left text-sm">
                                                <th className="py-2 px-4">Item</th>
                                                <th className="py-2 px-4">Amount</th>
                                                <th className="py-2 px-4">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profile.marketDetails.map((market, index) => (
                                                <tr
                                                    key={market._id}
                                                    className={`text-sm ${index % 2 === 0 ? "bg-teal-400/10" : "bg-gray-700"
                                                        } hover:bg-gray-600 transition-colors duration-200`}
                                                >
                                                    <td className="py-2 px-4">{market.items}</td>
                                                    <td className="py-2 px-4">{market.amount}</td>
                                                    <td className="py-2 px-4">
                                                        {new Date(market.date).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm">No market details available.</p>
                        )}

                        {/* Meal Details */}
                        {profile.mealDetails && profile.mealDetails.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-400">
                                    Meal Details: ( <span className="text-sky-400">{mealCount} </span>)
                                </h2>
                                <div className="max-h-64 overflow-y-auto rounded-lg shadow-lg border border-gray-700">
                                    <table className="min-w-full bg-gray-900 text-white">
                                        <thead>
                                            <tr className="bg-teal-500 text-left text-sm">
                                                <th className="py-2 px-4">Meal Time</th>
                                                <th className="py-2 px-4">Date</th>
                                                <th className="py-2 px-4">Day</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profile.mealDetails.map((meal, index) => (
                                                <tr
                                                    key={meal._id}
                                                    className={`text-sm ${index % 2 === 0 ? "bg-teal-400/10" : "bg-gray-700"
                                                        } hover:bg-gray-600 transition-colors duration-200`}
                                                >
                                                    <td className="py-2 px-4">{meal.mealTime}</td>
                                                    <td className="py-2 px-4">
                                                        {new Date(meal.date).toLocaleDateString()}{" "}
                                                    </td>
                                                    <td className="py-2 px-4">{getWeekday(meal.date)}{" "}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm">No meal details available.</p>
                        )}
                    </div>
                ) : (
                    <p>No profile data available.</p>
                )}
            </div>

            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

// Reusable Profile Detail component
const ProfileDetail = ({ label, value }) => (
    <h2 className="text-lg font-semibold">
        {label}: <span className="font-normal">{value || "N/A"}</span>
    </h2>
);

export default Profiles;
