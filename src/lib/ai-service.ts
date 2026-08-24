import api from './api';
import type {
  HeroSection as HeroType,
  AboutSection as AboutType,
  Project,
  Skill,
  ContactInfo,
} from '../types';

// ---------------------------------------------------------------------------
// AI Assistant — frontend service layer (placeholder).
//
// DESIGN
//  - The assistant holds NO business logic of its own beyond fetching the
//    *existing* public API endpoints and reformatting the returned data into
//    friendly, on-brand answers.
//  - If a backend `/ai/*` endpoint is provided later, `ask()` below can be
//    switched to call it directly — everything else stays untouched.
//  - Everything here reads from the same public endpoints the rest of the
//    portfolio already uses (hero, about, projects, skills, contact).
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
}

export const PENDING_ID = 'pending-assistant';

const fetchJson = async <T,>(url: string): Promise<T | undefined> => {
  try {
    const { data } = await api.get(url);
    return data.data as T;
  } catch {
    return undefined;
  }
};

const waLink = (value: string) =>
  `https://wa.me/${value.replace(/\D/g, '')}`;

const parseStack = (stack: any): string[] => {
  if (!stack) return [];
  try {
    return typeof stack === 'string' ? JSON.parse(stack) : stack;
  } catch {
    return [];
  }
};

/**
 * Builds a reply for a user prompt using only existing public data.
 * If a real backend AI endpoint ever exists this becomes a thin proxy.
 */
export async function askAssistant(prompt: string): Promise<string> {
  const normalized = prompt.trim().toLowerCase();

  const [hero, about, projects, skills, contact] = await Promise.all([
    fetchJson<HeroType>('/hero'),
    fetchJson<AboutType>('/about'),
    fetchJson<Project[] | Project>('/projects'),
    fetchJson<Record<string, Skill[]>>('/skills'),
    fetchJson<ContactInfo>('/contact'),
  ]);

  const projectList = Array.isArray(projects) ? projects : [];

  // "download cv / resume"
  if (/(cv|resume|download)/i.test(normalized)) {
    if (about?.resumeUrl || about?.cvUrl) {
      const link = about.resumeUrl || about.cvUrl;
      return `You can grab my latest CV right here:\n\n**[Download CV](${link})**\n\nIf the link doesn't auto-open, just copy and paste this in a browser:\n\n\`${link}\``;
    }
    return `I don't have a public CV link configured yet — but feel free to **reach out** and I'll send it over.`;
  }

  if (/(contact|email|hire|reach|whatsapp|call)/i.test(normalized)) {
    const lines = [`Here's the best way to reach me:\n`];
    if (contact?.email)
      lines.push(`- **Email:** \`${contact.email}\` `);
    if (contact?.whatsapp) lines.push(`- **WhatsApp:** ${waLink(contact.whatsapp)} `);
    if (contact?.linkedin) lines.push(`- **LinkedIn:** <${contact.linkedin}> `);
    if (contact?.github) lines.push(`- **GitHub:** <${contact.github}> `);
    if (contact?.availabilityStatus)
      lines.push(
        `\n> ${contact.isAvailable ? '🟢' : '🟠'} *${contact.availabilityStatus}*`
      );
    return lines.join('\n');
  }

  // tech stack ====
  if (/(stack|tech|skill|tools|languages)/i.test(normalized)) {
    if (skills && Object.keys(skills).length) {
      const friendly = (k: string) =>
        k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const blocks: string[] = [];
      for (const [cat, list] of Object.entries(skills)) {
        const names = list.map((s) => s.name).join(' · ');
        blocks.push(`**${friendly(cat)}**\n> ${names}`);
      }
      return `Here's the tech stack powering this site:\n\n${blocks.join(
        '\n\n'
      )}`;
    }
    return 'I could not load the skills entry right now — try again in a moment.';
  }

  // latest projects ====
  if (/(project|work|portfolio|latest|show)/i.test(normalized)) {
    const top = projectList.slice(0, 3);
    if (!top.length)
      return 'There are no published projects yet. Check back soon!';
    const lines = top.map((p) => {
      const stack = parseStack(p.techStack).slice(0, 4).join(' · ');
      const links = [
        p.liveUrl ? `[Live](${p.liveUrl})` : null,
        p.githubUrl ? `[Code](${p.githubUrl})` : null,
      ]
        .filter(Boolean)
        .join(' · ');
      return `**${p.title}**${p.featured ? ' ⭐' : ''}\n${p.shortDescription}\n\n> ${stack}\n\n${links}`;
    });
    return `Here are some of my latest projects:\n\n${lines.join(
      '\n\n'
    )}`;
  }

  // tell me about developer ====
  if (/(about|developer|you|who)/i.test(normalized)) {
    const greeting = hero?.name
      ? `I'm **${hero.name}**`
      : "I'm the assistant here";
    const role = hero?.jobTitle ? `, a ${hero.jobTitle}` : '';
    const blurb = hero?.description || about?.longDescription || '';
    return `Hi! ${greeting}${role}.\n\n${blurb}`;
  }

  // fallback ====
  return [
    `Hi! I can ${hero?.name ? `help you get to know **${hero.name}**` : 'help you to get around this portfolio'} better. Try one of these:\n`,
    `- **Tell me about this developer** — short intro & focus`,
    `- **Show latest projects** — recent work, links, tech`,
    `- **Explain tech stack** — languages, tools, platforms`,
    `- **Contact information** — email, WhatsApp, LinkedIn, GitHub`,
    `- **Download CV** — get the resume`,
  ].join('\n');
}

/**
 * Placeholder document for wiring an actual AI/LLM endpoint later.
 * When a backend exists this function will simply forward `messages`
 * to `POST /api/ai/chat` and return `data.data.reply`.
 */
export async function askBackendChat(): Promise<never> {
  return Promise.reject(new Error('No AI backend configured yet.'));
}