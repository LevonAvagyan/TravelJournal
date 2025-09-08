import React, { useEffect } from "react";
import { useTrips } from "../hooks/useTrips";
import { Typography, Button, Flex, Spin,} from "antd";
import { useNavigate } from "react-router-dom";
import CardComp from "../components/CardComp";


function Home() {
  const { Title, Paragraph } = Typography;
  const { allTrips, handleLoading, fetchAllTrips } = useTrips((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTrips();
  }, [fetchAllTrips]);

  return (
    <>
      <div style={{ padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Title>Welcome to Travel Journal</Title>
          <Paragraph>
            Discover inspiring journeys from around the world or create your own
            travel journal.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/explore")}
          >
            Explore Trips
          </Button>
        </div>
      </div>

      <Flex wrap="wrap" gap={16} justify="center">
        {handleLoading ? (
          <Spin size="large">
            <br />
            <div style={{ padding: "50px" }}>Loading trips...</div>
          </Spin>
        ) : (
          allTrips.map(
            (trip, index) =>
              index < 3 && (
                <CardComp key={trip.id} trip={trip} />
              )
          )
        )}
      </Flex>
    </>
  );
}

export default Home;
