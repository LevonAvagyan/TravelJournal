import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Typography, Button, Empty, Flex } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTrips } from "../hooks/useTrips";
import { useUser } from "../hooks/useUsers";
import CardComp from "../components/CardComp";

const { Title, Text } = Typography;

const UserTrips = () => {
  const { login } = useParams();
  const navigate = useNavigate();
  const { fetchUserTrips, userTrips, handleLoading } = useTrips();
  const { fetchUserByLogin } = useUser();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    if (login) {
      fetchUserByLogin(login).then((user) => {
        if (user) {
          setAuthor(user);
          fetchUserTrips(user.userId);
        }
      });
    }
  }, [login]);

  return (
    <Flex
      vertical
      gap={32}
      style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* Верхняя панель */}
      <Flex align="center" gap={24}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>

        {author && (
          <Flex vertical>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              {author.login}
            </Title>
            <Text type="secondary">All trips by this user</Text>
          </Flex>
        )}
      </Flex>

      {/* Контент */}
      {handleLoading ? (
        <Flex justify="center" align="center" style={{ height: "40vh" }}>
          <Spin size="large" />
        </Flex>
      ) : userTrips.length === 0 ? (
        <Empty description="No trips found" />
      ) : (
        <Flex wrap="wrap" gap={20} justify="flex-start">
          {userTrips.map((trip) => (
            <CardComp key={trip.id} trip={trip} style={{ flex: "1 1 300px" }} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default UserTrips;
