import { useState } from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import './BuscadorRecetas.css';

const BuscadorRecetas = ({ procesaBusqueda }) => {
  const [palabrasClaves, establecePalabrasClaves] = useState('');

  const procesaCampoBusqueda = (event) => {
    establecePalabrasClaves(event.target.value);
  };

  const realizaBusqueda = (event) => {
    event.preventDefault();
    procesaBusqueda(palabrasClaves);
  };

  return (
    <form onSubmit={realizaBusqueda} className="buscador">
      <TextField
        id="search-bar"
        className="text"
        onInput={procesaCampoBusqueda}
        label="Busca más recetas"
        variant="outlined"
        size="small"
        value={palabrasClaves}
      />
      <IconButton type="submit" aria-label="buscar">
        <SearchIcon style={{ fill: 'green' }} />
      </IconButton>
    </form>
  );
};

BuscadorRecetas.propTypes = {
  procesaBusqueda: PropTypes.func.isRequired,
};

export default BuscadorRecetas;
