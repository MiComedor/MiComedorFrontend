import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { cards } from "../../pages/ProfilePage";
import "./Profile.css";
import NotasProfile from "./NotasProfile";

const Profile: React.FC = () => {
  const [selectedCard, setSelectedCard] = React.useState(0);

  return (
    <>
      {/* Tarjetas en grid */}
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
                <Typography className="card-title-modules">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Componente de notas (fuera del grid) */}
      <Box mt={4}>
        <NotasProfile />
      </Box>
    </>
  );
};

export default Profile;
