export const getTokenFromHeader = (req) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (token === undefined) {
    return "No token found in the Header";
  } else {
    return token;
  }
};

export default getTokenFromHeader;
