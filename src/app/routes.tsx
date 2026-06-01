import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom";
import { Home } from "./pages/Home";
import { FindLawyer } from "./pages/FindLawyer";
import { LawyerProfile } from "./pages/LawyerProfile";
import { PaymentPage } from "./pages/PaymentPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { LawyerOnboarding } from "./pages/LawyerOnboarding";
import { FAQ } from "./pages/FAQ";
import { Terms } from "./pages/Terms";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLogin } from "./pages/AdminLogin";
import { JoinPitch } from "./pages/JoinPitch";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { LawyerDashboard } from "./pages/LawyerDashboard";

import { ErrorBoundary } from "./components/ErrorBoundary";

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/terminos",
        Component: Terms,
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
      {
        path: "/lawyer-dashboard",
        Component: LawyerDashboard,
      },
    ]
  }
];

export const router = createBrowserRouter(routes);
