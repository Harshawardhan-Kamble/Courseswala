import { Router } from "express";
import adminMiddleware from "../middlewares/admin";
import { Admin, Course } from "../db/app";
import { Request, Response } from "express";
const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    await Admin.create({
      username,
      password,
    });
    res.json({
      message: "Admin created Succesfully",
    });
  } catch (error) {
    console.log("Err", error);
  }
});

router.post(
  "/courses",
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { title, description, price, imageLink } = req.body;

      const newCourse = await Course.create({
        title,
        description,
        price,
        imageLink,
      });
      res.json({
        msg: "Course Created Succesfully",
        courseId: newCourse._id,
      });
    } catch (error) {
      console.log("Err", error);
    }
  }
);

router.get("/courses", adminMiddleware, async (req: Request, res: Response) => {
    const response = await Course.find({});
    res.json({
        courses: response
    })
});

export default router;
