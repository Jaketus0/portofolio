import { z } from 'zod';

export const createContactSubmissionSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  phone: z
    .string()
    .min(6, 'Phone number must be at least 6 characters')
    .max(30, 'Phone number must be at most 30 characters')
    .regex(/^[+0-9\s\-()]+$/, 'Phone number contains invalid characters'),
  email: z.string().email('Please enter a valid email address').max(150),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message must be at most 3000 characters'),
  captchaToken: z.string().min(1, 'Captcha is required'),
  captchaAnswer: z.union([z.string(), z.number()]).refine((v) => v !== '' && v !== null, {
    message: 'Captcha answer is required',
  }),
});

export type CreateContactSubmissionInput = z.infer<typeof createContactSubmissionSchema>;