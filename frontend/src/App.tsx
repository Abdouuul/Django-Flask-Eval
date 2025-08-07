import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/LoginPage";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/authentication/AuthGuard";
import { Home } from "./components/Home";
import { Cocktails } from "./components/Cocktails";
import { CocktailDetail } from "./components/CocktailDetails";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/cocktails" element={<Cocktails />}></Route>
            <Route path="/cocktails/:id" element={<CocktailDetail />}></Route>
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
