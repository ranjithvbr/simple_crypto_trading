import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: any = {
  data: {}
};

export const getcurrencyCovertResult: any = createAsyncThunk(
  "currencyConverter/data",
  async (arg: any, { rejectWithValue }) => {
    try {
      const data: any = await axios.get(
        `https://api.exchangerate.host/convert?from=${arg.amount}&to=USD`
      );
      const USDdata: any = await axios.get(
        `https://api.exchangerate.host/convert?from=USD&to=${arg.amount}`
      );
      return { data: data.data, USDdata: USDdata.data };
    } catch (err: any) {
      rejectWithValue(err.response.data);
    }
  }
);

export const currencyConverterSlice = createSlice({
  name: "currencyConverter",
  initialState,
  reducers: {
    currencyConvert: (state) => {
      state.data = {}
    }
  },
  extraReducers: {
    [getcurrencyCovertResult.fulfilled]: (state, { payload }) => {
      state.data = payload;
    },
    [getcurrencyCovertResult.rejected]: (state) => {
      state.isLoading = false;
      state.message = "Something went wrong please try again later";
    },
  },
});


export default currencyConverterSlice.reducer;
