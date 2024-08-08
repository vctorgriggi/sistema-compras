import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CategoriasDeProdutos from "./pages/CategoriasDeProdutos";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./routes/PrivateRoute";
import Fornecedores from "./pages/Fornecedores";
import Cotacoes from "./pages/Cotacoes";
import Contatos from "./pages/Contatos";
import Produtos from "./pages/Produtos";
import Inicio from "./pages/Inicio";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            }
          />
          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Produtos />
              </PrivateRoute>
            }
          />
          <Route
            path="/c-produtos"
            element={
              <PrivateRoute>
                <CategoriasDeProdutos />
              </PrivateRoute>
            }
          />
          <Route
            path="/fornecedores"
            element={
              <PrivateRoute>
                <Fornecedores />
              </PrivateRoute>
            }
          />
          <Route
            path="/contatos"
            element={
              <PrivateRoute>
                <Contatos />
              </PrivateRoute>
            }
          />
          <Route
            path="/cotacoes"
            element={
              <PrivateRoute>
                <Cotacoes />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
