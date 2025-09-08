import React, { useState, useEffect } from "react";
import { Layout, Menu, theme, Spin, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUsers";
import AuthForm from "./AuthForm";
import AddTripModal from "./AddTrip";
import { getMenuItems } from "../config/navigation";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

export default function StandartPage({ children }) {
  const { user, logout, setLoginVisible, setRegisterVisible } = useUser(
    (state) => state
  );
  const [collapsed, setCollapsed] = useState(false);
  const [addTripVisible, setAddTripVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Добавляем useLocation для отслеживания текущего пути
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);



  const handleCollapse = (collapsed) => {
    setIsTransitioning(true);
    setCollapsed(collapsed);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  
  const openAddTrip = () => setAddTripVisible(true);
  const closeAddTrip = () => setAddTripVisible(false);

  const handlers = {
    navigate: (path) => navigate(path),
    onAddTrip: openAddTrip,
    onLogin: () => setLoginVisible(true),
    onLogout: () => {
      logout();
      navigate("/");
    },
  };

  const menu_items = getMenuItems(user, handlers);

  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", position: "relative" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          height: "100vh",
          overflow: "hidden auto",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
        }}
        width={200}
        collapsedWidth={80}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: collapsed ? 24 : 18,
            fontWeight: "bold",
            transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
            overflow: "hidden",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          {collapsed ? (
            <span style={{ fontSize: 24 }}>🌍</span>
          ) : (
            <span style={{ opacity: isTransitioning ? 0.7 : 1 }}>
              🌍 Travel
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menu_items}
          style={{
            borderRight: 0,
            background: "transparent",
            transition: "all 0.3s ease",
          }}
          inlineCollapsed={collapsed}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          minHeight: "100vh",
          background: "#f0f2f5",
        }}
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 500,
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            justifyContent: "space-between",
            transition: "all 0.3s ease",
            height: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
             <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 600,
                color: "#1f1f1f",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Travel Journal
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {user && (
              <Text style={{ color: "#666", fontSize: 14 }}>
                Welcome, <b style={{ color: "#1890ff" }}>{user.login}</b>!
              </Text>
            )}
            <AuthForm />
          </div>
        </Header>

        <Content
          style={{
            margin: "16px",
            transition: "all 0.3s ease",
            padding: "0 8px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
          >
            <AddTripModal open={addTripVisible} onClose={closeAddTrip} />
            {children}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
            padding: "16px 24px",
            background: "#fafafa",
            borderTop: "1px solid #f0f0f0",
            transition: "all 0.3s ease",
          }}
        >
          Travel Journal ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>

      {/* Global Styles */}
      <style>
        {`
          .ant-layout-sider::-webkit-scrollbar {
            width: 4px;
          }
          
          .ant-layout-sider::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
          }
          
          .ant-layout-sider::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
          
          .ant-menu-item {
            transition: all 0.2s ease !important;
          }
          
          .ant-menu-item:hover {
            transform: translateX(2px);
          }
          
          .ant-btn-text:not(:disabled):hover {
            background: rgba(0, 0, 0, 0.06) !important;
            transform: scale(1.05);
          }
        `}
      </style>
    </Layout>
  );
}
