import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  Typography,
  Button,
  Empty,
  Flex,
  Card,
  Divider,
  Affix,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTrips } from "../hooks/useTrips";
import { useUser } from "../hooks/useUsers";
import CardComp from "../components/CardComp";
import Avatar from "../components/Avatar";

const { Title, Text } = Typography;

const UserTrips = () => {
  const { login } = useParams();
  const navigate = useNavigate();

  const { fetchUserTrips, userTrips, handleLoading } = useTrips();
  const {
    selectedUser,
    fetchUserByLogin,
    handleLoading: userLoading,
  } = useUser();

  useEffect(() => {
    if (login) {
      (async () => {
        const user = await fetchUserByLogin(login);
        if (user) {
          fetchUserTrips(user.userId, false);
        }
      })();
    }
  }, [login]);

  return (
    <Flex
      vertical
      justify="center"
      gap={32}
      style={{
        padding: "32px 16px",
        maxWidth: "1200px !important",
        margin: "0 auto !important",
        minHeight: "80vh",
        background: "#f9fafb",
        width: "100%",
        position: "relative", // Для работы Affix
      }}
    >
      {/* Верхняя панель с информацией о пользователе */}
      {selectedUser && (
        <Flex
          align="center"
          gap={24}
          style={{
            transition: "transform 0.3s ease",
            "&:hover": { transform: "translateX(-5px)" },
          }}
        >
          {selectedUser && (
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "20px 24px",
                background: "linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)",
                border: "1px solid #e8e8e8",
                width: "100%",
              }}
            >
              <Flex align="center" gap={20} style={{ alignItems: "center" }}>
                <Avatar user={selectedUser} size={64} />
                <Flex vertical>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#1a2e44",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedUser.login}
                  </Title>
                  <Text
                    type="secondary"
                    style={{ fontSize: "14px", color: "#666" }}
                  >
                    {userTrips.length} trips shared
                  </Text>
                </Flex>
              </Flex>
            </Card>
          )}
        </Flex>
      )}

      <Divider
        style={{
          borderColor: "#e8e8e8",
          margin: "0 -16px",
        }}
      />

      {/* Контент с улучшенной компоновкой */}
      {handleLoading || userLoading ? (
        <Flex justify="center" align="center" style={{ height: "40vh" }}>
          <Spin size="large" tip="Loading trips..." />
        </Flex>
      ) : userTrips.length === 0 ? (
        <Empty
          description={
            <span style={{ color: "#666" }}>
              No trips found for {selectedUser?.login || "this user"}
            </span>
          }
          style={{ marginTop: "10vh", textAlign: "center" }}
        />
      ) : (
        <Flex
          wrap="wrap"
          gap={24}
          justify="center"
          style={{
            "--card-gap": "24px",
            "@media (max-width: 768px)": {
              gap: "16px",
            },
          }}
        >
          {userTrips.map((trip) => (
            <CardComp key={trip.id} trip={trip} />
          ))}
        </Flex>
      )}

      {/* Закреплённая кнопка Back */}
      <Affix
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            borderRadius: 8,
            background: "#1677ff",
            color: "#fff",
            border: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#0958d9",
              transform: "scale(1.05)",
            },
          }}
        >
          Back
        </Button>
      </Affix>
    </Flex>
  );
};

export default UserTrips;
