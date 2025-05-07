import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./App.css";
import LogoutIcon from "@mui/icons-material/Logout";

import * as AuthService from "./services/auth.service";
import IUser from "./types/user.type";
import AppRoutes from "./routes/routes";
import EventBus from "./components/common/EventBus";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

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
  };

  return (
    <div>
      {currentUser && (
        <AppBar position="static" sx={{ backgroundColor: "#F57C00" }}>
          <Toolbar>
            <Box display="flex" alignItems="center">
              <img
                src="https://i.postimg.cc/4dsLbM1C/logo.jpg"
                alt="Logo"
                className="welcome-logo"
              />
              <Typography
                variant="h4"
                component={Link}
                to="/"
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
              <Typography sx={{ fontSize: "22px", marginRight: "10px" }}>
                {currentUser.username}
              </Typography>

              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
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
