import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const token = req.cookies.token || "";
    let userId = null;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        userId = payload.userId;
      } catch (e) {}
    }
    return { req, res, userId };
  },
});

await server.start();
server.applyMiddleware({ app, cors: false });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
