const GENERIC_ERROR = ["An error occurred. Please try again."];

export const actionGenerator = ({
  url, options, action
}) => {
  return async (dispatch) => {
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await res.json();
      dispatch(action(data));
      return data;
    } else if (res.status < 500) {
      const data = await res.json();
      if (data.errors) {
        return data.errors;
      }
    } else {
      return GENERIC_ERROR;
    } 
  };
};