export const isLoggedIn = (user) => {
    return user !== null && user !== undefined;
  };
  
export const formatDate = (date) => {
  // Convert a Date object into a desired format. This is a simple example.
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};