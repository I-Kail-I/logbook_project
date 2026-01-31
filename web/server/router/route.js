import { loginController } from "../controllers/loginController.js"
import { authenticate } from "../middlewares/authenticate.js"
import { getUser } from "../controllers/userController..js"
import { logUserController } from "../controllers/userLogController.js"
import { statsController } from "../controllers/statsController.js"

import { notFound } from "../controllers/notFound.js"
import { Router } from "express"

const router = Router()

// Auth routes
router.post("/login", loginController)
router.get("/profile", authenticate, getUser)

// Stats routes
router.get("/stats", authenticate, statsController)

// User handler
router.get("/user-log/:id", authenticate, logUserController)

// 404 handler
router.use(notFound)

export default router
