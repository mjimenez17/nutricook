import { useNavigate } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import("./Registro.css");

const ValidacionSchema = Yup.object().shape({
  nombre: Yup.string().required("El campo nombre es requerido."),
  apellido: Yup.string().required("El campo apellido es requerido."),
  correo: Yup.string()
    .email("Esto no parece ser un correo electrónico válido.")
    .required("El correo electrónico es un campo obligatorio."),
  clave: Yup.string().required("La contraseña es un campo obligatorio.")
  .min(8, "La contraseña debe tener al menos 8 caracteres."),
  confirmaClave: Yup.string()
    .required("Es necesario que confirmes tu contraseña.")
    .oneOf([Yup.ref("clave"), null], "Las contraseñas no coinciden."),
});

const Registro = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Grid xs container justifyContent={"center"}>
        <h1>Nueva cuenta</h1>
      </Grid>
      <Formik
        initialValues={{
          nombre: "",
          apellido: "",
          correo: "",
          clave: "",
          confirmaClave: "",
        }}
        validationSchema={ValidacionSchema}
        onSubmit={(values, { setSubmitting }) => {
          (async () => {
            try {
              const consulta = await fetch(`http://localhost:8000/registro`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              });
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
                alert("Usuario creado correctamente");
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
                      type="text"
                      name="nombre"
                      label="Nombre"
                      error={touched.nombre && !!errors.nombre}
                      helperText={
                        touched.nombre && errors.nombre ? (
                          <span>{errors.nombre}</span>
                        ) : null
                      }
                    />
                  </Grid>
                  <Grid>
                    <Field
                      as={TextField}
                      fullWidth
                      type="text"
                      name="apellido"
                      label="Apellidos"
                      error={touched.apellido && !!errors.apellido}
                      helperText={
                        touched.apellido && errors.apellido ? (
                          <span>{errors.apellido}</span>
                        ) : null
                      }
                    />
                  </Grid>
                  <Grid>
                    <Field
                      as={TextField}
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
                  <Grid className={"confirma-clave"}>
                    <Field
                      as={TextField}
                      fullWidth
                      type="password"
                      name="confirmaClave"
                      label="Repite tu contraseña"
                      error={touched.confirmaClave && !!errors.confirmaClave}
                      helperText={
                        touched.confirmaClave && errors.confirmaClave ? (
                          <span>{errors.confirmaClave}</span>
                        ) : null
                      }
                    />
                  </Grid>
                  <Grid xs display={"flex"} justifyContent={"flex-end"}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="contained"
                      endIcon={<PersonAddIcon />}
                    >
                      Crear cuenta
                    </Button>
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

export default Registro;
