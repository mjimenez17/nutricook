import { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';

import './Recetas.css';

const Recetas = () => {
  const [muestraIndicadorCarga, estableceIndicadorCarga] = useState(true);
  const [errorCarga, estableceErrorCarga] = useState(null);
  const [recetas, estableceRecetas] = useState([]);
  const [palabrasClave, establecePalabrasClave] = useState('');
  const [tarjetasExpandidas, estableceTarjetaExpandida] = useState([]);

  const procesaExpansionTarjeta = (tarjeta, event) => {
    const nuevasTarjetas = !tarjetasExpandidas.includes(tarjeta)
      ? [...tarjetasExpandidas, tarjeta]
      : tarjetasExpandidas.filter((t) => t !== tarjeta);
    estableceTarjetaExpandida(nuevasTarjetas);
  };

  useEffect(() => {
    if (muestraIndicadorCarga) {
      (async () => {
        try {
          const consulta = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${palabrasClave}`
          );
          if (consulta.ok) {
            const recetasDeLaAPI = await consulta.json();
            recetasDeLaAPI.meals.map((receta) => {
              receta.ingredientes = [...Array(20).keys()]
                .map(
                  (v) =>
                    receta[`strIngredient${v + 1}`] +
                    ' (' +
                    receta[`strMeasure${v + 1}`] +
                    ')'
                )
                .map((v) => v.replace('( )', ''))
                .filter((v) => v.trim().length > 0)
                .join(', ');
            });
            estableceRecetas(recetasDeLaAPI.meals);
            estableceIndicadorCarga(false);
            estableceErrorCarga(null);
          } else {
            console.error(consulta.error);
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
        {recetas.map((receta) => (
          <Grid xs={4} key={receta.idMeal} className="tarjeta-receta">
            <div>
              <Card sx={{ maxWidth: 345 }}>
                <CardHeader
                  title={receta.strMeal}
                  subheader={`Origen: ${receta.strArea}`}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={receta.strMealThumb}
                  alt={receta.strMeal}
                />
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    Ingredientes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {receta.ingredientes}.
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="agregar a favoritos">
                    <FavoriteIcon />
                  </IconButton>
                  <div style={{ flex: '1 1 auto' }}></div>
                  <Button
                    onClick={(e) =>
                      procesaExpansionTarjeta(`${receta.idMeal}`, e)
                    }
                    aria-label="mostrar más">
                    {!tarjetasExpandidas.includes(`${receta.idMeal}`)
                      ? 'Mostrar instrucciones'
                      : 'Ocultar instrucciones'}
                  </Button>
                </CardActions>
                <Collapse
                  in={tarjetasExpandidas.includes(`${receta.idMeal}`)}
                  timeout="auto"
                  unmountOnExit>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      Instrucciones
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {receta.strInstructions}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Recetas;
