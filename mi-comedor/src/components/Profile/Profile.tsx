import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { cards } from "../../pages/ProfileCards";
import "./Profile.css";
import NoteService from "../../services/note.service";
import Note from "../../types/note.type";
import NotasProfile from "./Notas/NotasProfile";
import NoteByUserId from "../../types/noteByUserId";

const Profile: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const navigate = useNavigate();

  const initialNoteState: Note = {
    noteText: "",
    users: undefined,
  };

  const [note, setNote] = useState<Note>(initialNoteState);
  const [notasList, setNotasList] = useState<NoteByUserId[]>([]); // ✅ Añadido

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNote({ ...note, noteText: value });
  };

  const getNotas = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    NoteService.buscarNotaPorUserId(user.idUser)
      .then((notas) => {
        setNotasList(notas);
      })
      .catch((error) => {
        console.error("❌ Error al obtener notas:", error);
      });
  };

  useEffect(() => {
    getNotas(); // ✅ Llamar al cargar componente
  }, []);

  const saveNote = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!note.noteText.trim()) {
      console.warn("Nota vacía. Cancelando guardado.");
      return;
    }

    NoteService.insertarNota({
      noteText: note.noteText,
      users: { idUser: user.idUser },
    })
      .then((response) => {
        console.log("✅ Nota guardada:", response);
        setNote({ noteText: "" });
        getNotas(); // ✅ Refrescar lista después de guardar
      })
      .catch((e) => {
        console.error("❌ Error al guardar nota:", e);
      });
  };

  return (
    <>
      {/* Tarjetas principales */}
      <Box className="profile-container">
        {cards.map((card, index) => (
          <Card key={card.id} className="card-button">
            <CardActionArea
              onClick={() => {
                setSelectedCard(index);
                if (card.route) {
                  navigate(card.route);
                }
              }}
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

      {/* Formulario para escribir nota */}
      <Box mt={4}>
        <NotasProfile
          noteText={note.noteText}
          onChange={handleInputChange}
          onAdd={saveNote}
        />
      </Box>

      {/* Lista de notas */}
      <Box mt={2} className="notas-list-container">
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Mis anotaciones
        </Typography>

        {[...notasList].reverse().map((nota, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                className="card-nota-list"
                fontWeight="bold"
                fontStyle="italic"
              >
                {nota.noteTextByUser}
              </Typography>
              <Box>
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default Profile;
