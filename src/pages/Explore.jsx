import React, { useEffect } from "react";
import { Flex, Spin} from "antd";
import { useTrips } from "../hooks/useTrips";
import CardComp from "../components/CardComp";


function Explore() {
  const { allTrips, handleLoading, fetchAllTrips } = useTrips((state) => state);

  useEffect(() => {
    fetchAllTrips();
  }, [fetchAllTrips]);

  return (
    <>
      <Flex wrap="wrap" gap={16} justify="center">
        {handleLoading ? (
          <Spin size="large">
            <br/>
            <div style={{ padding: "50px" }}>Loading trips...</div>
          </Spin>
        ) : (
          allTrips.map((trip) => (
           <CardComp key={trip.id} trip={trip} />
          ))
        )}
      </Flex>
    </>
  );
}

export default Explore;
