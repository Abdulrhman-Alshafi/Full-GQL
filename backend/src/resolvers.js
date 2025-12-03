import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Task from "./models/Task.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const resolvers = {
  //Querys
  Query: {
    //get user {me account}
    me: async (_, __, { userId }) => {
      if (!userId) throw new Error("Not authenticated");
      return await User.findById(userId);
    },
    //get user tasks
    tasks: async (_, __, { userId }) => {
      if (!userId) throw new Error("Not authenticated");
      return Task.find({ user: userId }).sort({ createdAt: -1 });
    },
  },

  //Mutations
  Mutation: {
    // register function
    register: async (_, { input }, { res }) => {
      const hashed = await bcrypt.hash(input.password, 12);
      const user = await User.create({ ...input, password: hashed });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return { user, token };
    },
    //login function
    login: async (_, { input }, { res }) => {
      const user = await User.findOne({ email: input.email });
      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return { user, token };
    },
    //create task function
    createTask: async (_, { input }, { userId }) => {
      if (!userId) throw new Error("Not authenticated");
      return Task.create({ ...input, user: userId });
    },
    //update user function
    updateTask: async (_, { id, input }, { userId }) => {
      if (!userId) throw new Error("Not authenticated");
      const task = await Task.findOne({ _id: id, user: userId });
      if (!task) throw new Error("Task not found");
      Object.assign(task, input);
      return await task.save();
    },
    //delete account function
    deleteTask: async (_, { id }, { userId }) => {
      if (!userId) throw new Error("Not authenticated");
      const result = await Task.deleteOne({ _id: id, user: userId });
      return result.deletedCount > 0;
    },
  },
};
