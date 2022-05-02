import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface CryptoAssetsResponse {
  id: string;
  metrics: {
    market_data: {
      price_usd: string;
    };
  };
  market_data: { price_usd: number };
  price_usd: number;
  name: string;
  symbol: string;
}

interface CryptoAssets {
  data: Array<CryptoAssetsResponse>;
  status: {
    elapsed: number;
    timestamp: string;
  };
}

interface CryptoAssetsState {
  data: Array<CryptoAssetsResponse>;
  message: string;
  isLoading: boolean;
}

const initialState: CryptoAssetsState = {
  data: [],
  message: "",
  isLoading: false,
};

export const getCryptoList: any = createAsyncThunk(
  "cryptoCoin/data",
  async (_arg: void, { rejectWithValue }) => {
    try {
      const { data }: CryptoAssets = await axios.get(
        `https://data.messari.io/api/v2/assets?fields=id,name,symbol,metrics/market_data/price_usd`
      );
      return data;
    } catch (err: any) {
      rejectWithValue(err.response.data);
    }
  }
);

export const CryptoAssetSlice = createSlice({
  name: "cryptoCoin",
  initialState,
  reducers: {
    cryptoCoinList: (state) => {
      state.data = [];
    }
  },
  extraReducers: {
    [getCryptoList.pending]: (state) => {
      state.isLoading = true;
    },
    [getCryptoList.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload;
    },
    [getCryptoList.rejected]: (state) => {
      state.isLoading = false;
      state.message = "Something went wrong please try again later";
    },
  },
});

export default CryptoAssetSlice.reducer;
