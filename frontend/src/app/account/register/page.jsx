"use client";

import { registerSchema } from "@/validation/schemas";
import { useFormik } from "formik";
import Link from "next/link";
import { use, useState } from "react";

const initialValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const Register = () => {
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  console.log(errors);
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {errors.name && (
                <div className="text-sm text-red-500 px-2">{errors.name}</div>
              )}
            </div>
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
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {errors.password && (
                <div className="text-sm text-red-500 px-2">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={values.password_confirmation}
                onChange={handleChange}
                placeholder="Enter Your confirm Password"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {errors.password_confirmation && (
                <div className="text-sm text-red-500 px-2">
                  {errors.password_confirmation}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4  rounded-md shadow-sm focus:outline-none disabled:bg-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-gray-600 p-1">
            Already an user?{" "}
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

export default Register;
