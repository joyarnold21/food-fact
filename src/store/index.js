import { configureStore } from '@reduxjs/toolkit'
import savedReducer from './savedSlice.js'

const STORAGE_KEY = 'foodfacts-saved'

function loadSavedState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return undefined
    return { saved: { items: JSON.parse(stored) } }
  } catch {
    return undefined
  }
}

function saveSavedState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved.items))
  } catch {
    // silent fail to prevent app crash in restricted environments
  }
}

const store = configureStore({
  reducer: {
    saved: savedReducer,
  },
  preloadedState: loadSavedState(),
})

store.subscribe(() => {
  saveSavedState(store.getState())
})

export default store
