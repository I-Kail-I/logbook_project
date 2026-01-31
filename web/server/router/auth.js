import express from "express"
import { Router } from "express"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import process from "node:process"

config()

const router = Router()

/**
 * @param {import('express').Request} req
 * @param {import('express'.Response)} res
 *
 * Generating cookies for the user when login
 */
router.post("/login", express.json(), (req, res) => {
  const { nip, password } = req.body

  if (nip !== "demo" || password !== "demo") {
    return res.status(401).json({ error: "Bad credentials" })
  }

  const payload = { sub: nip }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" })

  res.json({ token })
})

export default router
