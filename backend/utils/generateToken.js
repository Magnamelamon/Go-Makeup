import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '8h', // FIX #8: Reduced from 30d to 8h
  });
};

export default generateToken;
