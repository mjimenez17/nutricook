/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import BuscadorRecetas from "./BuscadorRecetas/BuscadorRecetas";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
// import Collapse from "@mui/material/Collapse";
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
  // const [tarjetasExpandidas, estableceTarjetaExpandida] = useState([]);
  const [favoritos, estableceFavoritos] = useState([]);
  const [token, estableceToken] = useState(null);

  const recuperaConfiguracion = () => {
    const nutricookConfig = localStorage.getItem("NutriCook")
      ? JSON.parse(localStorage.getItem("NutriCook"))
      : {};
    return nutricookConfig;
  };

  const recuperaFavoritosGuardadosServidor = async () => {
    let recetasFavoritasGuardadas = [];
    const recetasFavoritasGuardadasServidor = await fetch(
      "http://localhost:8000/recetas-favoritas",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (recetasFavoritasGuardadasServidor.ok) {
      recetasFavoritasGuardadas = recetasFavoritasGuardadasServidor.json();
    } else {
      console.error("No fue posible recuperar las recetas.");
      estableceErrorCarga("No fue posible recuperar las recetas.");
    }
    return recetasFavoritasGuardadas;
  };

  const procesaGuardadoFavoritoServidor = (id) => {
    (async () => {
      try {
        const consulta = await fetch(
          `http://localhost:8000/recetas-favoritas`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: +id }),
          }
        );
        if (consulta.ok) {
          const respuestaAPI = await consulta.json();
          console.log(respuestaAPI);
          procesaFavoritos();
        } else {
          console.error(consulta.status);
        }
      } catch (error) {
        console.error("No fue posible marcar la receta como favorita.");
      }
    })();
  };

  const procesaFavoritos = () => {
    const recetasFavoritasGuardadas = recuperaFavoritosGuardadosServidor();
    recetasFavoritasGuardadas.then((recetas) => {
      const recetasFavoritasGuardadas = recetas.map((r) => r.id);
      estableceFavoritos(recetasFavoritasGuardadas);
    });
  };

  /* const procesaExpansionTarjeta = (tarjeta) => {
    const nuevasTarjetas = !tarjetasExpandidas.includes(tarjeta)
      ? [...tarjetasExpandidas, tarjeta]
      : tarjetasExpandidas.filter((t) => t !== tarjeta);
    estableceTarjetaExpandida(nuevasTarjetas);
  }; */

  useEffect(() => {
    const nutricookConfig = recuperaConfiguracion();
    if (nutricookConfig) {
      if (Object.hasOwnProperty.call(nutricookConfig, "token")) {
        estableceToken(nutricookConfig.token);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      procesaFavoritos();
    }
  }, [token]);

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
              estableceRecetas(
                recetasDeLaAPI.meals.map((r) => {
                  r.idMeal = +r.idMeal;
                  return r;
                })
              );
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
  }, [token, muestraIndicadorCarga, palabrasClave]);

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
            <Grid xs={4} lg={3} key={receta.idMeal} className="tarjeta-receta">
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
                    <IconButton
                      onClick={(e) =>
                        procesaGuardadoFavoritoServidor(`${receta.idMeal}`, e)
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
                    <Link
                      to={`/receta/${receta.idMeal}`}
                      style={{ color: "black", textDecoration: "none" }}
                    >
                      <Button aria-label="mostrar receta">
                        Mostrar receta
                      </Button>
                    </Link>
                    {/* <Button
                      onClick={(e) =>
                        procesaExpansionTarjeta(`${receta.idMeal}`, e)
                      }
                      aria-label="mostrar más"
                    >
                      {!tarjetasExpandidas.includes(`${receta.idMeal}`)
                        ? "Mostrar instrucciones"
                        : "Ocultar instrucciones"}
                    </Button> */}
                  </CardActions>
                  {/* <Collapse
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
                  </Collapse> */}
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
