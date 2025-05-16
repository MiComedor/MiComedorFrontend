import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./App.css";
import LogoutIcon from "@mui/icons-material/Logout";

import * as AuthService from "./services/auth.service";
import IUser from "./types/user.type";
import AppRoutes from "./routes/routes";
import EventBus from "./components/common/EventBus";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const navigate = useNavigate();

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

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate("/login");
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
                onClick={logOut}
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
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <AppRoutes />
    </div>
  );
};

export default App;
