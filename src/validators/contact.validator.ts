import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(5000),
  // Hidden honeypot: legitimate visitors must leave this blank.
  website: z.string().max(500).optional().default('')
});

export type ContactInput = z.infer<typeof contactSchema>;
