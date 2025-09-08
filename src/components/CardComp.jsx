import { Card, Image, Typography } from "antd";
import { useNavigate } from "react-router-dom";



export default function CardComp({ trip }) {
const navigate = useNavigate();

const handleCardClick = (tripId) => {
  navigate(`/trip/${tripId}`);
};

  return (
            <Card
            hoverable
            style={{ width: 240, height: 300 }}
            cover={
                <Image
                alt={trip.title}
            src={trip.image}
            height={160}
            style={{ objectFit: "cover" }}
            fallback="https://via.placeholder.com/240x160"
            preview={false}
            onClick={() => handleCardClick(trip.id)}
            />
        }
        >
        <Card.Meta
            title={
            <Typography.Text ellipsis={{ tooltip: trip.title }}>
                {trip.title}
            </Typography.Text>
            }
            description={
            <Typography.Paragraph
                ellipsis={{ rows: 3, tooltip: trip.description }}
                type="secondary"
                style={{ margin: 0, fontSize: "12px" }}
            >
                {trip.description}
            </Typography.Paragraph>
            }
        />
        </Card>);
}
