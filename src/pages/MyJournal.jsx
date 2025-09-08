import React, { useEffect, useState } from "react";
import { useTrips } from "../hooks/useTrips";
import { useUser } from "../hooks/useUsers";
import { Typography, Spin, Button ,Flex } from "antd"; 
import AddTripModal from "../components/AddTrip"; 
import CardComp from "../components/CardComp";

const { Title, Text } = Typography;

export default function MyJournal() {
  const user = useUser((state) => state.user);
  const { userTrips, handleLoading, fetchUserTrips } = useTrips(
    (state) => state
  );
  const [addTripVisible, setAddTripVisible] = useState(false); 

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
            <br/>
            <div style={{ padding: "50px" }}>Loading your trips...</div>
          </Spin>
        </div>
      ) : userTrips.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 50,
            padding: 40,
            border: "2px dashed #d9d9d9",
            borderRadius: 8,
          }}
        >
          <Title level={4} style={{ color: "#8c8c8c" }}>
            📝 No trips yet
          </Title>
          <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
            Start your travel journey by adding your first trip!
          </Text>
          <Button
            type="primary"
            size="large"
            onClick={openAddTripModal} 
          >
            Create Your First Trip
          </Button>

          <AddTripModal visible={addTripVisible} onClose={closeAddTripModal} />
        </div>
      ) : (
        <>
          <Flex wrap="wrap" gap={16} justify="center">
            {userTrips.map((trip) => (
              <CardComp key={trip.id} trip={trip} />
            ))}
          </Flex>
        </>
      )}
    </div>
  );
}
