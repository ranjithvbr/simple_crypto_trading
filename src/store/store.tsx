import { configureStore } from '@reduxjs/toolkit'
import cryptoAssets from './features/cryptoAssets'
import currencyConverter from "./features/currenyConverter";
import thunkMiddleware from 'redux-thunk';

export const store = configureStore({
  reducer: {
    cryptoAssets,
    currencyConverter
  },
  middleware: [thunkMiddleware],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch