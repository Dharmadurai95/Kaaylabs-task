import { configureStore } from '@reduxjs/toolkit';
import beerDataSlice  from '../features/beerSlice';

export const store = configureStore({
    reducer:{
        tableData:beerDataSlice
    }
})