/*import React, { useState } from "react";
import NoteService from "../services/note.service";
import Note from "../types/note.type";
import NotasProfile from "../components/Profile/NotasProfileComponent/NotasProfile";

const AddNoteProfile: React.FC = () => {
  const initialNoteState: Note = {
    noteText: "",
  };

  const [note, setNote] = useState<Note>(initialNoteState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNote({ ...note, noteText: value });
  };

  const saveNote = () => {
    console.log("==> saveNote fue llamada");
    console.log("Contenido de nota:", note.noteText);

    if (!note.noteText.trim()) {
      console.warn("Nota vacía. Cancelando guardado.");
      return;
    }

    NoteService.insertarNota({ noteText: note.noteText })
      .then((response) => {
        console.log("✅ Nota guardada:", response);
        setNote({ noteText: "" });
      })
      .catch((e) => {
        console.error("❌ Error al guardar nota:", e);
      });
  };

  return (
    <NotasProfile
      noteText={note.noteText}
      onChange={(e) => {
        console.log("Cambió el input:", e.target.value);
        handleInputChange(e);
      }}
      onAdd={() => {
        console.log("Click en botón +");
        saveNote();
      }}
    />
  );
};

export default AddNoteProfile;




*/