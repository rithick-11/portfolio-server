import jwt from "jsonwebtoken";

const isUserAuthorized = async (req, res, next) => {
  if (req.headers.authoriaztion !== undefined) {
    try {
      const token = req.headers.authoriaztion.split(" ")[1];
      const { userId, username } = await jwt.verify(token, "rithick");
      req.body.user = { username, userId };
      req.body.userAuthorized = true;
      next();
    } catch (err) {
      req.body.userAuthorized = false;
      next();
    }
  } else {
    req.body.userAuthorized = false;
    next();
  }
};

export default isUserAuthorized;
