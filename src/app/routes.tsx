import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { FindLawyer } from "./pages/FindLawyer";
import { LawyerProfile } from "./pages/LawyerProfile";
import { PaymentPage } from "./pages/PaymentPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { LawyerOnboarding } from "./pages/LawyerOnboarding";
import { FAQ } from "./pages/FAQ";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLogin } from "./pages/AdminLogin";
import { JoinPitch } from "./pages/JoinPitch";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/find-lawyer",
    Component: FindLawyer,
  },
  {
    path: "/lawyer/:id",
    Component: LawyerProfile,
  },
  {
    path: "/payment",
    Component: PaymentPage,
  },
  {
    path: "/confirmation",
    Component: ConfirmationPage,
  },
  {
    path: "/unete",
    Component: JoinPitch,
  },
  {
    path: "/join",
    Component: LawyerOnboarding,
  },
  {
    path: "/faq",
    Component: FAQ,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
]);
