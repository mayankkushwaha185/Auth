"use client";

import { loginSchema } from "@/validation/schemas";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const router = useRouter();
  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log(values);
      router.push("/user/profile");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
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
            <p className="text-sm text-gray-600 p-1">
              {" "}
              <Link
                href="/account/reset-password-link "
                className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
              >
                Forget Password?
              </Link>
            </p>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4  rounded-md shadow-sm focus:outline-none disabled:bg-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-gray-600 p-1">
            Don't have Account?
            <Link
              href="account/register"
              className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
