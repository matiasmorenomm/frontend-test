import { configureStore } from '@reduxjs/toolkit';
import streetReducer from "./streetSlice";

export const store = configureStore({
    reducer: {
        street: streetReducer,
    }
})