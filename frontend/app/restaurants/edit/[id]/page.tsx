"use client";
import React, { useState, useEffect } from "react";
import { useMe } from "@/hooks/useMe";
import { useAuthStore } from "@/store/authStore";
import { useFormik } from "formik";
import { z } from "zod";
import Input from "@/components/helper-components/Input";
import { CustomButton } from "@/components/helper-components/CustomButton";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { getRestaurantById, updateRestaurant } from "@/utils/apiRestaurant";
import RestaurantCategoryType from "@/types/RestaurantCategory";
import { Restaurant } from "@/types/Restaurants";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import useCoordinates from "@/hooks/useCoordinates";

// Define restaurant categories
const restaurantCategories: RestaurantCategoryType[] = [
  "PIZZA",
  "BURGER",
  "TACOS",
  "HALAL",
  "VEGETARIEN",
  "JAPONAIS",
  "THAI",
];

// Zod schema for validation
const restaurantSchema = z.object({
  name: z.string().min(1, "Veuillez renseigner ce champ"),
  categorie: z.enum(restaurantCategories, {
    errorMap: () => ({ message: "Veuillez sélectionner une catégorie valide" }),
  }),
  address: z.string().min(1, "Veuillez renseigner ce champ"),
  codePostal: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit être composé de 5 chiffres"),
  country: z.string().min(1, "Veuillez renseigner ce champ"),
  city: z.string().min(1, "Veuillez renseigner ce champ"),
  imagePath: z
    .string()
    .url("Veuillez entrer une URL valide")
    .min(1, "Veuillez renseigner ce champ"),
  description: z.string().min(1, "Veuillez renseigner ce champ"),
  deliveryCost: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, "Le coût doit être positif ou nul"),
  email: z.string().email("Email invalide"),
  closingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format HH:MM invalide"),
  phoneNumber: z
    .string()
    .regex(
      /^[+]?[0-9\s()-]+$/,
      "Le numéro de téléphone contient des caractères invalides"
    ),
});

// Infer the type from the Zod schema
type RestaurantFormValues = z.infer<typeof restaurantSchema>;

const EditRestaurantPage: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useMe(accessToken ?? "");
  const role = user?.role;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initialValues, setInitialValues] =
    useState<RestaurantFormValues | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const restaurantId = Number(id);

  const [initialRestaurant, setInitialRestaurant] = useState<Restaurant | null>(
    null
  );

  useEffect(() => {
    if (!restaurantId || !accessToken) return;

    const fetchRestaurant = async () => {
      try {
        const restaurant = await getRestaurantById(restaurantId, accessToken);
        console.log("Fetched restaurant:", restaurant);
        setInitialRestaurant(restaurant);
        setInitialValues({
          name: restaurant.name,
          categorie: restaurant.categorie,
          address: restaurant.address,
          codePostal: restaurant.codePostal,
          country: restaurant.country,
          city: restaurant.city,
          imagePath: restaurant.imagePath,
          description: restaurant.description,
          deliveryCost: restaurant.delevryCost,
          email: restaurant.email,
          closingTime: restaurant.closingTime,
          phoneNumber: restaurant.phoneNumber,
        });
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        toast.error(
          "Erreur lors de la récupération des données du restaurant."
        );
      }
    };

    fetchRestaurant();
  }, [restaurantId, accessToken]);

  const formik = useFormik<RestaurantFormValues>({
    initialValues: initialValues || {
      name: "",
      categorie: "PIZZA",
      address: "",
      codePostal: "",
      country: "",
      city: "",
      imagePath: "",
      description: "",
      deliveryCost: 0,
      email: "",
      closingTime: "",
      phoneNumber: "",
    },
    enableReinitialize: true,
    validate: (values) => {
      try {
        restaurantSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.flatten().fieldErrors as {
            [key in keyof RestaurantFormValues]?: string[];
          };
        }
        console.error("Unexpected validation error:", error);
        return { _error: "Une erreur de validation inattendue est survenue." };
      }
    },
    onSubmit: async (values) => {
      if (!accessToken || !restaurantId) {
        toast.error("Session invalide ou ID de restaurant manquant.");
        return;
      }
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const restaurantData: Partial<Restaurant> = {
          ...values,
          categorie: values.categorie as RestaurantCategoryType,
          delevryCost: Number(values.deliveryCost),
        };

        const newRestaurant = {
          ...initialRestaurant!,
          ...restaurantData,
          latitude: coordinates?.latitude || initialRestaurant!.latitude,
          longitude: coordinates?.longitude || initialRestaurant!.longitude,
        };

        await updateRestaurant(
          { ...newRestaurant, id: newRestaurant.id ?? null },
          accessToken
        );

        toast.success("Restaurant mis à jour avec succès !");
        router.replace(`/restaurants/my-restaurants/${restaurantId}`);
      } catch (error: any) {
        console.error("Error updating restaurant:", error);
        setSubmitError(
          `Échec de la mise à jour du restaurant: ${
            error.message || "Erreur inconnue"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const {
    coordinates,
    error: coordinatesError,
    isLoading: isLoadingCoordinates,
  } = useCoordinates(
    formik.values.address,
    formik.values.postalCode,
    formik.values.country
  );

  const getInputClass = (fieldName: keyof RestaurantFormValues) => {
    return `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
      formik.touched[fieldName] && formik.errors[fieldName]
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
    }`;
  };

  if (role !== "RESTAURATEUR") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">
          Vous n&apos;avez pas accès à cette page.
        </h1>
      </div>
    );
  }

  if (!initialValues) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-10">
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 shadow-lg rounded-xl space-y-6">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Modifier le restaurant
          </h2>
          {submitError && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md w-full text-center text-sm">
              {submitError}
            </div>
          )}
          {coordinatesError &&
            !isLoadingCoordinates &&
            formik.values.address &&
            formik.values.postalCode &&
            formik.values.country && (
              <div className="p-3 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded-md w-full text-center text-sm">
                Attention : {coordinatesError} (Vérifiez votre adresse)
              </div>
            )}
          <form className="space-y-5" onSubmit={formik.handleSubmit} noValidate>
            {/* Form fields (same as create page) */}
            {/* Name */}
            <div>
              <Input
                label="Nom du restaurant *"
                id="name"
                name="name"
                type="text"
                placeholder="Le nom de votre établissement"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("name")}
                error={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : undefined
                }
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categorie"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Catégorie *
              </label>
              <select
                id="categorie"
                name="categorie"
                value={formik.values.categorie}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("categorie")}
              >
                {restaurantCategories.map((categoryValue) => (
                  <option key={categoryValue} value={categoryValue}>
                    {categoryValue.charAt(0) +
                      categoryValue.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {formik.touched.categorie && formik.errors.categorie && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.categorie as string}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <Input
                label="Adresse *"
                id="address"
                name="address"
                type="text"
                placeholder="Numéro et nom de rue"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("address")}
                error={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : undefined
                }
              />
            </div>

            {/* Postal Code & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Code postal *"
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="Ex: 34140"
                  value={formik.values.codePostal}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getInputClass("codePostal")}
                  error={
                    formik.touched.codePostal && formik.errors.codePostal
                      ? formik.errors.codePostal
                      : undefined
                  }
                />
              </div>
              <div>
                <Input
                  label="Ville *"
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Ex: Mèze"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getInputClass("city")}
                  error={
                    formik.touched.city && formik.errors.city
                      ? formik.errors.city
                      : undefined
                  }
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <Input
                label="Pays *"
                id="country"
                name="country"
                type="text"
                placeholder="Ex: France"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("country")}
                error={
                  formik.touched.country && formik.errors.country
                    ? formik.errors.country
                    : undefined
                }
              />
            </div>

            {/* Phone Number */}
            <div>
              <Input
                label="Numéro de téléphone *"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Format international ou local"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("phoneNumber")}
                error={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? formik.errors.phoneNumber
                    : undefined
                }
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Décrivez votre restaurant, son ambiance, ses spécialités..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={getInputClass("description")}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.description}
                </p>
              )}
            </div>

            {/* Delivery Cost */}
            <div>
              <Input
                label="Coût de livraison (€) *"
                id="deliveryCost"
                name="deliveryCost"
                type="number"
                placeholder="0 si gratuit"
                value={String(formik.values.deliveryCost)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("deliveryCost")}
                min="0"
                step="0.01"
                error={
                  formik.touched.deliveryCost && formik.errors.deliveryCost
                    ? String(formik.errors.deliveryCost)
                    : undefined
                }
              />
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email de contact *"
                id="email"
                name="email"
                type="email"
                placeholder="contact@votrerestaurant.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("email")}
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : undefined
                }
              />
            </div>

            {/* Closing Time */}
            <div>
              <Input
                label="Heure de fermeture (HH:MM) *"
                id="closingTime"
                name="closingTime"
                type="time"
                placeholder="HH:MM"
                value={formik.values.closingTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("closingTime")}
                error={
                  formik.touched.closingTime && formik.errors.closingTime
                    ? formik.errors.closingTime
                    : undefined
                }
              />
            </div>

            {/* Image Path */}
            <div>
              <Input
                label="URL de l'image principale *"
                id="imagePath"
                name="imagePath"
                type="url"
                placeholder="https://exemple.com/image.jpg"
                value={formik.values.imagePath}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("imagePath")}
                error={
                  formik.touched.imagePath && formik.errors.imagePath
                    ? formik.errors.imagePath
                    : undefined
                }
              />
            </div>

            {/* Submit Button */}
            <CustomButton
              type="submit"
              disabled={isSubmitting || !formik.isValid || !formik.dirty}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Mise à jour en cours...
                </>
              ) : (
                "Mettre à jour le restaurant"
              )}
            </CustomButton>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditRestaurantPage;
