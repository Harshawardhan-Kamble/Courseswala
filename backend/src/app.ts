import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
const app = express();
import mongoose,{InferSchemaType,Schema} from "mongoose";
mongoose.connect(process.env.DATABASE_URL!);
app.use(express.json());
const courseSchema=new Schema(
  {
    title: String,
    description: String,
    price: Number,
    imageLink: String,
  }
)
const adminSchema=new Schema({
  username: String,
  password: String,
}

)
const userSchema=new Schema(
  {
    username: String,
    password: String,
    premium: {
      type: Boolean,
      default: false,
    },
    purchasedCourses: {
      type: [],
      default: [],
    },
  }
)
const Course = mongoose.model<InferSchemaType<typeof courseSchema>>("Course", courseSchema);
const Admin = mongoose.model<InferSchemaType<typeof adminSchema>>("Admin", adminSchema);
const User = mongoose.model<InferSchemaType<typeof adminSchema>>("User", userSchema);
const getCourses = async (req: Request, res: Response) => {
  const { username, password } = req.headers;
  const existingAdmin = await Admin.find({
    username,
    password,
  });
  const existingUser = await User.find({
    username,
    password,
  });
  const courses = await Course.find();
  if (existingUser.length > 0 || existingAdmin.length > 0) {
    res.json({
      Output: courses,
    });
  } else {
    res.json({
      msg: "Invalid Credentials",
    });
  }
};
app.post("/admin/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const admin = new Admin({
      username,
      password,
    });
    await admin.save();
    res.json({
      message: "Admin created Succesfully",
    });
  } catch (error) {
    console.log("Err", error);
  }
});
app.post("/admin/courses", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.headers;
    const { title, description, price, imageLink } = req.body;
    const existing = await Admin.find({
      username,
      password,
    });
    if (existing.length > 0) {
      const course = new Course({
        title,
        description,
        price,
        imageLink,
      });
      await course.save();
      const courseId = await Course.find({
        title,
      })
        .select("_id")
        .exec();
      res.json({
        msg: "Course Created Succesfully",
        courseId: courseId,
      });
    } else {
      res.json({
        msg: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log("Err", error);
  }
});
app.get("/admin/courses", getCourses);
app.get("/users/courses", getCourses);
app.post("/users/signup", async (req: Request, res: Response) => {
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
      const user = new User({
        username,
        password,
      });
      await user.save();
      res.json({
        message: "User created Succesfully",
      });
    }
  } catch (error) {
    console.log("Err", error);
  }
});
app.post("/users/courses/:courseId", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.headers;
    const existingUser = await User.find({
      username,
      password,
    });
    console.log(existingUser);
    if (existingUser.length > 0) {
      const courseid = req.params.courseId;
      // console.log(courseid)
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
    } else {
      res.json({
        msg: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
app.get("/users/purchasedCourses", async (req: Request, res: Response) => {
  const { username, password } = req.headers;
  const existingUser = await User.find({
    username,
    password,
  });

  if (existingUser.length > 0) {
    const purchasedCourses = await User.find(
      {
        username,
      },
      { purchasedCourses: 1, _id: 0 }
    );
    res.json({
      output: purchasedCourses,
    });
  } else {
    res.json({
      msg: "Invalid Credintials",
    });
  }
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
