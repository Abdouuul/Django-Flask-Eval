import type { FC } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export interface ILoginFormValues {
  username: string;
  password: string;
}
const initialLoginFormValues: ILoginFormValues = {
  username: "",
  password: "",
};

const FormValuesValidationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
export const Login: FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formHandler = useFormik({
    initialValues: initialLoginFormValues,
    validationSchema: FormValuesValidationSchema,

    onSubmit: async (values) => {
      await login(values.username, values.password);
      navigate("/");
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-200">
      <div className="px-20 py-20 mt-4 text-left bg-gradient-to-r from-green-100 to-blue-100 shadow-lg rounded-lg ">
        <h3 className="text-2xl font-bold text-center">
          Login to your account
        </h3>
        <form onSubmit={formHandler.handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                required
                {...formHandler.getFieldProps("username")}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                required
                {...formHandler.getFieldProps("password")}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
