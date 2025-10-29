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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface NotaTransformada {
  idNote: number;
  noteText: string;
  userId: number;
}

const Profile: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(0);
  const navigate = useNavigate();

  const initialNoteState: Note = {
    noteText: "",
    users: undefined,
  };

  const [note, setNote] = useState<Note>(initialNoteState);
  const [notasList, setNotasList] = useState<NotaTransformada[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);

  // 🔧 Edit dialog: guardamos texto ORIGINAL y actual para detectar cambios
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    idNote: number;
    text: string;
    originalText: string;
  } | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
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
        const transformadas = notas.map((n) => ({
          idNote: n.idNote,
          noteText: n.noteTextByUser,
          userId: n.userId ?? 0,
        }));

        setNotasList(transformadas);
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
      .then(() => {
        setNote({ noteText: "" });
        getNotas();
        showSnackbar("Nota guardada correctamente", "success");
      })
      .catch((e) => {
        console.error("❌ Error al guardar nota:", e);
        showSnackbar("Error al guardar nota", "error");
      });
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteNoteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteNoteId(null);
  };

  const confirmDeleteNote = () => {
    if (deleteNoteId !== null) {
      NoteService.eliminarNota(deleteNoteId)
        .then(() => {
          getNotas();
          handleCloseDeleteDialog();
          // 👀 mejor como "success" al eliminar correctamente
          showSnackbar("Nota eliminada correctamente", "success");
        })
        .catch((error) => {
          console.error(
            `❌ Error al eliminar nota con ID ${deleteNoteId}:`,
            error
          );
          handleCloseDeleteDialog();
          showSnackbar("Error al eliminar nota", "error");
        });
    }
  };

  // 🔧 Abrir diálogo de edición guardando el texto original
  const handleOpenEditDialog = (idNote: number, text: string) => {
    setEditingNote({ idNote, text, originalText: text });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingNote(null);
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (editingNote) {
      setEditingNote({ ...editingNote, text: event.target.value });
    }
  };

  const saveEditedNote = async () => {
    if (!editingNote) return;

    const hasChanges =
      editingNote.text.trim() !== editingNote.originalText.trim();

    // ⚠️ Si no hay cambios, mostramos info y no guardamos
    if (!hasChanges) {
      showSnackbar("No hay cambios para guardar.", "info");
      return;
    }

    if (editingNote.text.trim() && typeof editingNote.idNote === "number") {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      try {
        if (!user) {
          showSnackbar(
            "Sesión expirada. Por favor, inicia sesión de nuevo.",
            "error"
          );
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
        setEditingNote(null);
        getNotas();
      } catch (error) {
        console.error(
          `❌ Error al actualizar nota con ID ${editingNote?.idNote}:`,
          error
        );
        showSnackbar("Error al actualizar nota", "error");
        handleCloseEditDialog();
      }
    } else {
      showSnackbar("Error: No se pudo identificar la nota a editar.", "error");
      handleCloseEditDialog();
    }
  };

  // 🔧 Computamos si hay cambios para controlar el color del botón Guardar
  const isEditDirty =
    editingNote &&
    editingNote.text.trim() !== editingNote.originalText.trim();

  const isEditInvalid = editingNote ? editingNote.text.trim().length === 0 : true;

  return (
    <>
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

      <Box mt={4}>
        <NotasProfile
          noteText={note.noteText}
          onChange={handleInputChange}
          onAdd={saveNote}
        />
      </Box>

      <Box mt={2} className="notas-list-container">
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{ paddingLeft: "20px" }}
        >
          Mis anotaciones
        </Typography>

        {notasList.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
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
                  {nota.noteText}
                </Typography>

                <Box>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleOpenEditDialog(nota.idNote, nota.noteText)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(nota.idNote)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Diálogo de eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>¿Estás seguro de eliminar esta nota?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción no se puede deshacer. Una vez eliminada, no podrás
            recuperar la nota.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={confirmDeleteNote} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar nota</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              autoFocus
              margin="dense"
              label="Texto de la nota"
              type="text"
              fullWidth
              value={editingNote?.text || ""}
              onChange={handleEditInputChange}
              variant="outlined"
              multiline
              rows={4}
            />
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={handleCloseEditDialog} color="error">
                Cancelar
              </Button>
              <Button
                onClick={saveEditedNote}
                variant="contained"
                disabled={!isEditDirty || isEditInvalid}
                sx={{
                  backgroundColor:
                    !isEditDirty || isEditInvalid ? "#bdbdbd" : "#F57C00",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor:
                      !isEditDirty || isEditInvalid ? "#bdbdbd" : "#ef6c00",
                    cursor:
                      !isEditDirty || isEditInvalid
                        ? "not-allowed"
                        : "pointer",
                  },
                  transition: "background-color 0.2s ease-in-out",
                }}
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
