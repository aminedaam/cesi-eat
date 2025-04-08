"use client";
import { useFormik } from "formik";
import { z } from "zod";
import BaseHeader from "../../components/header_footers/BaseHeader";
import Image from "next/image";
import Input from "@/components/helper-components/Input";
import useCoordinates from "@/hooks/useCoordinates";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { CustomButton } from "@/components/helper-components/CustomButton";
import Link from "next/link";
import { register } from "@/utils/apiUser";
import { toast } from "react-toastify";

// Zod schema for validation
const signupSchema = z.object({
  firstName: z.string().min(1, "Veuillez renseigner ce champ"),
  lastName: z.string().min(1, "Veuillez renseigner ce champ"),
  email: z
    .string()
    .email("Email invalide")
    .min(1, " Veuillez renseigner ce champ"),
  phoneNumber: z.string().min(1, "Veuillez renseigner ce champ"),
  address: z.string().min(1, "Veuillez renseigner ce champ"),
  postalCode: z.string().min(1, "Veuillez renseigner ce champ"),
  city: z.string().min(1, "Veuillez renseigner ce champ"),
  country: z.string().min(1, "Veuillez renseigner ce champ"),
  password: z.string().min(1, "Veuillez renseigner ce champ"),
  role: z.enum(["CLIENT", "RESTAURATEUR", "LIVREUR"], {
    errorMap: () => ({ message: "Veuillez sélectionner un rôle valide" }),
  }),
});

// Validation function for Formik using Zod
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateZodSchema = (values: any) => {
  try {
    signupSchema.parse(values);
    return {}; // No errors
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Flatten Zod errors into a format Formik understands
      return error.flatten().fieldErrors;
    }
    console.error("Erreur de validation inattendue:", error);
    return { _error: "Une erreur de validation inattendue est survenue." }; // Generic error
  }
};

// Infer the type from the Zod schema
type SignupFormValues = z.infer<typeof signupSchema>;

// Signup Page Component
const SignupPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  // Scroll to top if a general submission error occurs
  useEffect(() => {
    // Utilisez window.scrollTo directement
    if (submitError && typeof window !== "undefined") {
      // scrollToTop({ x: 0, y: 0 }); // <- Supprimez cette ligne
      window.scrollTo({ top: 0, behavior: "smooth" }); // <- Ajoutez cette ligne
    }
    // Pas besoin d'inclure scrollToTop dans les dépendances
  }, [submitError]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn, router]);

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      postalCode: "",
      city: "",
      country: "",
      password: "",
      role: "CLIENT", // Default role
    },
    validate: validateZodSchema,
    onSubmit: async (values) => {
      // Prevent submission if coordinates are still loading
      if (isLoadingCoordinates) {
        setSubmitError("Récupération des coordonnées en cours...");
        return;
      }
      // Prevent submission if there was an error getting coordinates
      if (coordinatesError) {
        console.error("Erreur de coordonnées:", coordinatesError);
        setSubmitError(
          `Impossible de récupérer les coordonnées pour cette adresse (${coordinatesError}). Veuillez vérifier l'adresse.`
        );
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        // Prepare payload for registration
        const userPayload = {
          ...values,
          ...(coordinates?.latitude != null &&
            coordinates?.longitude != null && {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }),
          createdAt: new Date(),
        };
        const registerResponse = await register(userPayload);
        if (registerResponse.status == 201) {
          toast.success("Inscription réussie !");
          await login(userPayload.email, userPayload.password);
        }

        formik.resetForm();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Échec de la soumission:", error);
        // Provide more specific error feedback if possible
        setSubmitError(
          `Échec de la création de l'utilisateur: ${
            error.message || "Erreur inconnue"
          }`
        );
      } finally {
        setIsSubmitting(false); // Re-enable submit button
      }
    },
  });

  // Fetch coordinates based on address fields using the custom hook
  const {
    coordinates,
    error: coordinatesError,
    isLoading: isLoadingCoordinates,
  } = useCoordinates(
    formik.values.address,
    formik.values.postalCode,
    formik.values.country
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BaseHeader />
      <main className="flex-grow flex flex-col items-center mt-16 justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white p-8 shadow-lg rounded-xl space-y-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>

          {/* Display general submission errors */}
          {submitError && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md w-full text-center text-sm">
              {submitError}
            </div>
          )}

          {/* Display coordinate fetching errors */}
          {coordinatesError &&
            !isLoadingCoordinates &&
            formik.values.address &&
            formik.values.postalCode &&
            formik.values.country && (
              <div className="p-3 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-md w-full text-center text-sm">
                Attention : {coordinatesError} (Vérifiez votre adresse)
              </div>
            )}

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={formik.handleSubmit} noValidate>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Prénom"
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Saisissez votre prénom"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    // Apply red border if touched and error exists based on the new logic
                    formik.touched.firstName &&
                    formik.errors.firstName &&
                    (formik.values.firstName !== "" || formik.submitCount > 0)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  aria-invalid={
                    formik.touched.firstName && !!formik.errors.firstName
                  }
                />
                {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
                {formik.touched.firstName &&
                  formik.errors.firstName &&
                  (formik.values.firstName !== "" ||
                    formik.submitCount > 0) && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.firstName}
                    </p>
                  )}
              </div>
              <div>
                <Input
                  label="Nom de famille"
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Saisissez votre nom"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    // Apply red border if touched and error exists based on the new logic
                    formik.touched.lastName &&
                    formik.errors.lastName &&
                    (formik.values.lastName !== "" || formik.submitCount > 0)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  aria-invalid={
                    formik.touched.lastName && !!formik.errors.lastName
                  }
                />
                {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
                {formik.touched.lastName &&
                  formik.errors.lastName &&
                  (formik.values.lastName !== "" || formik.submitCount > 0) && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.lastName}
                    </p>
                  )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="nom@exemple.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  // Apply red border if touched and error exists based on the new logic
                  formik.touched.email &&
                  formik.errors.email &&
                  (formik.values.email !== "" || formik.submitCount > 0)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={formik.touched.email && !!formik.errors.email}
              />
              {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
              {formik.touched.email &&
                formik.errors.email &&
                (formik.values.email !== "" || formik.submitCount > 0) && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.email}
                  </p>
                )}
            </div>

            {/* Phone */}
            <div>
              <Input
                label="Téléphone"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="06 12 34 56 78"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  // Apply red border if touched and error exists based on the new logic
                  formik.touched.phoneNumber &&
                  formik.errors.phoneNumber &&
                  (formik.values.phoneNumber !== "" || formik.submitCount > 0)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={
                  formik.touched.phoneNumber && !!formik.errors.phoneNumber
                }
              />
              {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
              {formik.touched.phoneNumber &&
                formik.errors.phoneNumber &&
                (formik.values.phoneNumber !== "" ||
                  formik.submitCount > 0) && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.phoneNumber}
                  </p>
                )}
            </div>

            {/* Address */}
            <div>
              <Input
                label="Adresse"
                id="address"
                name="address"
                type="text"
                placeholder="123 Rue de l'Exemple"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  // Apply red border if touched and error exists based on the new logic
                  formik.touched.address &&
                  formik.errors.address &&
                  (formik.values.address !== "" || formik.submitCount > 0)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={formik.touched.address && !!formik.errors.address}
              />
              {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
              {formik.touched.address &&
                formik.errors.address &&
                (formik.values.address !== "" || formik.submitCount > 0) && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.address}
                  </p>
                )}
            </div>

            {/* Postal Code and City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Code Postal"
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="31000"
                  value={formik.values.postalCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    // Apply red border if touched and error exists based on the new logic
                    formik.touched.postalCode &&
                    formik.errors.postalCode &&
                    (formik.values.postalCode !== "" || formik.submitCount > 0)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  aria-invalid={
                    formik.touched.postalCode && !!formik.errors.postalCode
                  }
                />
                {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
                {formik.touched.postalCode &&
                  formik.errors.postalCode &&
                  (formik.values.postalCode !== "" ||
                    formik.submitCount > 0) && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.postalCode}
                    </p>
                  )}
              </div>
              <div>
                <Input
                  label="Ville"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Paris"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    // Apply red border if touched and error exists based on the new logic
                    // Note: City is optional in schema, so this might only apply if other errors are added later
                    formik.touched.city &&
                    formik.errors.city &&
                    (formik.values.city !== "" || formik.submitCount > 0)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  aria-invalid={formik.touched.city && !!formik.errors.city}
                />
                {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
                {formik.touched.city &&
                  formik.errors.city &&
                  (formik.values.city !== "" || formik.submitCount > 0) && (
                    <p className="mt-1 text-xs text-red-600">
                      {formik.errors.city}
                    </p>
                  )}
              </div>
            </div>

            {/* Country */}
            <div>
              <Input
                label="Pays"
                id="country"
                name="country"
                type="text"
                placeholder="France"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  // Apply red border if touched and error exists based on the new logic
                  formik.touched.country &&
                  formik.errors.country &&
                  (formik.values.country !== "" || formik.submitCount > 0)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={formik.touched.country && !!formik.errors.country}
              />
              {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
              {formik.touched.country &&
                formik.errors.country &&
                (formik.values.country !== "" || formik.submitCount > 0) && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.country}
                  </p>
                )}
            </div>

            {/* Password */}
            <div>
              <Input
                label="Mot de passe"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  // Apply red border if touched and error exists based on the new logic
                  formik.touched.password &&
                  formik.errors.password &&
                  (formik.values.password !== "" || formik.submitCount > 0)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={
                  formik.touched.password && !!formik.errors.password
                }
              />
              {/* MODIFIED: Show error only if touched, error exists AND (value is not empty OR form submitted) */}
              {formik.touched.password &&
                formik.errors.password &&
                (formik.values.password !== "" || formik.submitCount > 0) && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.password}
                  </p>
                )}
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Je suis un
              </label>
              <select
                id="role"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  // Apply red border if touched and error exists based on the new logic
                  // For select, value is usually never '', so submitCount check is key here
                  formik.touched.role &&
                  formik.errors.role &&
                  formik.submitCount > 0 // Error primarily shown after submit attempt for select if invalid
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={formik.touched.role && !!formik.errors.role}
              >
                <option value="CLIENT">Client</option>
                <option value="RESTAURATEUR">Restaurateur</option>
                <option value="LIVREUR">Livreur</option>
              </select>
              {/* MODIFIED: Show error only if touched, error exists AND form submitted (as select always has a value) */}
              {formik.touched.role &&
                formik.errors.role &&
                formik.submitCount > 0 && ( // Simplified for select, error mainly relevant after submit attempt
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.role}
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <div>
              <CustomButton
                type="submit"
                disabled={isSubmitting || isLoadingCoordinates} // Disable while submitting or fetching coordinates
                // Applying button styles including focus ring (using custom class from previous context)
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-50)] disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isSubmitting || isLoadingCoordinates ? ( // Show spinner if submitting or loading coordinates
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isLoadingCoordinates
                      ? "Vérification adresse..."
                      : "Inscription en cours..."}
                  </>
                ) : (
                  "S'inscrire"
                )}
              </CustomButton>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Google Login Button (Placeholder) */}
          <div>
            <CustomButton
              type="button"
              // onClick={handleGoogleLogin} // TODO: Implement Google login logic
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <Image
                src="/google-logo.png" // Make sure this path is correct in your public folder
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
                // Add onError fallback if needed: onError={(e) => e.currentTarget.style.display='none'}
              />
              Continuer avec Google
            </CustomButton>
          </div>

          {/* Link to Login Page */}
          <div className="text-sm text-center">
            <p className="text-gray-600">
              Vous êtes déjà membre ?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
