import React, { useEffect } from 'react';
import { SideBar } from './SideBar';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { fetchProfile } from '../../store/slices/userSlice';

const Profiles = () => {

    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.userData);

    useEffect(() => {
        // Assuming 'fetchProfile' is the correct action to fetch the user profile
        dispatch(fetchProfile());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="flex flex-col lg:flex-row justify-between text-white bg-gradient-to-b from-black to-blue-950 h-screen">
            <div className="sidebar w-screen m-1 rounded-md text-white lg:w-80 bg-gray-950">
                <SideBar />
            </div>
            <div className="flex-grow border rounded-md border-gray-500 m-1 p-4">
                <h1 className="text-center text-xl sm:text-2xl w-full mb-4">Profile</h1>

                {profile ? (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Name: <span className="font-normal">{profile.name}</span></h2>
                        <h2 className="text-lg font-semibold">Email: <span className="font-normal">{profile.email}</span></h2>
                        <h2 className="text-lg font-semibold">Phone: <span className="font-normal">{profile.phone}</span></h2>
                        <h2 className="text-lg font-semibold">Role: <span className="font-normal">{profile.role}</span></h2>
                        <h2 className="text-lg font-semibold">User Status: <span className="font-normal">{profile.userStatus}</span></h2>
                        <h2 className="text-lg font-semibold">Payment Status: <span className="font-normal">{profile.payment}</span></h2>
                        <h2 className="text-lg font-semibold">Gas Bill Status: <span className="font-normal">{profile.gasBill}</span></h2>
                    </div>
                ) : (
                    <p>No profile data available.</p>
                )}
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

export default Profiles;