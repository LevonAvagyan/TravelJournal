import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUsers";
import { toast } from "react-hot-toast";


export default function AuthForm() {
  const navigate = useNavigate();

  const {
    user,
    login,
    register,
    loginVisible,
    setLoginVisible,
    registerVisible,
    setRegisterVisible,
    loading,
  } = useUser((state) => state);

  return (
    <>
      {/* ------------------ Login ------------------ */}
      <Modal
        title="Login"
        open={loginVisible}
        onCancel={() => setLoginVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async (values) => {
            console.log("Login attempt with:", values);
            const loggedInUser = await login(values.username, values.password);
            console.log("Login result:", loggedInUser);

            if (loggedInUser) {
              toast.success(`Welcome back, ${values.username}!`);
              navigate("/my-journal");
              setLoginVisible(false);
            } else {
              toast.error("Invalid username or password");
            }
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>

          <Button
            type="link"
            onClick={() => {
              setLoginVisible(false);
              setRegisterVisible(true);
            }}
          >
            Register
          </Button>
        </Form>
      </Modal>

      {/* ------------------ Register ------------------ */}
      <Modal
        title="Register"
        open={registerVisible}
        onCancel={() => setRegisterVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async (values) => {
            const result = await register(values.username, values.password);

            if (result && !result.error) {
              toast.success(
                `Account created successfully! Welcome, ${values.username}!`
              );
              navigate("/my-journal");
              setRegisterVisible(false);
            } else {
              toast.error(result?.message || "Registration failed");
            }
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
