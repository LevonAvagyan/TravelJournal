import React, { useState } from "react";
import { Modal, Button, Upload, message, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUser } from "../hooks/useUsers";
import { uploadToImgBB } from "../services/imgBBUpload";

const { Dragger } = Upload;

export default function UploadAvatar({ open, onClose }) {
  const { updateUserAvatar } = useUser();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file) => {
    setLoading(true);
    setProgress(0);

    try {
      const url = await uploadToImgBB(file);
      await updateUserAvatar(url);
      message.success("Avatar uploaded successfully!");
      onClose();
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }

    return false; 
  };

  return (
    <Modal
      title="Upload Profile Photo"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Dragger
        name="avatar"
        accept="image/*"
        multiple={false}
        beforeUpload={handleUpload}
        showUploadList={false}
        disabled={loading}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p>Click or drag file to upload</p>
        <p>Support for JPG, PNG, GIF; max 32MB</p>
      </Dragger>

      {loading && (
        <div style={{ marginTop: 16 }}>
          <Progress percent={progress} size="small" />
        </div>
      )}
    </Modal>
  );
}
