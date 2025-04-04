"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { getMe, updateUser } from "@/utils/apiUser";
import { toast } from "react-toastify";

// Interface for user profile
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

const UserSettingsPage: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const email = useAuthStore((state) => state.email);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data: UserProfile = await getMe(accessToken);
          setUserProfile(data);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Unable to load user information.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [isLoggedIn, accessToken]);

  const handleUpdate = async () => {
    if (!userProfile || !accessToken) return;
    setIsUpdating(true);
    try {
      await updateUser(email!, userProfile, accessToken); // Update user profile via API
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    router.replace("/account/settings");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <LoadingSpinner />
        <p className="mt-2 text-gray-600">Chargement des informations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BaseHeader />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl space-y-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Modifier mes informations
          </h2>
          {userProfile && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={userProfile.firstName}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      firstName: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={userProfile.lastName}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, lastName: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={userProfile.phoneNumber}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-between space-x-4 pt-4">
                <CustomButton
                  type="button"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </CustomButton>
                <CustomButton
                  type="button"
                  onClick={handleCancel}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </CustomButton>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserSettingsPage;
