import { configureStore } from '@reduxjs/toolkit'
import WorkFlowReducer from './Slices/WorkFlow'

export const GlobalObjectStore = configureStore({
  reducer: {
    WorkFlow:WorkFlowReducer
  },
})

export type RootState = ReturnType<typeof GlobalObjectStore.getState>
export type AppDispatch = typeof GlobalObjectStore.dispatch