import e from "express";
import router from "./router/route";

const app = e();
const PORT = 3000;

app.use(e.json());
app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})