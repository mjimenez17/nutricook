import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AliceCarousel from 'react-alice-carousel';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import './Sugerencias.css';
import 'react-alice-carousel/lib/alice-carousel.css';

const Sugerencias = () => {
  // const [recetas, setRecetas] = useState([]);
  const [muestraIndicadorCargaCarrusel, estableceIndicadorCargaCarrusel] =
    useState(true);
  const [errorCargaCarrusel, estableceErrorCargaCarrusel] = useState(null);

  const [elementosCarrusel, estableceElementosCarrusel] = useState([]);
  const procesaArrastre = (e) => e.preventDefault();
  const opcionesCarruselResponsivo = {
    0: { items: 1 },
    568: { items: 3 },
    1024: { items: 5 },
  };

  useEffect(() => {
    if (muestraIndicadorCargaCarrusel) {
      (async () => {
        try {
          const consulta = await fetch(
            'https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican'
          );
          if (consulta.ok) {
            const recetasDeLaAPI = await consulta.json();
            recetasDeLaAPI.meals.map((receta) => {
              receta.elementoCarrusel = (
                <img
                  style={{ maxHeight: '150px' }}
                  src={`${receta.strMealThumb}/preview`}
                  onDragStart={procesaArrastre}
                  role="presentation"
                />
              );
            });
            const elementosDelCarrusel = recetasDeLaAPI.meals.map(
              (r) => r.elementoCarrusel
            );
            // setRecetas(recetasDeLaAPI.meals);
            estableceElementosCarrusel(elementosDelCarrusel);
            estableceIndicadorCargaCarrusel(false);
            estableceErrorCargaCarrusel(null);
          } else {
            console.error(consulta.error);
            estableceErrorCargaCarrusel(
              'No fue posible recuperar las sugerencias.'
            );
          }
        } catch (error) {
          console.error(error);
          estableceErrorCargaCarrusel('Ocurrió un error inesperado.');
        }
      })();
    }
    /* const obtenRecetas = async () => {
      try {
        const consulta = await fetch(
          'https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican'
        );
        const recetasDeLaAPI = await consulta.json();
        setRecetas(recetasDeLaAPI.meals);
      } catch (error) {
        console.error(error);
      }
    };

    obtenRecetas(); */
  }, [muestraIndicadorCargaCarrusel]);

  /* return (
    <>
      <Grid container spacing={2} className="sugerencias">
        <Grid xs={12} display="flex" justifyContent="center" alignItems="center">
          <h2>Sugerencias</h2>
        </Grid>
        {
          recetas.map((receta, i) => (
              <Grid xs={3} key={`sugerencia-${i}`}>
                <img src={`${receta.strMealThumb}/preview`} alt={receta.strMealThumb} />
              </Grid>
            )
          )
        }
      </Grid>
    </>
  );
}; */

  if (muestraIndicadorCargaCarrusel) {
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

  if (errorCargaCarrusel) {
    return (
      <>
        <Grid container className="sugerencias">
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Alert severity="error">{errorCargaCarrusel}</Alert>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Grid container className="sugerencias">
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center">
          <Typography variant="h4" gutterBottom>
            Sugerencias
          </Typography>
        </Grid>
        <Grid xs={8} xsOffset={2}>
          <AliceCarousel
            autoPlay
            autoPlayStrategy="none"
            autoPlayInterval={1500}
            animationDuration={1500}
            animationType="fadeout"
            infinite
            touchTracking
            mouseTracking
            disableDotsControls
            items={elementosCarrusel}
            responsive={opcionesCarruselResponsivo}
          />
        </Grid>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center">
          <Link to="recetas">
            <Button variant="contained">Ver más</Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default Sugerencias;
