import {Request,Response,NextFunction} from "express"
import { Admin } from "../db/app";

async function adminMiddleware (req:Request,res:Response,next:NextFunction){
    const { username, password } = req.headers;
    const existing = await Admin.find({
      username,
      password,
    });
    if (existing.length > 0) {
        next()
    }
    else {
        res.json({
          msg: "Admin Doesn't Exist",
        });
      }
}
export default adminMiddleware