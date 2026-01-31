import e from "express"
import morgan from "morgan"
import router from "./router/route.js"

const app = e()
const PORT = 3000

app.use(e.json())
app.use(morgan("short"))
app.use("/api", router)

app.listen(PORT, () => {
  console.log("Running on port:" + PORT)
})
