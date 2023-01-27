const LOAD_USERS = "user/LOAD_USERS";
const EDIT_USER = "user/EDIT_USER";

const loadUsers = (users) => ({
  type: LOAD_USERS,
  users,
});

const editUser = (user) => ({
  type: EDIT_USER,
  user,
})

//! Get Users from Database
export const getAllUsers = () => async (dispatch) => {
  const response = await fetch("/api/users/");
  if (response.ok) {
    const users = await response.json();
    dispatch(loadUsers(users));
  }
};

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
