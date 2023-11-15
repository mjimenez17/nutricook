import Grid from '@mui/material/Unstable_Grid2';

import Sugerencias from './Sugerencias/Sugerencias';
import MenuPantallaPrincipal from './MenuPantallaPrincipal/MenuPantallaPrincipal';

import './Inicio.css';

const Inicio = () => {
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Sugerencias></Sugerencias>
      </Grid>
      <Grid xs={12}>
        <MenuPantallaPrincipal></MenuPantallaPrincipal>
      </Grid>
    </Grid>
  );
};

export default Inicio;
