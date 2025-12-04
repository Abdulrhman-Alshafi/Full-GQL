import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Task from "./models/Task.js";
import e from "express";

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
    tasks: async (_, { first = 10, after }, { userId }) => {
      if (!userId) throw new Error("Not authenticated");

      const query = { user: userId };

      if (after) {
        const afterTask = await Task.findById(after);
        if (!afterTask) throw new Error("Invalid cursor");
        query._id = { $lt: afterTask._id };
      }
      const tasks = await Task.find(query)
        .sort({ createdAt: -1 })
        .limit(first + 1);

      const hasNextPage = tasks.length > first;

      const sliedTasks = hasNextPage ? tasks.slice(0, -1) : tasks;

      return {
        edges: sliedTasks.map((task) => ({
          cursor: task.createdAt.getTime().toString(),
          node: task,
        })),
        pageInfo: {
          endCursor: sliedTasks.length
            ? sliedTasks[sliedTasks.length - 1].createdAt.getTime().toString()
            : null,
          hasNextPage,
        },
      };
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
