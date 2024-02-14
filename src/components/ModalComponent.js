import React from 'react'
import { Grid } from '@material-ui/core';
import { useState } from 'react';
import Swal from 'sweetalert2';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Backdrop, Button, CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { receiveCities, receiveProvinces, setCity, setModal, setName, setProvince, setRegion, setStreet } from '../redux/streetSlice';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 600,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export const ModalComponent = ({
    fetchData,
    fetchProvincesForRegion,
    fetchCitiesForProvince
}) => {


    const { modal, street, name, city, provinces, regions, cities, province, region } = useSelector((state) => state.street);
    const dispatch = useDispatch();

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const fetchCreateStreet = async (id) => {
        dispatch(setModal(false));
        Swal.showLoading();

        try {
            const datos = {
                name,
                city_id: city.id,
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}streets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Puedes incluir otros encabezados según tus necesidades
                },
                body: JSON.stringify(datos),
            });
            const data = await response.json();
            if (response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    text: data.message,
                    confirmButtonText: "Entendido",
                }).then((result) => {
                    if (result.isConfirmed) {
                        dispatch(setModal(true));
                    }
                })
            } else {
                handleCloseModal();
                fetchData();
            }
        } catch (error) {
            console.error('Error al obtener datos de la API', error);
        }
    };

    const fetchEditStreet = async (id) => {

        dispatch(setModal(false));
        Swal.showLoading();

        try {
            const datos = {
                name,
                city_id: city.id,
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}streets/${street.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Puedes incluir otros encabezados según tus necesidades
                },
                body: JSON.stringify(datos),
            });
            const data = await response.json();
            if (response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    text: data.message,
                    confirmButtonText: "Entendido",
                }).then((result) => {
                    if (result.isConfirmed) {
                        dispatch(setModal(true));
                    }
                })
            } else {
                handleCloseModal();
                fetchData();
            }
        } catch (error) {
            console.error('Error al obtener datos de la API', error);
        }
    };
    const clearProvince = () => {
        dispatch(setProvince(null));
        clearCity();
    }

    const clearCity = () => {
        dispatch(setCity(null));
    }

    const handleCloseModal = () => {
        dispatch(setModal(false));
        dispatch(setStreet(null));
        dispatch(setName(''));
        dispatch(setCity(null));
        dispatch(setProvince(null));
        dispatch(setRegion(null));
        dispatch(receiveProvinces([]));
        dispatch(receiveCities([]));
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <Backdrop className={classes.backdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
            >
                <Grid item>
                    <h1>{street ? 'Actualizar Calle' : 'Crear Nueva Calle'}</h1>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item>
                        <Autocomplete
                            id="combo-box-region"
                            disableClearable
                            options={regions}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    clearProvince();
                                    dispatch(setRegion(newValue));
                                    fetchProvincesForRegion(newValue.id);
                                }
                            }}
                            value={region}
                            noOptionsText="No hay regiones"
                            style={{ width: 250 }}
                            renderInput={(params) => <TextField {...params} label="Region" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            id="combo-box-province"
                            disableClearable
                            options={provinces}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                dispatch(setProvince(newValue));
                                fetchCitiesForProvince(newValue.id);
                                clearCity();
                            }}
                            value={province}
                            noOptionsText="No hay provincias para la region seleccionada"
                            style={{ width: 250 }}
                            renderInput={(params) => <TextField {...params} label="Provincia" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={3}
                >
                    <Grid item>
                        <Autocomplete
                            id="combo-box-city"
                            disableClearable
                            options={cities}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    dispatch(setCity(newValue));
                                }
                            }}
                            value={city}
                            noOptionsText="No hay ciudades para la provincia seleccionada"
                            style={{ width: 250 }}
                            renderInput={(params) => <TextField {...params} label="Ciudad" variant="outlined" />}
                        />
                    </Grid>

                    <Grid item>
                        <TextField
                            id="standard-street"
                            label="Calle"
                            required
                            variant="outlined"
                            value={name}
                            onChange={(e) => dispatch(setName(e.target.value.toUpperCase()))}
                            style={{ width: '250px' }}
                        />
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                >
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCloseModal()}
                    >
                        Cancelar
                    </Button>

                    {
                        street ? <Button
                            variant="outlined"
                            color="primary"
                            disabled={!city || !name.length}
                            onClick={() => {
                                fetchEditStreet();
                            }}
                        >
                            Actualizar
                        </Button> : <Button
                            variant="outlined"
                            color="primary"
                            disabled={!city || !name.length}
                            onClick={() => {
                                fetchCreateStreet();
                            }}
                        >
                            Guardar
                        </Button>
                    }

                </Grid>
            </Grid>
        </div>
    );

    return (
        <Modal
            open={modal}
            onClose={() => handleCloseModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    )
}
