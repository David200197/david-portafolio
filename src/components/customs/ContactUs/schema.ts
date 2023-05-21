import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { EMAIL, MESSAGE, NAME } from './constant'

const contactSchema = z.object({
  [NAME]: z.string().min(1),
  [EMAIL]: z.string().email().min(1),
  [MESSAGE]: z.string().min(1)
})
export const contactResolver = zodResolver(contactSchema)
export type ContactField = z.infer<typeof contactSchema>
