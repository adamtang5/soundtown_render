// constants
const TOGGLE_DROPDOWN = "dropdown/TOGGLE_DROPDOWN";
const SHOW_DROPDOWN = "dropdown/SHOW_DROPDOWN";
const HIDE_DROPDOWN = "dropdown/HIDE_DROPDOWN";

export const toggleAllDropdowns = () => ({
  type: TOGGLE_DROPDOWN,
});

export const showAllDropdowns = () => ({
  type: SHOW_DROPDOWN,
});

export const hideAllDropdowns = () => ({
  type: HIDE_DROPDOWN,
});

// State shape:

// state.dropdown --> {
//   showing: true | false,
// }

const initialState = {
  showing: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DROPDOWN: {
      const newState = {
        showing: !state.showing,
      };
      return newState;
    }
    case SHOW_DROPDOWN: {
      return { showing: true };
    }
    case HIDE_DROPDOWN: {
      return { showing: false };
    }
    default:
      return state;
  }
}