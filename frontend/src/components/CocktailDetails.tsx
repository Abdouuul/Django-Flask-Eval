import { useEffect, useState, type FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";

export interface IIngredient {
  id: number;
  name: string;
}

export interface ICocktailDetail {
  name: string;
  description: string;
  ingredients: Array<IIngredient>;
  music_type: string;
}

export const CocktailDetail: FC = () => {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const [cocktail, setCocktail] = useState<ICocktailDetail>();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/cocktails/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setCocktail(res.data);
      })
      .catch((err) => {
        console.log("Error while retrieving cocktail details" + err);
      });
  }, [accessToken, id]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-200">
      {/* display the info in better looking please */}

      <div className="bg-white rounded-lg shadow-xl p-8 m-4 w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          {cocktail?.name}
        </h2>
        <p className="text-lg text-gray-700 mb-6 text-center">
          {cocktail?.description}
        </p>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            Ingredients:
          </h3>
          <ul className="list-disc list-inside text-gray-700 text-lg">
            {cocktail?.ingredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.name}</li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            Best enjoyed with:
          </h3>
          <p className="text-xl text-blue-600 font-medium">
            {cocktail?.music_type}
          </p>
        </div>
      </div>
    </div>
  );
};
