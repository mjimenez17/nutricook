import { useState } from 'react';
import PropTypes from 'prop-types';

import './BuscadorRecetas.css';

const BuscadorRecetas = () => {
  const procesaBusqueda = (event) => {
    event.preventDefault();
    addTaskFn(value);
    setValue('');
  };

  return <form onSubmit={procesaBusqueda}></form>;
};

export default BuscadorRecetas;
