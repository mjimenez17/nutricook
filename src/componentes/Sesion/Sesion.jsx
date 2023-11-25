import { Link, useNavigate } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";

import("./Sesion.css");

const ValidacionSchema = Yup.object().shape({
  correo: Yup.string()
    .email("Esto no parece ser un correo electrónico válido.")
    .required("El correo electrónico es un campo obligatorio."),
  clave: Yup.string().required("La contraseña es un campo obligatorio."),
});

const Sesion = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Grid xs container justifyContent={"center"}>
        <h1>Inicia sesión</h1>
      </Grid>
      <Formik
        initialValues={{ correo: "", clave: "" }}
        validationSchema={ValidacionSchema}
        onSubmit={(values, { setSubmitting }) => {
          (async () => {
            try {
              const consulta = await fetch(
                `http://localhost:8000/inicia-sesion`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                }
              );
              if (consulta.ok) {
                const respuestaAPI = await consulta.json();
                const nutricookConfig = localStorage.getItem("NutriCook")
                  ? JSON.parse(localStorage.getItem("NutriCook"))
                  : {};
                nutricookConfig.token = respuestaAPI.jwt;
                localStorage.setItem(
                  "NutriCook",
                  JSON.stringify(nutricookConfig)
                );
                navigate("/");
              } else {
                setSubmitting(false);
                console.error(consulta.status);
              }
            } catch (error) {
              setSubmitting(false);
              console.error("No fue posible conectarse con el servidor.");
            }
          })();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Grid container xs={12} md={8} mdOffset={2} lg={4} lgOffset={4}>
            <Grid xs>
              <Form>
                <Grid xs={12} container spacing={2} direction={"column"}>
                  <Grid>
                    <Field
                      as={TextField}
                      autoFocus
                      fullWidth
                      type="email"
                      name="correo"
                      label="Correo electrónico"
                      error={touched.correo && !!errors.correo}
                      helperText={
                        touched.correo && errors.correo ? (
                          <span>{errors.correo}</span>
                        ) : null
                      }
                    />
                  </Grid>
                  <Grid className={"clave"}>
                    <Field
                      as={TextField}
                      fullWidth
                      type="password"
                      name="clave"
                      label="Contraseña"
                      error={touched.clave && !!errors.clave}
                      helperText={
                        touched.clave && errors.clave ? (
                          <span>{errors.clave}</span>
                        ) : null
                      }
                    />
                  </Grid>
                  <Grid xs display={"flex"} flexDirection={"column"} alignItems={"flex-end"} gap={2}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="contained"
                      endIcon={<LoginIcon />}
                    >
                      Inicia sesión
                    </Button>
                    <Link to="/registro">
                      O también puedes crear una nueva cuenta aquí.
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            </Grid>
          </Grid>
        )}
      </Formik>
    </div>
  );
};

export default Sesion;
