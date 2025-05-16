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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Profile: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const navigate = useNavigate();

  const initialNoteState: Note = {
    noteText: "",
    users: undefined,
  };

  const [note, setNote] = useState<Note>(initialNoteState);
  const [notasList, setNotasList] = useState<NoteByUserId[]>([]);
  
  // Estado para manejar el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  
  // Estado para manejar el diálogo de edición
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<{ idNote: number; text: string } | null>(null);
  
  // Estado para manejar notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning"
  });

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
        console.log("Notas recibidas:", notas); // Depurar lo que devuelve el backend
        setNotasList(notas);
      })
      .catch((error) => {
        console.error("❌ Error al obtener notas:", error);
        showSnackbar("Error al cargar notas", "error");
      });
  };

  useEffect(() => {
    getNotas();
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
        getNotas();
        showSnackbar("Nota guardada correctamente", "success");
      })
      .catch((e) => {
        console.error("❌ Error al guardar nota:", e);
        showSnackbar("Error al guardar nota", "error");
      });
  };

  // Función para mostrar notificaciones
  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  // Función para abrir el diálogo de confirmación de eliminación
  const handleOpenDeleteDialog = (id: number) => {
    console.log("ID de nota a eliminar:", id); // Depurar el ID que se está pasando
    setDeleteNoteId(id);
    setOpenDeleteDialog(true);
  };

  // Función para cerrar el diálogo de confirmación de eliminación
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteNoteId(null);
  };

  // Función para confirmar la eliminación de la nota
  const confirmDeleteNote = () => {
    if (deleteNoteId !== null) {
      console.log(`Intentando eliminar nota con ID: ${deleteNoteId}`);
      
      NoteService.eliminarNota(deleteNoteId)
        .then(() => {
          console.log(`✅ Nota con ID ${deleteNoteId} eliminada correctamente`);
          getNotas(); // Actualizar la lista de notas
          handleCloseDeleteDialog();
          showSnackbar("Nota eliminada correctamente", "success");
        })
        .catch((error) => {
          console.error(`❌ Error al eliminar nota con ID ${deleteNoteId}:`, error);
          handleCloseDeleteDialog();
          showSnackbar("Error al eliminar nota", "error");
        });
    }
  };

  // Función para abrir el diálogo de edición
  const handleOpenEditDialog = (idNote: number, text: string) => {
    console.log("ID de nota a editar:", idNote); // Depurar el ID que se está pasando
    setEditingNote({ idNote, text });
    setOpenEditDialog(true);
  };

  // Función para cerrar el diálogo de edición
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingNote(null);
  };

  // Función para manejar el cambio en el campo de texto de edición
  const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingNote) {
      setEditingNote({ ...editingNote, text: event.target.value });
    }
  };

  // Función para guardar los cambios de la nota editada
  const saveEditedNote = async () => {
    if (editingNote && editingNote.text.trim() && typeof editingNote.idNote === "number") {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
  
      try {
        if (!user) {
          showSnackbar("Sesión expirada. Por favor, inicia sesión de nuevo.", "error");
          handleCloseEditDialog();
          return;
        }
        await NoteService.actualizarNota({
          idNote: editingNote.idNote,
          noteText: editingNote.text,
          users: { idUser: user.idUser },
        });
        showSnackbar("Nota actualizada correctamente", "success");
        handleCloseEditDialog();
        getNotas(); // Asegura que la lista se refresca después de cerrar el diálogo
      } catch (error) {
        console.error(`❌ Error al actualizar nota con ID ${editingNote?.idNote}:`, error);
        if ((error as any)?.response?.status === 401) {
          showSnackbar("No autorizado. Por favor, inicia sesión de nuevo.", "error");
        } else {
          showSnackbar("Error al actualizar nota", "error");
        }
        handleCloseEditDialog();
      }
    } else {
      showSnackbar("Error: No se pudo identificar la nota a editar.", "error");
      handleCloseEditDialog();
    }
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

        {notasList.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No tienes notas guardadas. ¡Crea una nueva arriba!
          </Typography>
        ) : (
          [...notasList].reverse().map((nota, index) => (
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
                  <IconButton 
                    color="primary"
                    onClick={() => {
                      handleOpenEditDialog(nota.idNote, nota.noteTextByUser);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => {
                      handleOpenDeleteDialog(nota.idNote);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Diálogo de confirmación para eliminar nota */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro de eliminar esta nota?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer. Una vez eliminada, no podrás recuperar la nota.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteNote} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar nota */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar nota</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="note-edit"
            label="Texto de la nota"
            type="text"
            fullWidth
            value={editingNote?.text || ""}
            onChange={handleEditInputChange}
            variant="outlined"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={saveEditedNote} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;