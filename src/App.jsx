import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import BarraPrincipal from './componentes/BarraPrincipal/BarraPrincipal';
import Inicio from './componentes/Inicio/Inicio';
import Recetas from './componentes/Recetas/Recetas';
import DetallesReceta from './componentes/Recetas/DetallesReceta/DetallesReceta';
import MisRecetas from './componentes/MisRecetas/MisRecetas';

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
        <BrowserRouter>
          <BarraPrincipal></BarraPrincipal>
          <Box sx={{ flexGrow: 1 }} className="contenedor">
            <Routes>
              <Route path="/" exact element={<Inicio></Inicio>} />
              <Route path="/recetas" element={<Recetas></Recetas>} />
              <Route
                path="/receta/:idReceta"
                element={<DetallesReceta></DetallesReceta>}
              />
              <Route path="/mis-recetas" element={<MisRecetas></MisRecetas>} />
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
