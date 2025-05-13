import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import "./NotasProfile.css";

const NotasProfile: React.FC = () => {
  return (
    <Box className="notas-profile-container">
      <TextField label="Escribe tu nota" className="notas-input-custom" />
      <IconButton className="boton-verde">
        <AddIcon sx={{ fontSize: 42 }} />
      </IconButton>
    </Box>
  );
};

export default NotasProfile;
