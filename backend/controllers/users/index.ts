import {
  loginService,
  insertUserService,
  updateUserService,
  deleteUserService,
} from "../../services";
import { LoginInput, InsertUserInput, UpdateUserInput } from "../../types";
import { Request, Response, NextFunction } from "express";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password }: LoginInput = req.body;
  try {
    const { success, id } = await loginService(email, password);
    res.status(200).send({ success, id });
    res.end();
  } catch (error) {
    next(error);
  }
};

export const insertUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password }: InsertUserInput = req.body;
  try {
    const id = await insertUserService(email, password);

    res.status(200).send({ success: true, id });
    res.end();
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  const { email, password }: UpdateUserInput = req.body;
  try {
    await updateUserService(parseInt(userId), email, password);

    res.status(200).send({ success: true });
    res.end();
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  try {
    await deleteUserService(parseInt(userId));

    res.status(200).send({ success: true });
    res.end();
  } catch (error) {
    next(error);
  }
};
