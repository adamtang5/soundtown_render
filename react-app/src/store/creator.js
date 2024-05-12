// constants
const NEW_CREATOR = "creator/NEW_CREATOR";

export const updateCreator = (creator) => ({
  type: NEW_CREATOR,
  creator,
});

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NEW_CREATOR: {
      const newState = {
        ...state,
        [action.creator.github_username]: action.creator,
      };
      return newState;
    }
    default:
      return state;
  }
}