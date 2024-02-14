import { Button, Grid, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeFilteredStreets, setCityFilter, setProvinceFilter, setRegionFilter, setSearch } from '../redux/streetSlice';

export const FilterAdvanced = ({ fetchProvincesForRegion,
    fetchCitiesForProvince }) => {

    const { filterCity, provinces, regions, cities, filterProvince, filterRegion, streets } = useSelector((state) => state.street);
    const dispatch = useDispatch();


    const clearProvince = () => {
        dispatch(setProvinceFilter(null));
        clearCity();
    }

    const clearCity = () => {
        dispatch(setCityFilter(null));
    }

    useEffect(() => {
        if (filterCity) {
            const result = streets.filter(a => a.city_id === filterCity.id);
            dispatch(changeFilteredStreets(result));
            return;
        }
        if (filterProvince) {
            const result = streets.filter(a => a.city.province_id === filterProvince.id);
            dispatch(changeFilteredStreets(result));
            return;
        }
        if (filterRegion) {
            dispatch(setSearch(''));
            const result = streets.filter(a => a.city.province.region_id === filterRegion.id);
            dispatch(changeFilteredStreets(result));
            return;
        }

    }, [filterCity, filterProvince, filterRegion]);

    const cleanFilter = () => {
        dispatch(setCityFilter(null));
        dispatch(setProvinceFilter(null));
        dispatch(setRegionFilter(null));
        dispatch(changeFilteredStreets(streets));
    }


    return (
        <Grid
            container
            direction="column"
            justifyContent="start"
            alignItems="start"
            xs={10}
            spacing={3}
        >
            <Grid item>
                <Typography variant='h5'> Filtro avanzado </Typography>
            </Grid>
            <Grid
                item
                container
                direction="row"
                alignItems="center"
                xs={10}
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
                                dispatch(setRegionFilter(newValue));
                                fetchProvincesForRegion(newValue.id);
                            }
                        }}
                        value={filterRegion}
                        noOptionsText="No hay regiones"
                        style={{ width: 250 }}
                        renderInput={(params) => <TextField {...params} label="Region" variant="outlined" />}
                    />
                </Grid>
                {filterRegion && <Grid item>
                    <Autocomplete
                        id="combo-box-province"
                        disableClearable
                        options={provinces}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            dispatch(setProvinceFilter(newValue));
                            fetchCitiesForProvince(newValue.id);
                            clearCity();
                        }}
                        value={filterProvince}
                        noOptionsText="No hay provincias para la region seleccionada"
                        style={{ width: 250 }}
                        renderInput={(params) => <TextField {...params} label="Provincia" variant="outlined" />}
                    />
                </Grid>}
                {filterProvince && <Grid item>
                    <Autocomplete
                        id="combo-box-city"
                        disableClearable
                        options={cities}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            if (newValue) {
                                dispatch(setCityFilter(newValue));
                            }
                        }}
                        value={filterCity}
                        noOptionsText="No hay ciudades para la provincia seleccionada"
                        style={{ width: 250 }}
                        renderInput={(params) => <TextField {...params} label="Ciudad" variant="outlined" />}
                    />
                </Grid>}
                <Button variant='outlined' color='primary' onClick={cleanFilter} >Limpiar Filtro</Button>
            </Grid>
        </Grid>
    )
}
