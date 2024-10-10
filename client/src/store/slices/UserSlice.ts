import { createSlice } from "@reduxjs/toolkit";

interface User {
    _id: string
    name: string
    email: string
    role: string
    phone: string
    address: string
    state: string
    country: string
    postalCode: string
    preferences: Record<string, string>
    createdAt: Date
}

const initialState: { user: User | null, initial: boolean } = {
    user: null,
    initial: true
}

export const UserSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setInitial(state) {
            state.initial = false
        }
    }
})

export const { setUser, setInitial } = UserSlice.actions
export default UserSlice.reducer