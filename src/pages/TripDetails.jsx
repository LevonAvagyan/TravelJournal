import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTrips } from "../hooks/useTrips";
import { useUser } from "../hooks/useUsers";
import {
  Button,
  Card,
  Spin,
  Typography,
  Space,
  Tag,
  Image,
  Divider,
  Flex,
  Affix,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import Avatar from "../components/Avatar";

const { Title, Text, Paragraph } = Typography;

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, fetchTripById, tripLoading } = useTrips();
  const { user, selectedUser, fetchUserById } = useUser();

  useEffect(() => {
    if (id) {
      fetchTripById(id);
    }
  }, [id, fetchTripById]);

  useEffect(() => {
    if (currentTrip?.userId) {
      fetchUserById(currentTrip.userId);
    }
  }, [currentTrip?.userId, fetchUserById]);

  if (tripLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Trip not found</Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* Содержимое страницы */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Заголовок */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <Title level={2} style={{ margin: 0, color: "#1f1f1f" }}>
            {currentTrip.title}
          </Title>
        </div>

        {/* Картинка */}
        {currentTrip.image && (
          <Image
            src={currentTrip.image}
            alt={currentTrip.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            placeholder={
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#f0f2f5",
                  borderRadius: "8px",
                }}
              >
                <Spin size="large" />
              </div>
            }
          />
        )}

        <Divider />

        {/* Основная информация */}
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Flex align="center" gap={8}>
            <UserOutlined style={{ color: "#1890ff" }} />
            <Text strong>Author: </Text>
            {selectedUser ? (
              <Flex align="center" gap={8}>
                <Avatar user={selectedUser} />
                <Button
                  type="link"
                  onClick={() =>
                    user?.login === selectedUser?.login
                      ? navigate("/my-journal")
                      : navigate(`/user/${selectedUser.login}`)
                  }
                  style={{ padding: 0 }}
                >
                  {selectedUser.login}
                </Button>
                {user?.login === selectedUser?.login && (
                  <Flex>
                    <Tag color="green" style={{ marginLeft: "8px" }}>
                      You
                    </Tag>
                  </Flex>
                )}
              </Flex>
            ) : (
              <Tag color="blue">User {currentTrip.userId}</Tag>
            )}
          </Flex>

          <Flex align="center" gap={8}>
            <CalendarOutlined style={{ color: "#1890ff" }} />
            <Text strong>Date: </Text>
            <Text>{currentTrip.date}</Text>
          </Flex>

          <Flex align="center" gap={8}>
            <EnvironmentOutlined style={{ color: "#1890ff" }} />
            <Text strong>Location: </Text>
            <Text style={{ fontSize: "16px" }}>{currentTrip.location}</Text>
          </Flex>
        </Space>

        {/* Описание */}
        {currentTrip.description && (
          <>
            <Divider />
            <Title level={4}>Description</Title>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
              {currentTrip.description}
            </Paragraph>
          </>
        )}
      </Card>

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
    </div>
  );
};

export default TripDetails;
