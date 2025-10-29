import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./App.css";
import LogoutIcon from "@mui/icons-material/Logout";
import ListSubheader from "@mui/material/ListSubheader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import * as AuthService from "./services/auth.service";
import IUser from "./types/user.type";
import AppRoutes from "./routes/routes";
import EventBus from "./components/common/EventBus";
const StyledListHeader = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  fontWeight: 700,
  fontSize: 12,
  lineHeight: "24px",
  color: theme.palette.text.secondary,
}));
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = useCallback(() => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate("/login");
  }, [navigate]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {currentUser && (
        <AppBar position="static" sx={{ backgroundColor: "#F57C00" }}>
          <Toolbar>
            <Box display="flex" alignItems="center">
              {/* en tu JSX */}
              <>
                <img
                  src="https://i.postimg.cc/4dsLbM1C/logo.jpg"
                  className="navbar-logo"
                  alt="Logo"
                  onClick={() => navigate("/profile")}
                />
                <img
                  src="https://i.postimg.cc/cHR9Zcgf/png-Mesa-de-trabajo-1-4x.png"
                  className="logo-mobile"
                  alt="LogoMobile"
                  onClick={() => navigate("/profile")}
                />
              </>

              <Typography
                className="navbar-title"
                variant="h4"
                component={Link}
                to="/profile"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                MiComedor
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" marginLeft="auto">
              <Typography
                className="name-user"
                sx={{ fontSize: "22px", marginRight: "10px" }}
              >
                {currentUser.name}
              </Typography>

              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
                className="cerrar-sesion-btn"
                onClick={handleClick}
                sx={{
                  ml: 2,
                  fontWeight: "bold",
                  backgroundColor: "#BF360C",
                  "&:hover": {
                    backgroundColor: "#e74c3c",
                  },
                }}
              >
                Cerrar sesión
              </Button>
              <Menu
                className="menu-cerrar-sesion"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                slotProps={{
                  list: {
                    "aria-labelledby": "options-button",
                    sx: { py: 0 },
                  },
                }}
              >
                <StyledListHeader>   ¿Quieres cerrar sesión?   </StyledListHeader>
                <MenuItem onClick={logOut}>     Sí</MenuItem>
                <MenuItem onClick={handleClose}>     No</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <AppRoutes />
    </div>
  );
};

export default App;
