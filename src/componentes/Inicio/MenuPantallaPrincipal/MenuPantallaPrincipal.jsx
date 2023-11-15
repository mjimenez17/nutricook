import { Link } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import ChecklistRtl from '@mui/icons-material/ChecklistRtl';
/* import MonitorWeight from '@mui/icons-material/MonitorWeight';
import ShoppingCart from '@mui/icons-material/ShoppingCart'; */

import './MenuPantallaPrincipal.css';

const MenuPantallaPrincipal = () => {
  const elementosMenu = [
    {
      opcion: 'Mis recetas',
      ruta: 'mis-recetas',
      icono: <ChecklistRtl />,
      codigoIcono: '\ue6b3',
    },
    /* {
      opcion: 'Mis medidas',
      ruta: 'mis-medidas',
      icono: <MonitorWeight />,
      codigoIcono: '\uf039',
    },
    {
      opcion: 'Mi lista de súper',
      ruta: 'mi-lista',
      icono: <ShoppingCart />,
      codigoIcono: '\ue8cc',
    }, */
  ];

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12} lg={4} lgOffset={4}>
          <section className="menu-pantalla-principal">
            {elementosMenu.map((elemento, i) => (
              <Link
                to={elemento.ruta}
                style={{ color: 'black', textDecoration: 'none' }}
                key={`opcion-menu${i}`}>
                <div
                  className={`elemento-menu`}
                  data-icono-menu={elemento.codigoIcono}>
                  <span>{elemento.opcion}</span>
                </div>
              </Link>
            ))}
          </section>
        </Grid>
      </Grid>
    </>
  );
};

export default MenuPantallaPrincipal;
