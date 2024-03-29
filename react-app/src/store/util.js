const GENERIC_ERROR = ["An error occurred. Please try again."];

export const actionGenerator = ({
  url, options, action, action2,
}) => {
  return async (dispatch) => {
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await res.json();
      await dispatch(action(data));
      if (action2) await dispatch(action2(data));
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