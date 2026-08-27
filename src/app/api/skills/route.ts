import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess } from '@/lib/api-route';
import { skillService } from '@server/services/skill.service';

export const GET = apiHandler(async (req: NextRequest) => {
  const grouped = await skillService.getSkillsGrouped();
  return jsonSuccess(grouped);
});
