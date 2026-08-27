import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody } from '@/lib/api-route';
import { contactService } from '@server/services/contact.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const result = await contactService.getContactInfo();
  return jsonSuccess(result);
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const body = await readBody(req);
  const result = await contactService.updateContactInfo(admin.adminId, body);
  return jsonSuccess(result);
});
