import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import './MisRecetas.css';

const MisRecetas = () => {
  const [muestraIndicadorCarga, estableceIndicadorCarga] = useState(true);
  const [errorCarga, estableceErrorCarga] = useState(null);
  const [recetas, estableceRecetas] = useState([]);

  const recuperaFavoritosGuardados = () => {
    const favoritosGuardados = localStorage.getItem('NutriCook')
      ? JSON.parse(localStorage.getItem('NutriCook'))
      : { favoritos: [] };
    return favoritosGuardados.favoritos;
  };

  useEffect(() => {
    if (muestraIndicadorCarga) {
      (async () => {
        try {
          const consultas = [];
          const recetasFavoritasGuardadas = recuperaFavoritosGuardados();
          recetasFavoritasGuardadas.map((idRecetaFavorita) => {
            consultas.push(
              fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idRecetaFavorita}`
              )
                .then((r) => r.json())
                .then((rj) => rj.meals[0])
            );
          });
          const [...recetasObtenidas] = await Promise.all(consultas);
          if (recetasFavoritasGuardadas.length === recetasObtenidas.length) {
            estableceRecetas(recetasObtenidas);
            estableceIndicadorCarga(false);
          } else {
            estableceErrorCarga('No fue posible recuperar las recetas.');
          }
        } catch (error) {
          console.error(error);
          estableceErrorCarga('Ocurrió un error inesperado.');
        }
      })();
    }
  }, [muestraIndicadorCarga]);

  if (muestraIndicadorCarga) {
    return (
      <>
        <Grid container className="contenedor">
          <Grid xs={12}>
            <Typography variant="h2">Mis recetas</Typography>
          </Grid>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <CircularProgress />
          </Grid>
        </Grid>
      </>
    );
  }

  if (errorCarga) {
    return (
      <>
        <Grid container className="sugerencias">
          <Grid xs={12}>
            <Typography variant="h2">Mis recetas</Typography>
          </Grid>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Alert severity="error">{errorCarga}</Alert>
          </Grid>
        </Grid>
      </>
    );
  }

  if (recetas.length === 0) {
    return (
      <>
        <Grid container className="sugerencias">
          <Grid xs={12}>
            <Typography variant="h2">Mis recetas</Typography>
          </Grid>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Alert severity="error">No has guardado alguna receta.</Alert>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Grid container spacing={2} className="contenedor">
        <Grid xs={12}>
          <Typography variant="h2">Mis recetas</Typography>
        </Grid>
        <Grid container xs={12} spacing={2}>
          {recetas.map((receta) => (
            <Grid xs={4}
            sm={6}
            md={4}
            lg={3}  key={`receta-favorita-${receta.idMeal}`}>
              <div>
                <Card sx={{ display: 'flex', flexDirection:'column' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={`${receta.strMealThumb}/preview`}
                    alt={receta.strMeal}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flex: '1 1 100%',
                      flexDirection: 'column',
                    }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5">
                        {receta.strMeal}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div">
                        Origen: {receta.strArea}
                      </Typography>
                    </CardContent>
                    <Box className="botonera">
                      <Link
                        to={`/receta/${receta.idMeal}`}
                        style={{ color: 'black', textDecoration: 'none' }}>
                        <Button aria-label="mostrar receta">
                          Mostrar receta
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default MisRecetas;
