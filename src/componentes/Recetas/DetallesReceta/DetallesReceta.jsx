import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import './DetallesReceta.css';

const DetallesReceta = () => {
  const { idReceta } = useParams();

  const [muestraIndicadorCarga, estableceIndicadorCarga] = useState(true);
  const [errorCarga, estableceErrorCarga] = useState(null);
  const [receta, estableceReceta] = useState(null);

  useEffect(() => {
    if (muestraIndicadorCarga) {
      (async () => {
        try {
          const consulta = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`
          );
          if (consulta.ok) {
            const recetaDeLaAPI = await consulta.json();
            if (!recetaDeLaAPI?.meals) {
              estableceErrorCarga(
                'No fue posible recuperar la información de la receta.'
              );
            } else {
              estableceReceta(recetaDeLaAPI.meals[0]);
              estableceErrorCarga(null);
            }
            estableceIndicadorCarga(false);
          } else {
            console.error(consulta.error);
            estableceErrorCarga('No fue posible recuperar la receta.');
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

  return (
    <>
      <Grid container spacing={2} className="contenedor">
        <Grid xs={12}>
          <Typography variant="h2">{receta?.strMeal}</Typography>
        </Grid>
        <Grid xs={3}>
          <img src={receta?.strMealThumb} alt={receta?.strMeal} width="100%" />
        </Grid>
        <Grid xs={9}>
          <Typography variant="h4" gutterBottom>
            Ingredientes
          </Typography>
          <List dense={true}>
            {[...Array(20).keys()].map((k, i) =>
              receta[`strIngredient${k + 1}`] ? (
                <ListItem key={`elemento-listado-${i}`}>
                  <ListItemText
                    primary={`(${receta[`strMeasure${k + 1}`]}) ${
                      receta[`strIngredient${k + 1}`]
                    }`}
                  />
                </ListItem>
              ) : null
            )}
          </List>
          <Typography variant="h4" gutterBottom>
            Instrucciones
          </Typography>
          <Typography variant="body2">{receta?.strInstructions}</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default DetallesReceta;
