import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {}
}

export const AuthSlice = createSlice( {
    name:     'auth',
    initialState,
    reducers: {
        login: ( state, props ) => {
            state.value = { data: props }
        }
    }
} )

export const { login } = AuthSlice.actions

export default AuthSlice.reducer