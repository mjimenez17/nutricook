import { Link, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import HomeRounded from "@mui/icons-material/HomeRounded";
import LogoutIcon from "@mui/icons-material/Logout";

import "./BarraPrincipal.css";

const BarraPrincipal = () => {
  const location = useLocation();

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <DinnerDiningIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            NutriCook App
          </Typography>
          <div style={{ flex: "1 1 auto" }}></div>
          {location.pathname !== "/" && (
            <div>
              <Link to="/" style={{ color: "inherit" }}>
                <IconButton size="large" color="inherit">
                  <HomeRounded />
                </IconButton>
              </Link>
            </div>
          )}
          {!["/inicia-sesion", "/registro"].includes(location.pathname) && (
            <div>
              <Link to="/cierra-sesion" style={{ color: "inherit" }}>
                <IconButton size="large" color="inherit">
                  <LogoutIcon />
                </IconButton>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default BarraPrincipal;
