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

  useEffect(() => {
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
  }, [accessToken]);
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-200 p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Our Cocktails
      </h2>
      <div className="w-full bg-gradient-to-r rounded-lg p-6">
        <ul className="space-y-4">
          {cocktails?.map((cocktail) => (
            <li
              key={cocktail.id}
              className="flex justify-between items-center p-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
            >
              <a
                href={`/cocktails/${cocktail.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {cocktail.name}
              </a>
              <span className="text-gray-500 text-sm">Created on:</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
