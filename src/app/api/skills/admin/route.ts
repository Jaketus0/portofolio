import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, requireAdmin } from '@/lib/api-route';
import { skillService } from '@server/services/skill.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const admin = requireAdmin(req);
  if (admin instanceof Response) return admin;

  const skills = await skillService.getAllSkillsAdmin();
  return jsonSuccess(skills);
});
