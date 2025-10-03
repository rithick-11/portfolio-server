import jwt from "jsonwebtoken";

const usetAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Fixed typo: authoriaztion -> authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        msg: "Authorization header missing. Please login.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token format. Use 'Bearer <token>'",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "rithick"); // Use env variable

    req.body.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (err) {
    console.error("Authentication Error:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        msg: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        msg: "Token expired. Please login again.",
      });
    }
    
    return res.status(500).json({
      success: false,
      msg: "Authentication failed",
    });
  }
};

export default usetAuthentication;
