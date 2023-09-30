import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    beerData: {

    },
    error: null,
}

export const beerDataSlice = createSlice({
    name: 'beerData',
    initialState: initialState,
    reducers: {
        updateBeerData(state, action) {
            const { page, data } = action.payload;
            state.beerData[String(page)] = data;
        }
    }
});
export const { updateBeerData } = beerDataSlice.actions;
export default beerDataSlice.reducer;