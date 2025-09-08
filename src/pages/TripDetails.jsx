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
  Avatar,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

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
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>

      <Card
        variant="filled"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Заголовок */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <Title level={2} style={{ margin: 0 }}>
            {currentTrip.title}
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            <EnvironmentOutlined
              style={{ marginRight: "6px", color: "#1890ff" }}
            />
            {currentTrip.location}
          </Text>
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
          <div>
            <CalendarOutlined
              style={{ marginRight: "8px", color: "#1890ff" }}
            />
            <Text strong>Date: </Text>
            <Text>{currentTrip.date}</Text>
          </div>

          {/* Автор */}
          <div>
            <UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
            <Text strong>Author: </Text>
            {selectedUser ? (
              <Space>
                <Avatar>{selectedUser.login?.[0]?.toUpperCase()}</Avatar>
                <Text>{selectedUser.login}</Text>
                {/* <Button
                  type="link"
                  onClick={() => navigate(`/users/${currentTrip.userId}`)}
                  style={{ padding: 0 }}
                >
                  View Profile
                </Button> */}
              </Space>
            ) : (
              <Tag color="blue">User {currentTrip.userId}</Tag>
            )}
            {user?.userId === currentTrip.userId && (
              <Tag color="green" style={{ marginLeft: "8px" }}>
                You
              </Tag>
            )}
          </div>

          <div>
            <IdcardOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
            <Text strong>Trip ID: </Text>
            <Text>{currentTrip.id}</Text>
          </div>
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
    </div>
  );
};

export default TripDetails;
