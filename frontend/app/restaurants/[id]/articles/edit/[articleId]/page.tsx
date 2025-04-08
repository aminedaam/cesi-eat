"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Input from "@/components/helper-components/Input";
import { CustomButton } from "@/components/helper-components/CustomButton";
import LoadingSpinner from "@/components/helper-components/LoadingSpinner";
import { getArticleById, updateArticle } from "@/utils/apiArticles";
import { useAuthStore } from "@/store/authStore";
import { TypeProduit } from "@/types/TypeProduits";
import { Restaurant } from "@/types/Restaurants";
import { getRestaurantById } from "@/utils/apiRestaurant";
import { Menu } from "@/types/Menu";
import { getMenusByRestaurantId } from "@/utils/apiMenu";

// Zod schema for validation
const articleSchema = z.object({
  name: z.string().min(1, "Veuillez renseigner ce champ"),
  description: z.string().min(1, "Veuillez renseigner ce champ"),
  price: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .min(0, "Le prix doit être positif ou nul"),
  typeProd: z.nativeEnum(TypeProduit, {
    errorMap: () => ({ message: "Veuillez sélectionner un type valide" }),
  }),
  imagePath: z
    .string()
    .url("Veuillez entrer une URL valide")
    .min(1, "Veuillez renseigner ce champ"),
  menu: z.string().nullable(), // Add menu field as nullable
});

// Infer the type from the Zod schema
type ArticleFormValues = z.infer<typeof articleSchema>;

const EditArticlePage: React.FC = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { id, articleId } = useParams();
  const restaurantId = Number(id);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [availableMenus, setAvailableMenus] = useState<Menu[]>([]);
  const [initialValues, setInitialValues] = useState<ArticleFormValues | null>(
    null
  );

  useEffect(() => {
    // Fetch article data
    const fetchArticle = async () => {
      if (!accessToken) {
        toast.error("Session invalide. Veuillez vous reconnecter.");
        return;
      }
      try {
        const fetchedArticle = await getArticleById(
          Number(articleId),
          accessToken
        );
        setInitialValues({
          name: fetchedArticle.name,
          description: fetchedArticle.description ?? "",
          price: fetchedArticle.price,
          typeProd: fetchedArticle.typeProd,
          imagePath: fetchedArticle.imagePath ?? "",
          menu: fetchedArticle.menuId ? String(fetchedArticle.menuId) : null,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Erreur lors de la récupération de l'article.");
      }
    };
    fetchArticle();
  }, [accessToken, articleId]);

  useEffect(() => {
    // Fetch restaurant data
    const fetchRestaurant = async () => {
      if (!accessToken) {
        toast.error("Session invalide. Veuillez vous reconnecter.");
        return;
      }
      try {
        const fetchedRestaurant = await getRestaurantById(
          restaurantId,
          accessToken
        );
        setRestaurant(fetchedRestaurant);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        toast.error("Erreur lors de la récupération du restaurant.");
      }
    };
    fetchRestaurant();
  }, [accessToken, restaurantId]);

  useEffect(() => {
    if (restaurant) {
      const fetchMenus = async () => {
        try {
          const menus = await getMenusByRestaurantId(
            restaurant.id!,
            accessToken!
          );
          setAvailableMenus(menus);
        } catch (error) {
          console.error("Error fetching menus:", error);
        }
      };
      fetchMenus();
    }
  }, [restaurant, accessToken]);

  const formik = useFormik<ArticleFormValues>({
    initialValues: initialValues || {
      name: "",
      description: "",
      price: 0,
      typeProd: TypeProduit.PLAT,
      imagePath: "",
      menu: null,
    },
    enableReinitialize: true,
    validate: (values) => {
      try {
        articleSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.flatten().fieldErrors as {
            [key in keyof ArticleFormValues]?: string[];
          };
        }
        console.error("Unexpected validation error:", error);
        return { _error: "Une erreur de validation inattendue est survenue." };
      }
    },
    onSubmit: async (values) => {
      if (!accessToken) {
        toast.error("Session invalide. Veuillez vous reconnecter.");
        return;
      }
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const articleData = {
          ...values,
          price: Number(values.price),
          restaurant: restaurant!,
          menu: values.menu ? { id: values.menu } : null,
          id: Number(articleId),
        };

        await updateArticle(articleData, accessToken);

        toast.success("Article mis à jour avec succès !");
        router.push(`/restaurants/my-restaurants/${id}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error updating article:", error);
        setSubmitError(
          `Échec de la mise à jour de l'article: ${
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

  const getInputClass = (fieldName: keyof ArticleFormValues) => {
    return `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
      formik.touched[fieldName] && formik.errors[fieldName]
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
    }`;
  };

  if (!initialValues) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-10">
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 shadow-lg rounded-xl space-y-6">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Modifier l&apos;article
          </h2>
          {submitError && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md w-full text-center text-sm">
              {submitError}
            </div>
          )}
          <form className="space-y-5" onSubmit={formik.handleSubmit} noValidate>
            {/* Form fields (similar to create page) */}
            <div>
              <Input
                label="Nom de l'article *"
                id="name"
                name="name"
                type="text"
                placeholder="Nom de l'article"
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
            <div>
              <label
                htmlFor="typeProduit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type de produit *
              </label>
              <select
                id="typeProd"
                name="typeProd"
                value={formik.values.typeProd}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("typeProd")}
              >
                {Object.values(TypeProduit).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              {formik.touched.typeProd && formik.errors.typeProd && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.typeProd}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Prix (€) *"
                id="price"
                name="price"
                type="number"
                placeholder="Prix de l'article"
                value={String(formik.values.price)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("price")}
                min="0"
                step="0.01"
                error={
                  formik.touched.price && formik.errors.price
                    ? String(formik.errors.price)
                    : undefined
                }
              />
            </div>
            <div>
              <Input
                label="URL de l'image *"
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
                placeholder="Description de l'article"
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
            <div>
              <label
                htmlFor="menu"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Associer à un menu (optionnel)
              </label>
              <select
                id="menu"
                name="menu"
                value={formik.values.menu || ""}
                onChange={(e) =>
                  formik.setFieldValue("menu", e.target.value || null)
                }
                onBlur={formik.handleBlur}
                className={getInputClass("menu")}
              >
                <option value="">-- Aucun menu --</option>
                {availableMenus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
              {formik.touched.menu && formik.errors.menu && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.menu}
                </p>
              )}
            </div>
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
                "Mettre à jour l'article"
              )}
            </CustomButton>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditArticlePage;
