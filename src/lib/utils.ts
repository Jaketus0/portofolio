import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr = 'MMM yyyy') {
  if (!date) return '';
  const d = new Date(date);
  
  // Simple format implementation to avoid pulling in full date-fns if not needed yet
  // We have date-fns installed though, so we could use it if things get complex.
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (formatStr === 'MMM yyyy') {
     return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  
  return d.toLocaleDateString();
}
