import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

export const registerController = async (req, res) => {

  let { name, email, password } = req.body

  if (!email || !password)
    return res.status(200).json({
    message:"All fields are required"})
  try {

    let isExisted = await userModel.findOne({
      email,
    })

    if (isExisted)
      return res.status(400).json({
      message:"User is already existed from this email "
      })

    // let hash = bcrypt.hashSync(password,10)

    let newUser = await userModel.create({
      name,
      email,
      password,
    })

    let accessToken = generateAccessToken(newUser._id)
    let refreshToken = generateRefreshToken(newUser._id)

    res.cookie("accessToken", accessToken, {
     httpOnly:true,
     secure: false,
     sameSite: "lax",
     maxAge:  60 * 60 * 1000 // 1 hour
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge:24*60*60*1000 //1day
    })


    return res.status(201).json({
      message: "user  created successfully",
      user: newUser,
      accessToken,
      refreshToken
    })

  } catch (error) {
    console.error("Error in registerController:", error);
  }

 }

export const loginController = async (req, res) => {

  let { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({
      message: "All fields are required"
    })

  const user = await userModel.findOne({
    email
  }).select("+password")


  if (!user)
    return res.status(400).json({
      message: "User not found"
    })

  const isMatch = await user.comparePassword(password)

  if (!isMatch)
    return res.status(400).json({
      message: "Invalid credentials"
    })




    let accessToken = generateAccessToken(user._id);
    let refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, //1day
    });

  user.password = undefined; // Exclude password from the response

    return res.status(201).json({
      message: "user  login successfully",
      user: user,
      accessToken,
      refreshToken,
    })
 }


export async function generateNewAcessToken (req, res) {

  try {

    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
    
    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    let accessToken = generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      message: "New access token generated successfully",
      accessToken,
    });


  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    })

  }
 }
