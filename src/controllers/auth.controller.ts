import { Request, Response } from "express";
import User, { IUser } from "../model/User";
import jwt from "jsonwebtoken";
import config from "../config";

export const signup = async (req: Request, res: Response) => {
  try {
    const user: IUser = new User({
      username: req.body.username,
      email: req.body.email,
      telephone: req.body.telephone,
      password: req.body.password,
    });
    user.password = await user.encryptPassword(user.password);
    const savedUser = await user.save();

    const token = jwt.sign({ _id: savedUser._id }, config.TOKEN_SECRET);
    res.header("auth-token", token).json(savedUser);
  } catch (error) {
    res.status(403).json(error.message);
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(403).json(error.message);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error("user not found");
    if (req.body.email) {
      throw new Error("email can not be edited");
    }
    if (req.body.password) {
      req.body.password = await user.encryptPassword(req.body.password);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) throw new Error("user not found");
    res.json(updated);
  } catch (error) {
    res.status(403).json(error.message);
  }
};

export const signin = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Email or password is wrong");

  const correctPassword = await user.validatePassword(req.body.password);
  if (!correctPassword) return res.status(400).json("Invalid Password");

  const token = jwt.sign({ _id: user._id }, config.TOKEN_SECRET);

  res.header("auth-token", token).json({ user, token });
};

export const profile = async (req: Request, res: Response) => {
  const user = await User.findById(req.userId, { password: 0 }).populate("shippingAddresses");
  if (!user) return res.json(404).json("No user found");

  res.json(user);
};
