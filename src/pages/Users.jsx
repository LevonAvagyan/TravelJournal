import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Card, Typography, Flex, Spin, Empty } from "antd";
import { useUser } from "../hooks/useUsers";
import Avatar from "../components/Avatar";

const { Title } = Typography;

const Users = () => {
  const navigate = useNavigate();
  const { fetchAllUsers, searchUsers } = useUser();
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAllUsers().then((users) => {
      setFiltered(users);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const result = searchUsers(query);
      setFiltered(result);
    }, 400);

    return () => clearTimeout(delay);
  }, [query, searchUsers]);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: 20 }}>
        Users
      </Title>

      <Input
        placeholder="Search users by login..."
        allowClear
        size="large"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 20, borderRadius: 8 }}
      />

      {loading ? (
        <Flex align="center" justify="center" style={{ height: "50vh" }}>
          <Spin size="large" />
        </Flex>
      ) : filtered.length === 0 ? (
        <Empty description="No users found" />
      ) : (
        <Flex wrap gap="20px" justify="flex-start">
          {filtered.map((user) => (
            <Card
              key={user.userId}
              hoverable
              style={{
                width: 200,
                textAlign: "center",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onClick={() => navigate(`/user/${user.login}`)}
            >
              <Avatar user={user} size={60} style={{ margin: "0 auto 10px" }} />
              <Title level={4} style={{ margin: 0 }}>
                {user.login}
              </Title>
            </Card>
          ))}
        </Flex>
      )}
    </div>
  );
};

export default Users;
