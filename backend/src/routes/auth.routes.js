import { Router } from "express";
import { loginController, registerController,generateNewAcessToken } from "../controllers/auth.controller.js"
import { authMidlleware } from "../middlewares/auth.middleware.js";
import { authValidator } from "../validators/auth.validator.js";


const router = Router()

router.post("/register",authValidator, registerController)
router.post("/login", authValidator, loginController)
router.get("/me", authMidlleware, (req, res) => {
  return res.status(200).json({
    message: "user fetched successfully",
    user: req.user
  })
})

router.get("/getAccessToken", generateNewAcessToken)


export default router
