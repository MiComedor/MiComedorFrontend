import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { cards } from "../../pages/ProfileCards";
import "./Profile.css";
import NoteService from "../../services/note.service";
import Note from "../../types/note.type";
import NotasProfile from "./NotasProfileComponent/NotasProfile";

const Profile: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(0);

  const initialNoteState: Note = {
    noteText: "",
    users: undefined,
  };
  const [note, setNote] = useState<Note>(initialNoteState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNote({ ...note, noteText: value });
  };

  const saveNote = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      console.warn("⚠️ Usuario no encontrado. No se puede guardar la nota.");
      return;
    }

    const userId = user.idUser;

    if (!note.noteText.trim()) {
      console.warn("Nota vacía. Cancelando guardado.");
      return;
    }

    console.log("💾 Guardando nota con user_id:", userId);

    NoteService.insertarNota({
      noteText: note.noteText,
      users: { idUser: userId }, // 👈 Cambiado a `users` (array)
    })

      .then((response) => {
        console.log("✅ Nota guardada:", response);
        setNote({ noteText: "" });
      })
      .catch((e) => {
        console.error("❌ Error al guardar nota:", e);
      });
  };

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

      {/* Componente de notas solo si se selecciona la tarjeta "Notas" */}
      <Box mt={4}>
        <NotasProfile
          noteText={note.noteText}
          onChange={handleInputChange}
          onAdd={saveNote}
        />
      </Box>
    </>
  );
};

export default Profile;
