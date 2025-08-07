import { useEffect, useState, type FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export interface ICocktails {
  id: number;
  name: string;
  created_at: Date;
}

export const Cocktails: FC = () => {
  const [cocktails, setCocktails] = useState<ICocktails[]>([]);
  const { accessToken } = useAuth();

  const handleDelete = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/cocktails/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchCocktails();
      })
      .catch((err) => {
        console.error("Error deleting the cocktail:", err);
        alert("Failed to delete the cocktail.");
      });
  };

  const fetchCocktails = () => {
    axios
      .get("http://127.0.0.1:8000/api/cocktails/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCocktails(res.data);
      })
      .catch((err) => {
        console.log("Error retrieving the cocktails : " + err);
      });
  };
  useEffect(() => {
    if (accessToken) {
      fetchCocktails();
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-200 p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Our Cocktails
      </h2>
      <div className="w-full bg-gradient-to-r rounded-lg  p-6">
        {/* if cocktails is empty, add a button that navigates to the home page / */}
        {cocktails.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 mb-4">
              No cocktails generated yet.
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Generate your first cocktail!
            </a>
          </div>
        )}

        <ul className=" space-y-4">
          {cocktails?.map((cocktail) => (
            <li
              key={cocktail.id}
              className="bg-gradient-to-r from-green-100 to-blue-100 flex justify-between items-center p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
            >
              <a
                href={`/cocktails/${cocktail.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {cocktail.name}
              </a>
              <div className="flex items-center space-x-4">
                {/* <span className="text-gray-500 text-sm hidden sm:block">
                  Created on:{" "}
                  {}
                </span> */}
                <button
                  onClick={() => handleDelete(cocktail.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
