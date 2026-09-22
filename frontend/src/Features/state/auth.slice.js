import { createSlice } from "@reduxjs/toolkit";

 export const authSlice = createSlice({
   name: "auth",

   initialState: {
     user: null,
     loading: true,
     errors: null,
   },

   reducers: {
     setLoading: (state) => {
       state.loading = true;
       state.error = null;
     },

     addUser: (state, action) => {
       state.user = action.payload;
       state.loading = false;
       state.error = null;
     },

     removeUser: (state) => {
       state.user = null;
       state.loading = false;
       state.error = null;
     },

     setError: (state, action) => {
       state.loading = false;
       state.error = action.payload;
     },
   },
 });

export const { addUser, setLoading, setError, removeUser } = authSlice.actions;
export default authSlice.reducer;
