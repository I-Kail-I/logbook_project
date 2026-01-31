import jwt from "jsonwebtoken"
import { config } from "dotenv"
import process from "node:process"

config()

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @param {import('express'.ErrorRequestHandler)} error
 *
 * Authenticating the cookies if it's exist or not
 */

export function authenticate(req, res, next) {
  const hdr = req.headers['authorization']
  const token = hdr && hdr.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token missing' })

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Token invalid' })
    req.user = payload
    next()
  })
}

