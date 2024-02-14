import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem,
} from '@material-ui/core';

import { DataGrid, esES } from '@mui/x-data-grid';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { setCity, setModal, setName, setProvince, setRegion, setStreet } from '../redux/streetSlice';
import Swal from 'sweetalert2';


const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));


const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);


export const Table = ({
    fetchData,
    fetchProvincesForRegion,
    fetchCitiesForProvince
}) => {

    const { filterStreets, street } = useSelector((state) => state.street);
    const dispatch = useDispatch();


    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);


    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    function buttonOptionsBodyTemplate({ row }) {
        return <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={e => {
                    dispatch(setStreet(row));
                    handleClick(e);
                }}
            >
                <MoreVertIcon />
            </IconButton>
        </div>
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Calle',
            width: 200,
        },
        {
            field: 'city.name',
            headerName: 'Ciudad',
            valueGetter: ({ row }) => (row.city ? `${row.city.name}` : ''),
            width: 200,
        },
        {
            field: 'city.province.name',
            headerName: 'Provincia',
            valueGetter: ({ row }) => (row.city && row.city.province ? `${row.city.province.name}` : ''),
            width: 200,
        },
        {
            field: 'region.city.province.name',
            headerName: 'Región',
            valueGetter: ({ row }) => (row.city && row.city.province && row.city.province.region ? `${row.city.province.region.name}` : ''),
            width: 200,
        },
        {
            field: 'options',
            exports: false,
            headerName: 'Opciones',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: buttonOptionsBodyTemplate,
        },
    ];

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchDeleteStreet = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}streets/${street.id}`, {
                method: 'DELETE',
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
                dispatch(setStreet(null));
                fetchData();
            }
        } catch (error) {
            console.error('Error al obtener datos de la API', error);
        }
    };

    const dataEditStreet = async () => {
        dispatch(setName(street.name));
        fetchProvincesForRegion(street.city.province.region.id);
        fetchCitiesForProvince(street.city.province.id);
        dispatch(setRegion(street.city.province.region));
        dispatch(setProvince(street.city.province));
        dispatch(setCity(street.city));
    }

    return (
        <Grid container item xs={10}>
            <div style={{ height: 400, width: '100%' }}>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <StyledMenuItem>
                        <Button
                            onClick={() => {
                                dataEditStreet();
                                dispatch(setModal(true));
                                handleClose();
                            }}
                            startIcon={<EditIcon />}
                        >
                            Editar
                        </Button>
                    </StyledMenuItem>
                    <StyledMenuItem>
                        <Button
                            onClick={() => {
                                handleClose();
                                Swal.fire({
                                    title: "¿Estas seguro que deseas eliminar esta calle?",
                                    showCancelButton: true,
                                    confirmButtonText: "Confirmar",
                                    cancelButtonText: `Cancelar`
                                }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                        fetchDeleteStreet();
                                    }
                                });

                            }}
                            startIcon={<DeleteIcon />}
                        >
                            Eliminar
                        </Button>
                    </StyledMenuItem>
                </StyledMenu>
                <DataGrid
                    rows={filterStreets}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    localeText={esES.props.MuiDataGrid.localeText}

                />
            </div>
        </Grid>
    )
}
