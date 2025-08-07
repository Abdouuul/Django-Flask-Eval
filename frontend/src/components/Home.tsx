import type { FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFormik } from "formik";

export const Home: FC = () => {
  const { accessToken } = useAuth();
  const formHandler = useFormik({
    
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-200">
      <div className="px-20 py-20 mt-4 text-left bg-gradient-to-r from-green-100 to-blue-100 shadow-lg rounded-lg ">
        <h3 className="text-2xl font-bold text-center">Welcome to CocktAIL!</h3>
        <p className="text-lg text-center mt-4">
          Your personal bartender powered by AI.
        </p>
        <p className="text-md text-center mt-2">
          Explore our collection of cocktails or let AI suggest one for you.
        </p>

        <form className="space-y-6 mt-10">
          <div>
            <label
              htmlFor="message"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Your Request
            </label>
            <textarea
              id="message"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              placeholder="Type your request here : e. I need a nice fresh cocktail"
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="px-2 py-1 text-white bg-blue-400 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
