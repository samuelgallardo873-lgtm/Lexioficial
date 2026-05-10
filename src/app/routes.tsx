import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { FindLawyer } from "./pages/FindLawyer";
import { LawyerProfile } from "./pages/LawyerProfile";
import { PaymentPage } from "./pages/PaymentPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { LawyerOnboarding } from "./pages/LawyerOnboarding";

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
    path: "/join-as-lawyer",
    Component: LawyerOnboarding,
  },
]);
