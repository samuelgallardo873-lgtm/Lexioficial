import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-center"
        richColors
        toastOptions={{
          duration: 5000,
        }}
      />
    </AuthProvider>
  );
}