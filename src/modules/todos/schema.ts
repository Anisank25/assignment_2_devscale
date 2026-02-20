import z from 'zod'

export const createtoDosSchema = z.object ({
    activity: z.string().min(4),
    priority : z.enum(["Low", "Medium", "High"]),
    status: z.enum(["done", "not done"])
})