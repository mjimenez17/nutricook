import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import Typography from '@mui/material/Typography';

const BarraPrincipal = () => {
  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <DinnerDiningIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            NutriCook App
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default BarraPrincipal;
