import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "../App";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ForgotPassword from "../pages/ForgotPassword";
import Produtos from "../pages/Produtos";
import CategoriasDeProdutos from "../pages/CategoriasDeProdutos";
import Fornecedores from "../pages/Fornecedores";
import Contatos from "../pages/Contatos";
import Cotacoes from "../pages/Cotacoes";
import { PrivateRoute } from "./PrivateRoute";

export default function CreateRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <App />
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
              <App />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
