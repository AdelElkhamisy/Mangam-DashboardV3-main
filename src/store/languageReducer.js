import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lang: "ar"
};

const lang_reducer = createSlice({
  initialState,
  name: "language",
  reducers: {
    updateLanguage: (state, action) => {
      state.lang = action.payload;
      if (state.lang == "ar") {
        document.body.classList.remove("en");
        document.body.classList.add("ar");
      } else {
        document.body.classList.remove("ar");
        document.body.classList.add("en");
      }
    }
  }
});

export const { updateLanguage } = lang_reducer.actions;
export default lang_reducer.reducer;
