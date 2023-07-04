
const { Router } = require('express');
const { TodoModel } = require('../schemas/todo');
const prisma = require('../lib/prisma');


export function TodoRouter() {
    const router = Router();
    router.get('/', async (req, res) => {
        const todos = await prisma.todo.findMany();
        res.json(todos);
    });
    router.post('/', async (req, res) => {
        const parsed = TodoModel.partial().parse(req.body)

        const todo = await prisma.todo.create({
            data: {
                ...parsed
            },
        });
        res.json(todo);
    });
    return router;

}
