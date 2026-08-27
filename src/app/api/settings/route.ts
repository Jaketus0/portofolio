import { NextRequest, NextResponse } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { settingsService } from '@server/services/settings.service';
import { updateSettingsSchema } from '@server/validations/settings.validation';

export const GET = apiHandler(async (req: NextRequest) => {
  const result = await settingsService.getSettings();
  return jsonSuccess(result);
});

export const PUT = apiHandler(async (req: NextRequest) => {
  const adminOrRes = requireAdmin(req);
  if (adminOrRes instanceof NextResponse) return adminOrRes;
  const admin = adminOrRes;
  const body = await readBody(req);
  const { data, error } = await validateBody(updateSettingsSchema, body);
  if (error) return error;
  const result = await settingsService.updateSettings(admin.adminId, data);
  return jsonSuccess(result);
});
