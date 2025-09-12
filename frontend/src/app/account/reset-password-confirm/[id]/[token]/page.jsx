"use client";

import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { resetPasswordSchema } from "@/validation/schemas";

const initialValues = {
  password: "",
  password_confirmation: "",
};

const ResetPasswordConfirm = () => {
  const { id, token } = useParams();
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      const data = { ...values, id, token };
      console.log(data);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Enter Your New Password"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {errors.password && (
                <div className="text-sm text-red-500 px-2">{errors.email}</div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={values.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
              {errors.password && (
                <div className="text-sm text-red-500 px-2">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4  rounded-md shadow-sm focus:outline-none disabled:bg-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
