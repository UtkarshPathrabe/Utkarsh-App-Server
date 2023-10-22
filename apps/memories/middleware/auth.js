import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData?.id;
      req.userName = decodedData?.name;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
      req.userName = decodedData?.name;
    }
    next();
  } catch (error) {
    console.error(error);
  }
};

export default auth;
