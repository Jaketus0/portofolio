import { z } from 'zod';
import { MESSAGE_MAX_LENGTH, MESSAGE_NAME_MAX_LENGTH } from '../utils/constants';

export const createMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(MESSAGE_NAME_MAX_LENGTH, `Name must be ${MESSAGE_NAME_MAX_LENGTH} chars max`),
  message: z.string().min(1, 'Message is required').max(MESSAGE_MAX_LENGTH, `Message must be ${MESSAGE_MAX_LENGTH} chars max`),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
