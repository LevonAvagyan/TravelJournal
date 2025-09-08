import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StandartPage from "./components/StandartPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { getRoutesConfig } from "./config/navigation";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const MyJournal = lazy(() => import("./pages/MyJournal"));
const TripDetails = lazy(() => import("./pages/TripDetails")); 

function App() {
  const routesConfig = getRoutesConfig();

  return (
    <Router>
      <StandartPage>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#000",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            success: {
              iconTheme: {
                primary: "#52c41a",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ff4d4f",
                secondary: "#fff",
              },
            },
          }}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Публичные маршруты */}
            {routesConfig.public.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.key === "home" ? (
                    <Home />
                  ) : route.key === "explore" ? (
                    <Explore />
                  ) : null
                }
              />
            ))}

            {/* Приватные маршруты */}
            {routesConfig.private.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    {route.key === "my-journal" && <MyJournal />}
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Динамические маршруты */}
            {routesConfig.dynamic.map((route) => (
              <Route
                key={route.key}
                path={route.path}
                element={
                  route.isProtected ? (
                    <ProtectedRoute>
                      <TripDetails />
                    </ProtectedRoute>
                  ) : (
                    <TripDetails />
                  )
                }
              />
            ))}
          </Routes>
        </Suspense>
      </StandartPage>
    </Router>
  );
}

export default App;
