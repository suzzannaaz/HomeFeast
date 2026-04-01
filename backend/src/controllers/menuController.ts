import { Request, Response } from "express";
import Menu, { IMenu } from "../models/menu.js";

// ➕ Create Menu
export const createMenu = async (req: Request, res: Response) => {
  try {
    const menu: IMenu = new Menu({
      ...req.body,
      cook: req.user?.id,
    });

    const savedMenu = await menu.save();
    res.status(201).json(savedMenu);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Get All Menus
export const getMenus = async (_req: Request, res: Response) => {
  try {
    const menus = await Menu.find().populate("cook", "name");
    res.json(menus);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Menu By ID
export const getMenuById = async (req: Request, res: Response) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menu);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get menus by cook
export const getMenusByCook = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.find({ cook: req.params.cookId });

    res.json(menus);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Update Menu
export const updateMenu = async (req: Request, res: Response) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedMenu);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Menu
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};