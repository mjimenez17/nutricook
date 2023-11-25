import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AutenticadoGuard = ({ componente }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const nutricookConfig = localStorage.getItem("NutriCook")
      ? JSON.parse(localStorage.getItem("NutriCook"))
      : {};

    if (nutricookConfig) {
      if (!Object.hasOwnProperty.call(nutricookConfig, "token")) {
        console.warn("¡No puedes pasar!");
        navigate("/inicia-sesion");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{componente}</>;
};

AutenticadoGuard.propTypes = {
  componente: PropTypes.element.isRequired,
};

export default AutenticadoGuard;
