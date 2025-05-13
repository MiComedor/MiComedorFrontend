import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { cards } from "../../pages/ProfilePage";
import "./Profile.css";
const Profile: React.FC = () => {
  const [selectedCard, setSelectedCard] = React.useState(0);
  return (
    <Box className="profile-container">
      {cards.map((card, index) => (
        <Card key={card.id} className="card-button">
          <CardActionArea
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? "true" : undefined}
            className="card-action"
          >
            <img
              src={card.image}
              alt={card.description}
              className="card-image"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default Profile;
