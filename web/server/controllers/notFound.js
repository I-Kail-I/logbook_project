/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

export async function notFound(req, res, next) {
  res.status(404).render("404", { title: "Page Not Found" })
}
