import { GENERIC_ERROR } from "../util";

// constants
const LOAD_USERS = "user/LOAD_USERS";
const NEW_USER = "user/NEW_USER";
const EDIT_USER = "user/EDIT_USER";

const loadUsers = (users) => ({
  type: LOAD_USERS,
  users,
});

const newUser = (user) => ({
  type: NEW_USER,
  user,
})

const editUser = (user) => ({
  type: EDIT_USER,
  user,
})

// Get Users from Database
export const getAllUsers = () => async (dispatch) => {
  const response = await fetch("/api/users/");
  if (response.ok) {
    const users = await response.json();
    dispatch(loadUsers(users));
  }
};

// Get One User from the Database by id
export const getUser = (id) => async (dispatch) => {
  const response = await fetch(`/api/users/${id}`);
  if (response.ok) {
    const user = await response.json();
    dispatch(newUser(user));
    return user;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return GENERIC_ERROR;
  }
}

// Edit User Details
export const editUserDetails = (id, data) => async (dispatch) => {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    body: data,
  });
  if (res.ok) {
    const user = await res.json();
    dispatch(editUser(user));
    return user;
  }
};

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
    case EDIT_USER: {
      const newState = { ...state };
      newState[action.user.id] = action.user;
      return newState;
    }
    default:
      return state;
  }
}
