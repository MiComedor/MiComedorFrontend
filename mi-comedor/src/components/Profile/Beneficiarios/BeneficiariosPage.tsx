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
              width: "80%",
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
<Dialog
  open={openDialog}
  onClose={handleClose}
  fullWidth
  maxWidth="sm"
  scroll="body"
  PaperProps={{
    sx: {
      width: "100%",
      maxWidth: 400, // 👈 ancho personalizado
      mx: "auto",
      borderRadius: 2,
      overflow: "hidden",
      backgroundColor: "#E4FAA4",
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: "#E4FAA4",
      fontWeight: "bold",
      fontSize: 24,
      pb: 0,
    }}
  >
    Añadir pensionista
  </DialogTitle>

  <DialogContent
    sx={{
      backgroundColor: "#E4FAA4",
      overflow: "visible",
      px: 0,
      pt: 0,
      pb: 3,
    }}
  >
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Formulario enviado");
      }}
    >
      <Box
        sx={{
          width: "80%",
          maxWidth: 500,
          mx: "auto",
          px: 3,
          py: 2,
          backgroundColor: "#E4FAA4",
        }}
      >
        <Stack spacing={3}>
          {[
            { name: "nombre", label: "Nombre completo" },
            { name: "edad", label: "Edad", type: "number" },
            { name: "dni", label: "DNI" },
            { name: "observaciones", label: "Observaciones", multiline: true, rows: 2 },
          ].map((field) => (
            <Box key={field.name}>
              <label className="titulo-arriba-form">{field.label}</label>
              <TextField
                name={field.name}
                variant="outlined"
                fullWidth
                required
                type={field.type || "text"}
                multiline={field.multiline || false}
                rows={field.rows || undefined}
                InputProps={{
                  sx: {
                    backgroundColor: "#fff",
                    borderRadius: "15px",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                    border: "none",
                  },
                }}
              />
            </Box>
          ))}

          <Stack direction="row" justifyContent="space-around" mt={2}>
            <Button
              type="button"
              onClick={handleClose}
              sx={{
                backgroundColor: "red",
                color: "white",
                width: 60,
                height: 60,
                borderRadius: 1,
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              <CloseIcon sx={{ fontSize: 36 }} />
            </Button>

            <Button
              type="submit"
              sx={{
                backgroundColor: "#1976D2",
                color: "white",
                width: 60,
                height: 60,
                borderRadius: 1,
                "&:hover": { backgroundColor: "#0d47a1" },
              }}
            >
              <CheckIcon sx={{ fontSize: 36 }} />
            </Button>
          </Stack>
        </Stack>
      </Box>
    </form>
  </DialogContent>
</Dialog>



      </Box>
  );
};

export default BeneficiariosPage;
