"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import BaseHeader from "@/components/header_footers/BaseHeader";
import Image from "next/image";
import Input from "@/components/helper-components/Input";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CustomButton } from "@/components/helper-components/CustomButton";

const loginSchema = z.object({
  email: z
    .string()
    .email("Email invalide")
    .min(1, " Veuillez renseigner votre email"),
  password: z.string().min(1, "Veuillez renseigner votre mot de passe"),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateLoginZodSchema = (values: any) => {
  try {
    loginSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.flatten().fieldErrors;
    }
    console.error("Erreur de validation inattendue:", error);
    return { _error: "Une erreur de validation inattendue est survenue." };
  }
};

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const authLogin = useAuthStore((state) => state.login);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (submitError) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitError]);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLoginZodSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await authLogin(values.email, values.password);
        console.log("Connexion réussie !");
      } catch (error) {
        console.error("Échec de la connexion:", error);
        setSubmitError(
          "Échec de la connexion. Vérifiez votre email et mot de passe."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <BaseHeader />

      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white mt-16 p-8 shadow-lg rounded-xl space-y-8">
          {" "}
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Se connecter
          </h2>
          {submitError && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md w-full text-center text-sm">
              {submitError}
            </div>
          )}
          <form className="space-y-6" onSubmit={formik.handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="nom@exemple.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={formik.touched.email && !!formik.errors.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                aria-invalid={
                  formik.touched.password && !!formik.errors.password
                }
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="#" className="font-medium hover:text-gray-600">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <CustomButton
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white button-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isSubmitting ? (
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
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </CustomButton>
            </div>
          </form>
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
          <div>
            <CustomButton
              type="button"
              // onClick={handleGoogleLogin} // Logique à ajouter
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <Image
                src="/google-logo.png"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Continuer avec Google
            </CustomButton>
          </div>
          <div className="text-sm text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;