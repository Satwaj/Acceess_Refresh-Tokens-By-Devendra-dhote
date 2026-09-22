import jwt from "jsonwebtoken"

 export let generateAccessToken = (userId) => {

  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "1h"
  })
}

 export let generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn:"1d"
  })
}
