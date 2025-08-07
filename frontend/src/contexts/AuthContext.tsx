import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");
      if (token) {
        try {
          setAccessToken(token);
          setRefreshToken(refresh);
          await axios
            .post("http://127.0.0.1:8000/api/token/verify/", {
              token: token,
            })
            .catch((err) => {
              axios.post("http://127.0.0.1:8000/api/token/refresh/", {
                refresh: refresh,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res) => {
                localStorage.setItem("accessToken", res.data.access);
                setAccessToken(res.data.access);
                setIsAuthenticated(true);
              })
            });
          setIsAuthenticated(true);
        } catch (err) {
          console.log("Token not valid :", err);
          logout();
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = (username: string, password: string) => {
    return axios
      .post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      })
      .then((res) => {
        console.log(res.data);
        setAccessToken(res.data.access);
        setIsAuthenticated(true);
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
      });
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        accessToken: accessToken,
        isLoading: isLoading,
        login: login,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
