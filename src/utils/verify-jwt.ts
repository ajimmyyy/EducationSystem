import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET || "w53ybxytdqbylwgqs1qotuuuyn3aolc3";

const verifyJwt = (jwtToken: string) => {
  if (!jwtToken) return null;
  try {
    const decoded = jwt.verify(jwtToken, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

export default verifyJwt;
