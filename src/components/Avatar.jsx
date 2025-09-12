import React from "react";
import { Avatar as AntAvatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Avatar = ({ user, size = 32, ...props }) => {
  const getInitials = (login) => login?.charAt(0)?.toUpperCase() || "?";

  return (
    <AntAvatar
      size={size}
      src={user?.avatar}
      icon={!user?.avatar && <UserOutlined />}
      {...props}
      style={{
        backgroundColor: user?.avatar ? "transparent" : "#1890ff",
        ...props.style,
      }}
    >
      {user?.avatar ? null : getInitials(user?.login)}
    </AntAvatar>
  );
};

export default Avatar;
