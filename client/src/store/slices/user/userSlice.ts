import { createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      userImg: ''
    },
    isLoading: true
  },
  
  reducers: {
    
    startLoadingUser: (state) => {
      state.isLoading = true;
    },
    
    setUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    },

    setUserImg: (state, action) => {
      state.isLoading = false;
      state.user.userImg = action.payload.userImg
    }
    
  }
})

export const { startLoadingUser, setUser, setUserImg } = userSlice.actions;