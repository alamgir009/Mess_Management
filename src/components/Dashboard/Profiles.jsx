import React, { useEffect, useState } from 'react';
import { SideBar } from './SideBar';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { fetchProfile } from '../../store/slices/userSlice';

const Profiles = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.userData);
    const [mealCount, setMealCount] = useState(0);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    // Calculate meal count in a separate useEffect to avoid updating state during rendering
    useEffect(() => {
        if (profile && profile.mealDetails) {
            let count = 0;
            profile.mealDetails.forEach((meal) => {
                if (meal.mealTime === 'day' || meal.mealTime === 'night') {
                    count += 1;
                } else if (meal.mealTime === 'both') {
                    count += 2;
                }
            });
            setMealCount(count);
        }
    }, [profile]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen">
            <div className="sidebar w-screen m-1 rounded-md text-white lg:w-80 bg-gray-950">
                <SideBar />
            </div>

            <div className="flex-grow border rounded-md border-gray-500 m-1 p-4">
                <h1 className="text-center text-xl sm:text-2xl w-full mb-4">
                    Profile /{' '}
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
                                <h2 className="text-lg font-semibold">Market Details: ({profile.marketDetails.length})</h2>
                                <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg">
                                    <thead>
                                        <tr className="bg-teal-500 text-left">
                                            <th className="py-2 px-6">Item</th>
                                            <th className="py-2 px-6">Amount</th>
                                            <th className="py-2 px-6">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profile.marketDetails.map((market, index) => (
                                            <tr
                                                key={market._id}
                                                className={`${index % 2 === 0 ? 'bg-teal-400/10' : 'bg-gray-700'
                                                    } hover:bg-gray-600 transition-colors duration-200`}
                                            >
                                                <td className="py-2 px-6">{market.items}</td>
                                                <td className="py-2 px-6">{market.amount}</td>
                                                <td className="py-2 px-6">
                                                    {new Date(market.date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm">No market details available.</p>
                        )}

                        {/* Meal Details */}
                        {profile.mealDetails && profile.mealDetails.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Meal Details: ({mealCount})</h2>
                                <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg">
                                    <thead>
                                        <tr className="bg-teal-500 text-left">
                                            <th className="py-2 px-6">Meal Time</th>
                                            <th className="py-2 px-6">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profile.mealDetails.map((meal, index) => (
                                            <tr
                                                key={meal._id}
                                                className={`${index % 2 === 0 ? 'bg-teal-400/10' : 'bg-gray-700'
                                                    } hover:bg-gray-600 transition-colors duration-200`}
                                            >
                                                <td className="py-2 px-6">{meal.mealTime}</td>
                                                <td className="py-2 px-6">
                                                    {new Date(meal.date).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
        {label}: <span className="font-normal">{value || 'N/A'}</span>
    </h2>
);

export default Profiles;
