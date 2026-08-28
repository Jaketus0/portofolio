import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess } from '@/lib/api-route';
import { contactService } from '@server/services/contact.service';

export const GET = apiHandler(async (_req: NextRequest) => {
  const contact = await contactService.getContactInfo();
  return jsonSuccess(contact);
});
