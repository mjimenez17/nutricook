import { useEffect, useState } from "react";

import BuscadorRecetas from "./BuscadorRecetas/BuscadorRecetas";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { pink } from "@mui/material/colors";

import "./Recetas.css";

const Recetas = () => {
  const [muestraIndicadorCarga, estableceIndicadorCarga] = useState(true);
  const [errorCarga, estableceErrorCarga] = useState(null);
  const [recetas, estableceRecetas] = useState([]);
  const [palabrasClave, establecePalabrasClave] = useState("");
  const [tarjetasExpandidas, estableceTarjetaExpandida] = useState([]);
  const [favoritos, estableceFavoritos] = useState([]);

  const recuperaFavoritosGuardados = () => {
    const favoritosGuardados = localStorage.getItem("NutriCook")
      ? JSON.parse(localStorage.getItem("NutriCook"))
      : { favoritos: [] };
    return favoritosGuardados.favoritos;
  };

  const procesaGuardadoFavorito = (id) => {
    const nuevosFavoritos = new Set(recuperaFavoritosGuardados());
    if (nuevosFavoritos.has(id)) {
      nuevosFavoritos.delete(id);
    } else {
      nuevosFavoritos.add(id);
    }
    estableceFavoritos([...nuevosFavoritos]);
    localStorage.setItem(
      "NutriCook",
      JSON.stringify({
        favoritos: [...nuevosFavoritos],
      })
    );
  };

  const procesaExpansionTarjeta = (tarjeta) => {
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
            if (!recetasDeLaAPI?.meals) {
              estableceErrorCarga("No se encontraron resultados.");
            } else {
              estableceRecetas(recetasDeLaAPI.meals);
              recetasDeLaAPI.meals.map((receta) => {
                receta.ingredientes = [...Array(20).keys()]
                  .map(
                    (k) =>
                      receta[`strIngredient${k + 1}`] +
                      " (" +
                      receta[`strMeasure${k + 1}`] +
                      ")"
                  )
                  .map((k) => k.replace(/\(([\s+]?\))/g, ""))
                  .filter((k) => k.trim().length > 0)
                  .join(", ");
              });
              estableceFavoritos(recuperaFavoritosGuardados());
              estableceErrorCarga(null);
            }
            estableceIndicadorCarga(false);
          } else {
            console.error(consulta.error);
            estableceErrorCarga("No fue posible recuperar las recetas.");
          }
        } catch (error) {
          console.error(error);
          estableceErrorCarga("Ocurrió un error inesperado.");
        }
      })();
    }
  }, [muestraIndicadorCarga, palabrasClave]);

  const procesaBusqueda = (palabrasClave) => {
    estableceIndicadorCarga(true);
    establecePalabrasClave(palabrasClave);
  };

  if (muestraIndicadorCarga) {
    return (
      <>
        <Grid container className="contenedor">
          <Grid xs={12} style={{ paddingBottom: "1.5rem" }}>
            <BuscadorRecetas
              procesaBusqueda={procesaBusqueda}
            ></BuscadorRecetas>
          </Grid>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid>
        </Grid>
      </>
    );
  }

  if (errorCarga) {
    return (
      <>
        <Grid container className="contenedor">
          <Grid xs={12} style={{ paddingBottom: "1.5rem" }}>
            <BuscadorRecetas
              procesaBusqueda={procesaBusqueda}
            ></BuscadorRecetas>
          </Grid>
          <Grid
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Alert severity="error">{errorCarga}</Alert>
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Grid container spacing={2} className="contenedor">
        <Grid xs={12} style={{ paddingBottom: "1.5rem" }}>
          <BuscadorRecetas procesaBusqueda={procesaBusqueda}></BuscadorRecetas>
        </Grid>
        <Grid container spacing={2} xs={12}>
          {recetas.map((receta) => (
            <Grid
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={receta.idMeal}
              className="tarjeta-receta"
            >
              {/* <Grid xs={4} lg={3} key={receta.idMeal} className="tarjeta-receta"> */}
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card sx={{ maxWidth: 345, height: "100%" }}>
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
                      <IconButton
                        onClick={(e) =>
                          procesaGuardadoFavorito(`${receta.idMeal}`, e)
                        }
                        aria-label="agregar a favoritos"
                      >
                        <FavoriteIcon
                          sx={{
                            color: favoritos.includes(receta.idMeal)
                              ? pink[500]
                              : null,
                          }}
                        />
                      </IconButton>
                      <div style={{ flex: "1 1 auto" }}></div>
                      <Button
                        onClick={(e) =>
                          procesaExpansionTarjeta(`${receta.idMeal}`, e)
                        }
                        aria-label="mostrar más"
                      >
                        {!tarjetasExpandidas.includes(`${receta.idMeal}`)
                          ? "Mostrar instrucciones"
                          : "Ocultar instrucciones"}
                      </Button>
                    </CardActions>
                  <Collapse
                    in={tarjetasExpandidas.includes(`${receta.idMeal}`)}
                    timeout="auto"
                    unmountOnExit
                  >
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
      </Grid>
    </>
  );
};

export default Recetas;
