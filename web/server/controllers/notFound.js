export async function notFound(req, res) {
  res.send(404).json({
    message: "url endpoint tidak valid",
  })
}
