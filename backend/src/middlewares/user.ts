import {Request,Response,NextFunction} from "express"
import { User} from "../db/app";
import { verifyToken } from "../utils/jwtUtils";

async function userMiddleware (req:Request,res:Response,next:NextFunction){
    try {
      const authHeader = req.headers.authorization as string;
        if(!authHeader){
          res.json({
            msg:"Missing Token"
          })
        }
        const [,token]=authHeader.split(" ")
        const data=await verifyToken(token)
        if (data){
          const existingUser = await User.find({
          username:data.username
        });
        if (existingUser.length > 0) {
          (req as any).user=data.username
            next()
        }
        else {
            res.json({
              msg: "User Doesn't Exist",
            });
          }
        }
        else{
          res.json({
            msg: "Token verification failed",
          });
        }
    } catch (error) {
      console.error("Error in userMiddleware:", error);
      res.status(500).json({
        msg: "Internal Server Error",
      });
    }
  
}
export default userMiddleware