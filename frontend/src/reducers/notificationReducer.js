//The starting point for this file was copied from my redux-anecdotes

import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions

const showNotification = (text, color, seconds) => {
  return (dispatch) => {
    dispatch(setNotification({ text, color }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export const notify = (text) => {
  return (dispatch) => {
    dispatch(showNotification(text, 'green', 5))
  }
}

export const reportError = (text) => {
  return (dispatch) => {
    dispatch(showNotification(text, 'red', 10))
  }
}

export default notificationSlice.reducer
