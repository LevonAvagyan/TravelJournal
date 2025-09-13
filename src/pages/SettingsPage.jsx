import React, { useState } from "react";
import { useUser } from "../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import UploadAvatar from "../modal/UploadAvatar";
import { Typography, Button, Flex, Card, Form, Input,Tooltip } from "antd";
import Avatar from "../components/Avatar";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { user, updateUserProfile, fetchAllUsers, loading } = useUser();
  const [openUpload, setOpenUpload] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const getInitials = (login) => {
    return login
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onFinish = async (values) => {
    const { newLogin, newPassword } = values;
    const success = await updateUserProfile(newLogin, newPassword);
    if (success) {
      await fetchAllUsers(); 
      form.resetFields();
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        Please log in to view settings.
      </div>
    );
  }

  return (
    <Flex
      vertical
      gap={24}
      style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Profile Settings
      </Title>

      <Card
        style={{
          textAlign: "center",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Flex vertical align="center" gap={16}>
          <br />
          <Tooltip title="Upload Avatar" placement="top">
            <Button
              type="link"
              onClick={() => setOpenUpload(true)}
            >
              <Avatar
                user={user}
              size={80}
              style={{ backgroundColor: user.avatar ? undefined : "#1677ff" }}
            >
              {user.avatar ? null : getInitials(user.login)}
            </Avatar>
          </Button>
          </Tooltip>
          <Title level={3}>{user.login}</Title>
        </Flex>
      </Card>
     
      {/* Форма для изменения профиля */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: 16,
        }}
      >
        <Form
          form={form}
          name="profileUpdate"
          layout="vertical"
          initialValues={{ newLogin: user.login, newPassword: "" }}
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            name="newLogin"
            label="New Login"
            rules={[
              { required: true, message: "Please enter a new login" },
              { min: 4, message: "Login must be at least 4 characters" },
              { max: 16, message: "Login must be at most 16 characters" },
              {
                pattern: /^[A-Za-z0-9]+$/,
                message: "Login must contain only letters and numbers",
              },
            ]}
          >
            <Input placeholder="Enter new login" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 6, message: "Password must be at least 6 characters" },
              { max: 20, message: "Password must be at most 20 characters" },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <UploadAvatar open={openUpload} onClose={() => setOpenUpload(false)} />
    </Flex>
  );
}
