import { Grid, TextField, Typography } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeFilteredStreets, setCityFilter, setProvinceFilter, setRegionFilter, setSearch } from '../redux/streetSlice';

export const Search = () => {

    const { streets, search } = useSelector((state) => state.street);
    const dispatch = useDispatch();

    const searchFn = (data) => {
        dispatch(setSearch(data));
        dispatch(setCityFilter(null));
        dispatch(setProvinceFilter(null));
        dispatch(setRegionFilter(null));
        if (data.length) {
            const result = streets.filter(a => a.name.toUpperCase().includes(data) || a.city.name.toUpperCase().includes(data) || a.city.province.name.toUpperCase().includes(data) || a.city.province.region.name.toUpperCase().includes(data));
            dispatch(changeFilteredStreets(result));
        } else {
            dispatch(changeFilteredStreets(streets));
        }
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
                <Typography variant='h5'> Buscador </Typography>
            </Grid>
            <Grid item>
                <TextField
                    id="standard-street"
                    label="Buscar"
                    required
                    variant="outlined"
                    value={search}
                    onChange={(e) => searchFn(e.target.value.toUpperCase())}
                    style={{ width: '250px' }}
                />
            </Grid>
        </Grid>
    )
}
