import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

interface IPayload {
  _id: string;
  iat: number;
  ext: number;
}

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json("Access denied");

    const payload = jwt.verify(token, config.TOKEN_SECRET) as IPayload;

    req.userId = payload._id;
    next();
  } catch (error) {
    console.log("error en tokenValidation", error.message);
    res.status(401).json(error.message)
  }
};
