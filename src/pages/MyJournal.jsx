import React, { useEffect, useState } from "react";
import { useTrips } from "../hooks/useTrips";
import { useUser } from "../hooks/useUsers";
import { Typography, Spin, Button, Flex, Empty } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import AddTripModal from "../modal/AddTrip";
import CardComp from "../components/CardComp";

const { Title, Text } = Typography;

export default function MyJournal() {
  const user = useUser((state) => state.user);
  const { userTrips, handleLoading, fetchUserTrips, deleteTrip } = useTrips(
    (state) => state
  );
  const [addTripVisible, setAddTripVisible] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      fetchUserTrips(user.userId);
    }
  }, [user?.userId, fetchUserTrips]);

  const openAddTripModal = () => setAddTripVisible(true);
  const closeAddTripModal = () => setAddTripVisible(false);

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
        ✈️ My Journal
      </Title>
      <Text
        type="secondary"
        style={{ display: "block", textAlign: "center", marginBottom: 32 }}
      >
        Welcome back, <b>{user?.login}</b>!
      </Text>

      {handleLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
        >
          <Spin size="large">
            <br />
            <div style={{ padding: "50px" }}>Loading your trips...</div>
          </Spin>
        </div>
      ) : userTrips.length === 0 ? (
        <Flex justify="center" style={{ marginTop: 50 }}>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            description={
              <Text type="secondary">
                <Title level={4} style={{ color: "#8c8c8c" }}>
                  No trips yet
                </Title>
                Start your travel journey by adding your first trip!
              </Text>
            }
          >
            <Button type="primary" size="large" onClick={openAddTripModal}>
              Create Your First Trip
            </Button>
          </Empty>
          <AddTripModal open={addTripVisible} onClose={closeAddTripModal} />
        </Flex>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Button
              icon={<SettingOutlined />}
              type={settingsMode ? "default" : "primary"}
              onClick={() => setSettingsMode(!settingsMode)}
              style={{
                borderRadius: 8,
                padding: "0 20px",
                height: 40,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                background: settingsMode ? "#fff" : "#1677ff",
                border: settingsMode ? "1px solid #d9d9d9" : "none",
                color: settingsMode ? "#000" : "#fff",
                "&:hover": {
                  background: settingsMode ? "#f0f0f0" : "#0958d9",
                  transform: "scale(1.05)",
                },
              }}
            >
              {settingsMode ? "Exit Settings" : "Settings Mode"}
            </Button>
          </div>

          <Flex wrap="wrap" gap={16} justify="center">
            {userTrips.map((trip) => (
              <CardComp key={trip.id} trip={trip} settingsMode={settingsMode} />
            ))}
          </Flex>
        </>
      )}
    </div>
  );
}
