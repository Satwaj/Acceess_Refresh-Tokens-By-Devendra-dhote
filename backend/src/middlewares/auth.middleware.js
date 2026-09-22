import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";

export let authMidlleware = async (req, res, next) => {
  // Implementation for authentication middleware

  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Access token not found",
      });
    }

    // Verify the access token

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user; // Attach the user object to the request for further use

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log(error.name);
    console.log(error.message);

    return res.status(401).json({
      message: "Invalid access token",
    });
  }
}
