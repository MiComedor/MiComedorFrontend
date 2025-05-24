import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import BeneficiaryService from "../../../services/beneficiary.service";
import BeneficiaryByUserId from "../../../types/BeneficiaryByUserId";

const BeneficiariosPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [beneficiarios, setBeneficiarios] = useState<BeneficiaryByUserId[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;

    BeneficiaryService.buscarBeneficiaryPorUserId(user.idUser)
      .then(setBeneficiarios)
      .catch((err) => console.error("Error al cargar beneficiarios", err));
  }, []);

  const filtered = beneficiarios.filter((b) =>
    b.fullnameBenefeciary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Box sx={{ flex: 1 }}>
          <label className="titulo-arriba-form">Buscar</label>
          <TextField
            variant="outlined"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "black" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#AEE0FF",
                borderRadius: "20px",
                border: "2px solid black",
                height: "45px",
                paddingX: 2,
              },
            }}
            sx={{
              width: "100%",
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: "#00C300",
            color: "#000",
            fontWeight: "bold",
            px: 3,
            border: "3px solid black",
            "&:hover": { backgroundColor: "#00a700" },
          }}
          startIcon={<AddIcon />}
        >
          Añadir beneficiario
        </Button>
      </Stack>

      {/* 🟩 FORMULARIO EN MODAL */}
      
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle
          sx={{ backgroundColor: "#E4FAA4", fontWeight: "bold", fontSize: 24 }}
        >
          Añadir pensionista
        </DialogTitle>
        <Dialog
  open={openDialog}
  onClose={handleClose}
  PaperProps={{
    sx: {
      width: "100%",
      maxWidth: 600,
      backgroundColor: "#E4FAA4",
      borderRadius: 3,
      p: 2,
    },
  }}
>
          <Stack spacing={3} mt={1}>
            <Box>
              <label className="titulo-arriba-form">Nombre completo</label>
              <TextField
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                    border: "none",
                    outline: "none"
                  },
                }}
              />
            </Box>

            <Box>
              <label className="titulo-arriba-form">Edad</label>
              <TextField
                type="number"
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                    border: "none",
                    outline: "none"
                  },
                }}
              />
            </Box>

            <Box>
              <label className="titulo-arriba-form">DNI</label>
              <TextField
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                    border: "none",
                    outline: "none"
                  },
                }}
              />
            </Box>

            <Box>
              <label className="titulo-arriba-form">Observaciones</label>
              <TextField
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                    border: "none",
                    outline: "none"
                  },
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="space-around" mt={2}>
              <Button
                onClick={handleClose}
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#b71c1c" }
                }}
              >
                <CloseIcon sx={{ fontSize: 36 }} />
              </Button>
              <Button
                onClick={() => alert("Formulario enviado")}
                sx={{
                  backgroundColor: "#1976D2",
                  color: "white",
                  width: 6,
                  height: 60,
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "#0d47a1" }
                }}
              >
                <CheckIcon sx={{ fontSize: 36 }} />
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BeneficiariosPage;
