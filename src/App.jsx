import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import StandartPage from "./components/StandartPage";
import { useUser } from "./hooks/useUsers";
import { getRoutesConfig } from "./config/navigation";
import { Spin } from "antd";
import DesignedToaster from "./components/DesignedToaster";

const App = () => {
  const { user } = useUser((state) => state);
  const {
    public: publicRoutes,
    private: privateRoutes,
    dynamic,
    notFound,
  } = getRoutesConfig();

  return (
    <Router>
      <StandartPage>
        <DesignedToaster />
        <Suspense fallback={<Spin size="big" tip="Loading..." />}>
          <Routes>
            {/* Публичные маршруты */}
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}

            {/* Приватные маршруты с проверкой авторизации */}
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={user ? route.component : <Navigate to="/" replace />}
              />
            ))}

            {/* Динамические маршруты */}
            {dynamic.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}

            {/* Обработка несуществующих путей */}
            <Route path={notFound.path} element={notFound.element} />
          </Routes>
        </Suspense>
      </StandartPage>
    </Router>
  );
};

export default App;
