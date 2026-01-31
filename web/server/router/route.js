import { loginController } from "../controllers/loginController.js"
import authRouter from "./auth.js"
import { authenticate } from "../middlewares/authenticate.js"
import { getUser } from "../controllers/userController..js"

import { notFound } from "../controllers/notFound.js"
import { Router } from "express"

const router = Router()

// Auth routes
router.post("/login", loginController)          
router.use("/auth", authRouter)                 
router.get("/protected", authenticate, (req, res) => {
  res.json({ msg: "Secret area", user: req.user })   
})
router.get("/profile", authenticate, getUser)
router.use(notFound)

export default router
