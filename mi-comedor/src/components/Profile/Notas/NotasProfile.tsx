import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import "./NotasProfile.css";

interface NotasProfileProps {
  noteText: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}

const NotasProfile: React.FC<NotasProfileProps> = ({
  noteText,
  onChange,
  onAdd,
}) => {
  return (
    <Box className="notas-profile-container">
      <TextField
        label="Escribe tu nota"
        value={noteText}
        onChange={onChange}
        className="notas-input-custom"
      />
      
      <IconButton
        className="boton-verde"
        onClick={() => {
          console.log("Botón presionado");
          onAdd();
        }}
      >
        <AddIcon sx={{ fontSize: 42 }} />
      </IconButton>
    </Box>

    
  );
};

export default NotasProfile;
