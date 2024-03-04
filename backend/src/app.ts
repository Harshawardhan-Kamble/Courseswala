import express from "express"
import adminRouter from "./routes/admin"
import userRouter from "./routes/user"
const app = express();
app.use(express.json())
app.use("/admin", adminRouter)
app.use("/user", userRouter)  
const PORT=3000
app.listen(PORT, () => {
  console.log("Server listening on port 3000");
});
