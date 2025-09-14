"use client";

import { useVerifyEmailMutation } from "@/lib/services/auth";
import { verifyEmailSchema } from "@/validation/schemas";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialValues = {
  email: "",
  otp: "",
};

const VerifyEmail = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [verifyEmail] = useVerifyEmailMutation();
  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: verifyEmailSchema,
      onSubmit: async (values, action) => {
        setLoading(true);
        try {
          const response = await verifyEmail(values);
          if (response.data && response.data.status === "success") {
            setServerSuccessMessage(response.data.message);
            setServerErrorMessage("");
            router.push("/account/login");
            action.resetForm();
            setLoading(false);
          }
          if (response.error && response.error.data.status === "failed") {
            setServerErrorMessage(response.error.data.message);
            setServerSuccessMessage("");
            setLoading(false);
          }
          console.log(response);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      },
    });

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Verify Your Account</h2>
          <p className="text-sm text-center mb-6 text-gray-400">
            Check Yuor email for otp, otp is valid for 15 minutes
          </p>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Your Email"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {touched.email && errors.email && (
                <div className="text-sm text-red-500 px-2">{errors.email}</div>
              )}
            </div>
            {/* OTP Field */}
            <div className="mb-4">
              <label htmlFor="otp" className="block font-medium mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={values.otp}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter OTP"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {touched.otp && errors.otp && (
                <div className="text-sm text-red-500 px-2">{errors.otp}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4  rounded-md shadow-sm focus:outline-none 
              
              disabled:bg-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            >
              Verify
            </button>
          </form>
          <p className="text-sm text-gray-600 p-1">
            Already an User?
            <Link
              href="/login"
              className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
            >
              Login
            </Link>
          </p>
          <div>
            {serverSuccessMessage && (
              <div className="text-sm text-green-500 font-semibold px-2">
                {serverSuccessMessage}
              </div>
            )}
            {serverErrorMessage && (
              <div className="text-sm text-red-500 font-semibold px-2">
                {serverErrorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
