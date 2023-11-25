import { useState, useEffect } from "react";

const useToken = () => {
  const [token, estableceToken] = useState(null);

  const recuperaConfiguracion = () => {
    const nutricookConfig = localStorage.getItem("NutriCook")
      ? JSON.parse(localStorage.getItem("NutriCook"))
      : {};
    return nutricookConfig;
  };

  useEffect(() => {
    const nutricookConfig = recuperaConfiguracion();
    if (nutricookConfig) {
      if (Object.hasOwnProperty.call(nutricookConfig, "token")) {
        estableceToken(nutricookConfig.token);
      }
    }
  }, []);

  return token;
};

export default useToken;
