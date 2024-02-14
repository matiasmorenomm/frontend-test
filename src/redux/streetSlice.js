import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    city: null,
    province: null,
    region: null,
    cities: [],
    provinces: [],
    regions: [],
    streets: [],
    filterStreets: [],
    modal: false,
    street: null,
    filterRegion: null,
    filterProvince: null,
    filterCity: null,
    search: '',
}

export const streetSlice = createSlice({
    name: "street",
    initialState,
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        receiveStreets: (state, action) => {
            state.streets = action.payload;
            state.filterStreets = action.payload;
        },
        receiveCities: (state, action) => {
            state.cities = action.payload;
        },
        receiveProvinces: (state, action) => {
            state.provinces = action.payload;
        },
        receiveRegions: (state, action) => {
            state.regions = action.payload;
        },
        changeFilteredStreets: (state, action) => {
            state.filterStreets = action.payload;
        },
        setModal: (state, action) => {
            state.modal = action.payload;
        },
        setStreet: (state, action) => {
            state.street = action.payload;
        },
        setCity: (state, action) => {
            state.city = action.payload;
        },
        setProvince: (state, action) => {
            state.province = action.payload;
        },
        setRegion: (state, action) => {
            state.region = action.payload;
        },
        setRegionFilter: (state, action) => {
            state.filterRegion = action.payload;
        },
        setProvinceFilter: (state, action) => {
            state.filterProvince = action.payload;
        },
        setCityFilter: (state, action) => {
            state.filterCity = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
    }
})

export const { setName, receiveStreets, receiveCities,
    receiveProvinces,
    receiveRegions,
    changeFilteredStreets, setModal,
    setStreet,
    setCity,
    setProvince,
    setRegion,
    setRegionFilter,
    setProvinceFilter,
    setSearch,
    setCityFilter } = streetSlice.actions;
export default streetSlice.reducer;