import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { createtoDosSchema } from './schema.js'
import { prisma } from '../../utils/prisma.js';

export const todoRouter = new Hono()
    .get("/", async(c) => {
      const token = c.req.header("token")
      if(!token) {
        return c.json ({ message : "token is required" })
      }
      const todos = await prisma.todo.findMany()
      return c.json ({ todos })
    })

    .get('/:id', async (c) => {
      const todoId = c.req.param("id")
      const todo = await prisma.todo.findUnique({
        where : {
          id : Number(todoId)
        }
      })

      if (!todo) {
        return c.json({ message: "toDo not found" }, 404)
      }

      return c.json({ todo })
    })

    .post('/',zValidator("json",createtoDosSchema),async (c) => {
      const body = c.req.valid("json")

      const newToDo  = await prisma.todo.create({
        data : 
        {
          activity : body.activity,
          priority : body.priority,
          status : body.status
        }
      })

      return c.json({
        message: "new toDo created",
        data: newToDo
      }, 201)
    })

    .patch('/:id', zValidator("json",createtoDosSchema.partial()), async (c) => {
      try {
        const todoId = c.req.param("id")
        const body = c.req.valid("json")

        const checkIdTodo = await prisma.todo.findUnique({
          where : {
            id : Number(todoId)
          }
        })

        if (!checkIdTodo) {
          return c.json({ message: "toDo not found" }, 404)
        }

        const updateToDo = await prisma.todo.update({
          where : {
            id : Number(todoId)
          },
          data : {
            activity : body.activity,
            priority : body.priority,
            status : body.status
          }
        })

        return c.json({ message: `toDo ${todoId} updated`, data: updateToDo })
      } catch (error) {
        return c.json({ message: "Error updating toDo", error }, 500)
      }
      
    })

    .delete('/:id', async (c) => {
        try {
          const todoId = c.req.param("id")

          const checkIdTodo = await prisma.todo.findUnique({
            where : {
              id : Number(todoId)
            }
          })

          if (!checkIdTodo) {
            return c.json({ message: "toDo not found" }, 404)
          }

          const deleteToDo = await prisma.todo.delete({
            where : {
              id : Number(todoId)
            }
          })

          return c.json({ message: `toDo ${todoId} deleted`, data: deleteToDo })
        } catch (error) {
          return c.json({ message: "Error deleting toDo", error }, 500)
        }
    })
   