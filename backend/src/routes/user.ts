import {Router,Request,Response} from "express"
import userMiddleware from "../middlewares/user";
import { User,Course } from "../db/app";
const router=Router()

router.post('/signup', async (req:Request, res:Response) => {
    try {
            const { username, password } = req.body;
            const existingUser = await User.find({
              username: username,
            });
        
            if (existingUser.length > 0) {
              res.json({
                msg: "User Already exists",
              });
            } else {
              await User.create ({
                username,
                password,
              });
              res.json({
                message: "User created Succesfully",
              });
            }
          } catch (error) {
            console.log("Err", error);
          }
        });

router.get('/courses', async (req:Request,res:Response) => {
    const response = await Course.find({});
    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req:Request, res:Response) => {
    const courseid = req.params.courseId;
    const username = req.headers.username;
          const existingCourse = await Course.find({
            _id: courseid,
          });
    
          if (existingCourse.length > 0) {
            await User.updateOne(
              { username },
              { $push: { purchasedCourses: existingCourse } }
            );
            res.json({
              msg: "Course Purchased Successfully",
            });
          } else {
            res.json({
              msg: "Page not found",
            });
          }
});

router.get('/purchasedCourses', userMiddleware,  async (req, res) => {
    const username = req.headers.username;
    const purchasedCourses = await User.find(
        {
          username,
        },
        { purchasedCourses: 1, _id: 0 }
      );
      res.json({
        output: purchasedCourses,
      });
});
export  default router