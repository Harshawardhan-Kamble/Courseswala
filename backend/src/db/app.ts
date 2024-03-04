import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose,{InferSchemaType,Schema} from "mongoose";
dotenv.config();
const app = express();
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
export const Course = mongoose.model<InferSchemaType<typeof courseSchema>>("Course", courseSchema);
export const Admin = mongoose.model<InferSchemaType<typeof adminSchema>>("Admin", adminSchema);
export const User = mongoose.model<InferSchemaType<typeof adminSchema>>("User", userSchema);

