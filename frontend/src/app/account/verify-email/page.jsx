"use client";

import { verifyEmailSchema } from "@/validation/schemas";
import { useFormik } from "formik";
import Link from "next/link";

const initialValues = {
  email: "",
  otp: "",
};

const verifyEmail = () => {
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: verifyEmailSchema,
    onSubmit: async (values) => {
      console.log(values);
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
                placeholder="Enter Your Email"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {errors.email && (
                <div className="text-sm text-red-500 px-2">{errors.email}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2">
                OTP
              </label>
              <input
                type="otp"
                id="otp"
                name="otp"
                value={values.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {errors.otp && (
                <div className="text-sm text-red-500 px-2">{errors.otp}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4  rounded-md shadow-sm focus:outline-none disabled:bg-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            >
              Verify
            </button>
          </form>
          <p className="text-sm text-gray-600 p-1">
            Already an User?
            <Link
              href="account/login"
              className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default verifyEmail;
