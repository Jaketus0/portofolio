import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin, readBody, validateBody } from '@/lib/api-route';
import { skillService } from '@server/services/skill.service';
import { updateSkillSchema } from '@server/validations/skill.validation';

export const PUT = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  const body = await readBody(req);
  const result = await validateBody(updateSkillSchema, body);
  if (result.error) return result.error;

  const updated = await skillService.updateSkill(admin.adminId, id, result.data);
  return jsonSuccess(updated, 'Skill updated');
});

export const DELETE = apiHandler(async (req: NextRequest, ctx: any) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const { id } = await ctx.params;
  await skillService.deleteSkill(admin.adminId, id);
  return jsonSuccess(null, 'Skill deleted');
});
