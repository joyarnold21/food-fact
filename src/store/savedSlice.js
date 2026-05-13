import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    addItem(state, action) {
      const exists = state.items.some((item) => item.code === action.payload.code)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.code !== action.payload)
    },
  },
})

export const { addItem, removeItem } = savedSlice.actions
export default savedSlice.reducer
