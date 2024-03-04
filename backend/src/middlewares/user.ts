import {Request,Response,NextFunction} from "express"
import { User} from "../db/app";

async function userMiddleware (req:Request,res:Response,next:NextFunction){
    const { username, password } = req.headers;
    const existingUser = await User.find({
      username,
      password,
    });
    if (existingUser.length > 0) {
        next()
    }
    else {
        res.json({
          msg: "User Doesn't Exist",
        });
      }
}
export default userMiddleware