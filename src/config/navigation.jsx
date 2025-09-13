import {
  HomeOutlined,
  CompassOutlined,
  BookOutlined,
  PlusOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import React from "react";


const Home = React.lazy(() => import("../pages/Home"));
const Explore = React.lazy(() => import("../pages/Explore"));
const MyJournal = React.lazy(() => import("../pages/MyJournal"));
const TripDetails = React.lazy(() => import("../pages/TripDetails"));
const UserTrips = React.lazy(() => import("../pages/UserTrips"));
const Users = React.lazy(() => import("../pages/Users"));
const SettingsPage = React.lazy(() => import("../pages/SettingsPage"));

export const NAVIGATION = {
  public: [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
      component: <Home />,
      visible: true,
    },
    {
      key: "explore",
      icon: <CompassOutlined />,
      label: "Explore",
      path: "/explore",
      component: <Explore />,
      visible: true,
    },
    {
      key: "users",
      label: "Users",
      path: "/users",
      component: <Users />,
      visible: true,
      icon: <UserOutlined />,
    },
  ],
  private: [
    {
      key: "my-journal",
      icon: <BookOutlined />,
      label: "My Journal",
      path: "/my-journal",
      component: <MyJournal />,
      visible: true,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      path: "/settings",
      component: <SettingsPage />,
      visible: true,
    },
    {
      key: "add-trip",
      icon: <PlusOutlined />,
      label: "Add Trip",
      path: null,
      visible: true,
      isAction: true,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      path: null,
      visible: true,
      isAction: true,
    },
  ],
  guest: [
    {
      key: "login",
      icon: <LoginOutlined />,
      label: "Login",
      path: null,
      visible: true,
      isAction: true,
    },
  ],
  dynamic: [
    {
      key: "trip-details",
      label: "Trip Details",
      path: "/trip/:id",
      component: <TripDetails />,
      isProtected: false,
    },
    {
      key: "user-trips",
      label: "User Trips",
      path: "/user/:login",
      component: <UserTrips />,
      isProtected: false,
    },
  ],
  notFound: {
    path: "*",
    element: <Navigate to="/" replace />,
  },
};

export const getRoutesConfig = () => {
  return {
    public: NAVIGATION.public.filter((item) => item.path),
    private: NAVIGATION.private.filter((item) => item.path),
    dynamic: NAVIGATION.dynamic.filter((item) => item.path),
    notFound: NAVIGATION.notFound,
  };
};

export const getMenuItems = (user, handlers) => {
  if (
    !handlers ||
    typeof handlers.navigate !== "function" ||
    typeof handlers.onAddTrip !== "function" ||
    typeof handlers.onLogin !== "function" ||
    typeof handlers.onLogout !== "function"
  ) {
    throw new Error("Required handlers are missing or invalid");
  }

  const { onAddTrip, onLogin, onLogout } = handlers;

  const publicItems = NAVIGATION.public
    .filter((item) => item.visible)
    .map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      onClick: () => handlers.navigate(item.path),
    }));

  if (user && user.login) {
    const privateItems = NAVIGATION.private
      .filter((item) => item.visible)
      .map((item) => {
        if (item.isAction) {
          return {
            key: item.key,
            label: item.label,
            icon: item.icon,
            onClick:
              item.key === "add-trip"
                ? onAddTrip
                : item.key === "logout"
                ? onLogout
                : () => console.error(`Unknown action key: ${item.key}`),
          };
        }
        return {
          key: item.key,
          label: item.label,
          icon: item.icon,
          onClick: () => handlers.navigate(item.path),
        };
      });

    return [...publicItems, ...privateItems];
  } else {
    const guestItems = NAVIGATION.guest
      .filter((item) => item.visible)
      .map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        onClick: onLogin,
      }));

    return [...publicItems, ...guestItems];
  }
};
