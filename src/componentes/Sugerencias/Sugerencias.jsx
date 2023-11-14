import { useEffect, useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import './Sugerencias.css';

const Sugerencias = () => {
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const consulta = await fetch(
          'https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican'
        );
        const recetasDeLaAPI = await consulta.json();
        setRecetas(recetasDeLaAPI.meals);
      } catch (error) {
        console.error(error);
      }
    })();
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
  }, []);

  return (
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
};

export default Sugerencias;
