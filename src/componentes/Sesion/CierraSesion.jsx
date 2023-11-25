import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CierraSesion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const nutricookConfig = localStorage.getItem("NutriCook")
      ? JSON.parse(localStorage.getItem("NutriCook"))
      : {};
    if (nutricookConfig) {
      if (Object.hasOwnProperty.call(nutricookConfig, "token")) {
        delete nutricookConfig.token;
        console.log(nutricookConfig);
        localStorage.setItem("NutriCook", JSON.stringify(nutricookConfig));
        navigate("/inicia-sesion");
      }
    }
  }, []);
};

export default CierraSesion;
