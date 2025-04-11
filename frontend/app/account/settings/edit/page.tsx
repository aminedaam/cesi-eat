"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { CustomButton } from "@/components/helper-components/CustomButton";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { getMe, updateUser } from "@/utils/apiUser";
import { toast } from "react-toastify";
import { useMe } from "@/hooks/useMe";
import { User } from "@/types/User"; // Assuming User type includes firstName, lastName, email, phoneNumber?
import { useUserStore } from "@/store/userStore";

// Define a specific type for the form data if needed, or use Partial<User>
type UserFormData = Partial<User>;

const UserSettingsPage: React.FC = () => {
      const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
      const accessToken = useAuthStore((state) => state.accessToken);
      const setAccessToken = useAuthStore((state) => state.setAccessToken);
      
  const { setUser } = useUserStore(); // Assuming you have a user store to manage user state
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, loading, error } = useMe(accessToken ?? ""); // Fetch user data using the custom hook

  // State to hold the form data being edited
  const [formData, setFormData] = useState<UserFormData>({});

  // Effect to redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn && !loading) {
      // Added !loading check to prevent redirect while auth state might still be resolving
      router.replace("/login");
    }
  }, [isLoggedIn, loading, router]);

  // Effect to initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      // Initialize form data with fetched user data
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        // Add other fields from User type as needed
      });
    }
  }, [user]); // Re-run this effect if the user object changes

  // Generic input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value, // Use input id to update the correct field in formData
    }));
  };

  const handleUpdate = async () => {
    // Use the original user's email as the identifier, but send merged data as the payload
    if (!user?.email || !accessToken) {
      toast.error("Une erreur est survenue.");
      return;
    }
    setIsUpdating(true);
    try {
      // 1. Create the complete payload
      // Start with all fields from the original user object...
      // ...then overwrite with any fields that were changed in the form (present in formData)
      const payloadData = {
        ...user, // Includes all original fields (id, createdAt, roles, etc., whatever 'user' contains)
        ...formData, // Overwrites firstName, lastName, email, phoneNumber with form values
      };


      const response = await updateUser(user.id!, payloadData, accessToken); // Pass payloadData instead of just formData
      const tokenPart = response.split("token:")[1];
      if (tokenPart) {
        setAccessToken(tokenPart);
      }

      console.log("New token:", response.token);


      toast.success("Le profile a été mis à jour avec succès !");
      const newUser = await getMe(tokenPart); // Fetch updated user data
      setUser(newUser);
      router.push("/account"); // Redirect to settings page after update
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile.";
      toast.error("Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    // Optionally reset form data to original user data or simply navigate away
    // setFormData({ ...initial user data... }); // if staying on the page
    router.back(); // Go back to the previous page, or use replace("/account/settings") if preferred
  };

  if (loading) {
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
        {/* Improved error display */}
        <p className="text-red-600 font-semibold">
          Erreur lors du chargement des informations:
        </p>
        <p className="text-red-500 mt-1">{String(error)}</p>
        <CustomButton
          onClick={() => router.back()} // Or back to settings
          className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50"
        >
          Retour
        </CustomButton>
      </div>
    );
  }

  // Don't render the form until user data is available and user is logged in
  // The redirect effect handles the !isLoggedIn case
  if (!isLoggedIn || !user) {
    // You might show a brief message or just rely on the redirect
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BaseHeader />
      <main className="flex-grow flex flex-col items-center justify-start pt-12 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Changed justify-center to justify-start */}
        <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl space-y-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {" "}
            {/* Adjusted heading style */}
            Modifier mes informations
          </h2>
          {/* Form should only render if user data is loaded */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Nom de famille
              </label>
              <input
                id="firstName" // Ensure ID matches the key in formData
                type="text"
                value={formData.firstName || ""} // Bind to formData state, handle potential undefined
                onChange={handleInputChange} // Use the generic handler
                required // Add required if applicable
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Prénom
              </label>
              <input
                id="lastName" // Ensure ID matches the key in formData
                type="text"
                value={formData.lastName || ""} // Bind to formData state
                onChange={handleInputChange} // Use the generic handler
                required // Add required if applicable
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
                id="email" // Ensure ID matches the key in formData
                type="email"
                value={formData.email || ""} // Bind to formData state
                onChange={handleInputChange} // Use the generic handler
                required // Email is usually required
                // Consider adding 'readOnly' or disabling if email shouldn't be changed
                // readOnly
                // className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed" // Example disabled style
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Numéro de téléphone
              </label>
              <input
                id="phoneNumber" // Ensure ID matches the key in formData
                type="tel"
                value={formData.phoneNumber || ""} // Bind to formData state
                onChange={handleInputChange} // Use the generic handler
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-between space-x-4 pt-4">
              {" "}
              {/* Adjusted flex layout for responsiveness */}
              <CustomButton
                type="button" // Changed from submit as we handle via onClick
                onClick={handleUpdate}
                disabled={isUpdating || loading} // Also disable if initial load is happening? Maybe not necessary.
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50 disabled:opacity-50" // Added disabled style
              >
                {isUpdating ? <LoadingSpinner /> : "Modifier"}{" "}
                {/* Show spinner in button */}
              </CustomButton>
              <CustomButton
                type="button"
                onClick={handleCancel}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Annuler
              </CustomButton>
            </div>
          </form>
        </div>
      </main>
      {/* Optional: Add a BaseFooter component here if you have one */}
      {/* <BaseFooter /> */}
    </div>
  );
};

export default UserSettingsPage;
