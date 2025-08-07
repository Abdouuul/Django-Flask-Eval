import { useState, type FC } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup"
import axios from "axios";
export interface IRequestForm{
  message: string
}

export const Home: FC = () => {
  const { accessToken } = useAuth();
  const [reply, setReply] = useState("")
  const initialValuesRequestForm: IRequestForm = {
    message: "",
  };
  const FormValuesValidationSchema = Yup.object().shape({
    message: Yup.string().required("Please write your request"),
  });
  const formHandler = useFormik({
    initialValues: initialValuesRequestForm,
    validationSchema: FormValuesValidationSchema,

    onSubmit:  (values) => {
      formHandler.setSubmitting(true);
      axios.post(
        "http://127.0.0.1:8000/generator/",
        {
          message: values.message,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then((res) => {
        setReply(res.data.reply)
      }).catch((err) => {
        console.log(err)
      })

    },
  })
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-200 p-4">
      <div className="w-full max-w-2xl p-8 mt-4 text-left bg-gradient-to-r from-green-100 to-blue-100 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Welcome to CocktAIL!</h3>
        <p className="text-lg text-center mt-4">
          Your personal bartender powered by AI.
        </p>
        <p className="text-md text-center mt-2">
          Explore our collection of cocktails or let AI suggest one for you.
        </p>
        <div className="mt-6">
          {reply && (
            <div className="bg-blue-200 p-4 rounded-lg shadow-inner">
              <p className="text-gray-700 italic break-words">{reply}</p>
            </div>
          )}
        </div>
        
        <form onSubmit={formHandler.handleSubmit} className="space-y-6 mt-10">
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
              {...formHandler.getFieldProps("message")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              placeholder="Type your request here : e. I need a nice fresh cocktail"
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-400 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
