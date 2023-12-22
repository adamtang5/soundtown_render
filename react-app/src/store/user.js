import { actionGenerator } from "./util";

// constants
const LOAD_USERS = "user/LOAD_USERS";
const NEW_USER = "user/NEW_USER";

const loadUsers = (users) => ({
  type: LOAD_USERS,
  users,
});

const newUser = (user) => ({
  type: NEW_USER,
  user,
})

// Get Users from Database
export const getAllUsers = () => actionGenerator({
  url: "/api/users/",
  action: loadUsers,
});

// Get One User from the Database by id
export const getUser = (id) => actionGenerator({
  url: `/api/users/${id}`,
  action: newUser,
});

// Edit User Details
export const editUser = (id, data) => actionGenerator({
  url: `/api/users/${id}`,
  options: {
    method: "PUT",
    body: data,
  },
  action: newUser,
});

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NEW_USER: {
      const newState = {
        ...state,
        [action.user.id]: action.user,
      };
      return newState;
    }
    case LOAD_USERS: {
      const newState = { ...state };
      action.users.forEach((user) => {
        newState[user.id] = user;
      });
      return newState;
    }
    default:
      return state;
  }
}
