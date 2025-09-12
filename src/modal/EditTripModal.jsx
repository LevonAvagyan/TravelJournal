import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button } from "antd";
import ImageUpload from "../components/ImageUpload";
import { useTrips } from "../hooks/useTrips";
import dayjs from "dayjs";
import toast from "react-hot-toast";

export default function EditTripModal({ open, onClose, trip }) {
  const { editTrip, handleLoading } = useTrips((state) => state);
  const [form] = Form.useForm();

  useEffect(() => {
    if (trip) {
      form.setFieldsValue({
        title: trip.title,
        location: trip.location,
        date: trip.date ? dayjs(trip.date) : dayjs(),
        image: trip.image,
        description: trip.description,
      });
    }
  }, [trip, form]);

  const onFinish = async (values) => {
    try {
      const editedTrip = {
        ...trip,
        ...values,
        date: values.date ? values.date.toISOString() : trip.date,
      };
      await editTrip(trip.id, editedTrip);
      toast.success("Trip updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update trip");
    }
  };

  return (
    <Modal
      title="Edit Trip"
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
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
