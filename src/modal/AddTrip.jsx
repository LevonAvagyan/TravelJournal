import React from "react";
import ImageUpload from "../components/ImageUpload";
import { Modal, Form, Input, DatePicker, Button } from "antd";
import { useTrips } from "../hooks/useTrips";
import { useUser } from "../hooks/useUsers";
import dayjs from "dayjs";

export default function AddTripModal({ open, onClose }) {
  const user = useUser((state) => state.user);
  const { addTrip, handleLoading } = useTrips((state) => state);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await addTrip(values, user?.userId);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Failed to add trip:", error);
    }
  };

  return (
    <Modal
      title="Add New Trip"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ date: dayjs() }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Enter trip title" }]}
        >
          <Input placeholder="E.g., Trip to Paris" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Enter location" }]}
        >
          <Input placeholder="E.g., France" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Select date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <ImageUpload />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Enter description" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Write your trip experience..."
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={handleLoading}
          >
            Add Trip
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}