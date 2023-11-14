import { createTheme, ThemeProvider } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import CssBaseline from '@mui/material/CssBaseline';

import BarraPrincipal from './componentes/BarraPrincipal';
import Sugerencias from './componentes/Sugerencias/Sugerencias';

import './App.css';

function App() {

  const defaultTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#00695c',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <BarraPrincipal></BarraPrincipal>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <Sugerencias></Sugerencias>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
