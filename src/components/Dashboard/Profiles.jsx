import React, { useEffect, useMemo } from "react";
import { SideBar } from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { fetchProfile } from "../../store/slices/userSlice";

const Profiles = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.userData);

    const mealCount = useMemo(() => {
        return profile?.mealDetails?.reduce((count, meal) => count + (meal.mealTime === "both" ? 2 : 1), 0) || 0;
    }, [profile?.mealDetails]);

    const marketCount = useMemo(() => {
        return profile?.marketDetails?.reduce((count, market) => count + (market.amount >= 1 ? market.amount : 0), 0) || 0;
    }, [profile?.marketDetails]);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const getWeekday = (date) => new Date(date).toLocaleString("default", { weekday: "long" });

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="font-inter flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 min-h-screen">
            <div className="sidebar w-full lg:w-80 m-1 rounded-md bg-gray-950">
                <SideBar />
            </div>
            <div className="flex-grow border rounded-md border-gray-500 m-1 p-4">
                <h1 className="text-xl sm:text-2xl mb-4">
                    {profile ? (
                        <h2 className="text-lg font-semibold text-gray-400">
                            Profile:
                            <span className="text-teal-400 capitalize"> {profile.name} </span>
                            <span className="text-sky-500 capitalize">( {profile.role} )</span>
                        </h2>
                    ) : (
                        <p>No profile data available.</p>
                    )}
                </h1>
                <ul className="flex flex-col sm:flex-row gap-4 justify-center items-center text-center">
                    <li className="bg-gray-500 bg-opacity-10 backdrop-blur-md border border-teal-600 p-4 rounded-lg shadow-lg flex-1 m-1">
                        <p className="text-blue-400 text-2xl">{marketCount}</p> Total Market
                    </li>
                    <li className="bg-gray-500 bg-opacity-10 backdrop-blur-md border border-teal-600 p-4 rounded-lg shadow-lg flex-1 m-1">
                        <p className="text-blue-400 text-2xl">{mealCount}</p> Total Meal
                    </li>
                    <li className="bg-gray-500 bg-opacity-10 backdrop-blur-md border border-teal-600 p-4 rounded-lg shadow-lg flex-1 m-1">
                        <p className="text-blue-400 text-2xl">44</p> Meal Charge
                    </li>
                    <li className="bg-gray-500 bg-opacity-10 backdrop-blur-md border border-teal-600 p-4 rounded-lg shadow-lg flex-1 m-1">
                        <p className={`text-2xl ${profile?.payment === "success" ? "text-green-400" : "text-orange-400"}`}>{profile?.payment}</p> Payment
                    </li>
                </ul>

                {profile && (
                    <div className="space-y-4">
                        {profile.marketDetails?.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-400">
                                    Market Details: ( <span className="text-sky-400">{profile.marketDetails.length}</span> )
                                </h2>
                                <h2 className="text-lg font-semibold text-gray-400">
                                    Market Amount: ( <span className="text-sky-400">{marketCount}</span> )
                                </h2>
                                <div className="max-h-64 overflow-y-auto rounded-lg shadow-lg border border-gray-700">
                                    <table className="min-w-full bg-gray-900 text-white">
                                        <thead className="sticky top-0">
                                            <tr className="bg-teal-700 text-left text-sm">
                                                <th className="py-2 px-4">No.</th>
                                                <th className="py-2 px-4">Item</th>
                                                <th className="py-2 px-4">Amount</th>
                                                <th className="py-2 px-4">Date</th>
                                                <th className="py-2 px-4">Day</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profile.marketDetails.map((market, index) => (
                                                <tr
                                                    key={market._id}
                                                    className={`text-sm ${index % 2 === 0 ? "bg-teal-500/10" : "bg-gray-700"} hover:bg-gray-600 transition-colors duration-200`}
                                                >
                                                    <td className="py-2 px-4">{index + 1}</td>
                                                    <td className="py-2 px-4">{market.items}</td>
                                                    <td className="py-2 px-4">{market.amount}</td>
                                                    <td className="py-2 px-4">{formatDate(market.date)}</td>
                                                    <td className="py-2 px-4">{getWeekday(market.date)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm">No market details available.</p>
                        )}

                        {profile.mealDetails?.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-400">
                                    Meal Details: ( <span className="text-sky-400">{mealCount}</span> )
                                </h2>
                                <div className="max-h-44 overflow-y-auto rounded-lg shadow-lg border border-gray-700">
                                    <table className="min-w-full bg-gray-900 text-white">
                                        <thead className="sticky top-0">
                                            <tr className="bg-teal-700 text-left text-sm">
                                                <th className="py-2 px-4">No.</th>
                                                <th className="py-2 px-4">Meal Time</th>
                                                <th className="py-2 px-4">Date</th>
                                                <th className="py-2 px-4">Day</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profile.mealDetails.map((meal, index) => (
                                                <tr
                                                    key={meal._id}
                                                    className={`text-sm ${index % 2 === 0 ? "bg-teal-500/10" : "bg-gray-700"} hover:bg-gray-600 transition-colors duration-200`}
                                                >
                                                    <td className="py-2 px-4">{index + 1}</td>
                                                    <td className="py-2 px-4">{meal.mealTime}</td>
                                                    <td className="py-2 px-4">{formatDate(meal.date)}</td>
                                                    <td className="py-2 px-4">{getWeekday(meal.date)}</td>
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
                )}
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

// Helper function to format date
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

export default Profiles;
