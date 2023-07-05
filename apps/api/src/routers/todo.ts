import { Router } from "express";
import { TodoModel } from "../schemas";
import prisma from "../lib/prisma";

export function TodoRouter() {
  const router = Router();
  router
    .get("/", async (req, res) => {
      const todos = await prisma.todo.findMany();
      res.json(todos);
    })
    .post("/", async (req, res) => {
      const parsed = TodoModel.partial().parse(req.body);
      const todo = await prisma.todo.create({
        data: {
          ...parsed,
        },
      });
      res.json(todo);
    })
    .put("/", async (req, res) => {
      const parsed = TodoModel.partial().parse(req.body);
      const todo = await prisma.todo.update({
        where: {
          id: parsed.id,
        },
        data: {
          ...parsed,
        },
      });
      res.json(todo);
    })
    .delete("/", async (req, res) => {
      const parsed = TodoModel.parse(req.body);
      const todo = await prisma.todo.delete({
        where: {
          id: parsed.id,
        },
      });
      res.json(todo);
    });

  return router;
}
