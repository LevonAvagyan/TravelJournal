import React, { useState } from "react";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadToImgBB } from "../services/imgBBUpload";

const ImageUpload = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const url = await uploadToImgBB(file);
      onChange(url);
      message.success("Image uploaded successfully!");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload
  };

  return (
    <div>
      {value ? (
        <div>
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              marginBottom: "8px",
            }}
          />
          <Button onClick={() => onChange("")}>Remove</Button>
        </div>
      ) : (
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            Upload Image
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;
