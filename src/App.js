import { Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import './App.css';
import { useEffect } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { Search } from './components/Search';
import { receiveCities, receiveProvinces, receiveRegions, receiveStreets, setModal } from './redux/streetSlice';
import { Table } from './components/Table';
import { ModalComponent } from './components/ModalComponent';
import { FilterAdvanced } from './components/FilterAdvanced';

function App() {
  const dispatch = useDispatch();

  const fetchData = async () => {
    Swal.showLoading();
    try {
      const response = await fetch('http://localhost:8000/api/streets');
      const data = await response.json();
      Swal.close();
      dispatch(receiveStreets(data.object));
    } catch (error) {
      console.error('Error al obtener datos de la API', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}regions`);
      const data = await response.json();
      dispatch(receiveRegions(data.object));
    } catch (error) {
      console.error('Error al obtener datos de la API', error);
    }
  };

  const fetchProvincesForRegion = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}provinces/${id}`);
      const data = await response.json();
      dispatch(receiveProvinces(data.object));
    } catch (error) {
      console.error('Error al obtener datos de la API', error);
    }
  };

  const fetchCitiesForProvince = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}cities/${id}`);
      const data = await response.json();
      dispatch(receiveCities(data.object));
    } catch (error) {
      console.error('Error al obtener datos de la API', error);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      style={{
        marginTop: '20px',
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        xs={10}
      >
        <Typography variant='h3'> Mantenedor de Calles</Typography>
      </Grid>
      <FilterAdvanced fetchProvincesForRegion={fetchProvincesForRegion}
        fetchCitiesForProvince={fetchCitiesForProvince} />
      <Search />
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        xs={10}
      >
        <Tooltip title="Agrega Nueva Calle">
          <IconButton
            aria-label="Crear"
            // className={classes.margin}
            onClick={() => {
              dispatch(setModal(true));
            }}
          >
            <AddCircleIcon fontSize="large" color="primary" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Table fetchData={fetchData}
        fetchProvincesForRegion={fetchProvincesForRegion}
        fetchCitiesForProvince={fetchCitiesForProvince} />
      <ModalComponent fetchData={fetchData}
        fetchProvincesForRegion={fetchProvincesForRegion}
        fetchCitiesForProvince={fetchCitiesForProvince} />

    </Grid>
  );
}

export default App;
