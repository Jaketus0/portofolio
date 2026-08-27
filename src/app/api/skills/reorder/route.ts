import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { skillService } from '@server/services/skill.service';
import { reorderSkillsSchema } from '@server/validations/skill.validation';

export const PUT = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const body = await readBody(req);
  const result = await validateBody(reorderSkillsSchema, body);
  if (result.error) return result.error;

  await skillService.reorderSkills(admin.adminId, result.data.items);
  return jsonSuccess(null, 'Skills reordered');
});
