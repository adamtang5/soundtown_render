// constants
const TOGGLE_DROPDOWN = "dropdown/TOGGLE_DROPDOWN";
const SHOW_DROPDOWN = "dropdown/SHOW_DROPDOWN";
const HIDE_DROPDOWN = "dropdown/HIDE_DROPDOWN";

export const toggleShowDropdown = () => ({
  type: TOGGLE_DROPDOWN,
});

export const ShowDropdown = () => ({
  type: SHOW_DROPDOWN,
});

export const hideDropdown = () => ({
  type: HIDE_DROPDOWN,
});

// State shape:

// state.dropdown --> {
//   showAnyDropdown: true | false,
// }

const initialState = {
  showAnyDropdown: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DROPDOWN: {
      const newState = {
        showAnyDropdown: !state.showAnyDropdown,
      };
      return newState;
    }
    case SHOW_DROPDOWN: {
      return { showAnyDropdown: true };
    }
    case HIDE_DROPDOWN: {
      return { showAnyDropdown: false };
    }
    default:
      return state;
  }
}