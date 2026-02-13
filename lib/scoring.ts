import { Settings } from '@prisma/client';

function containsKeyword(text: string, keyword: string) {
  return text.includes(keyword.toLowerCase());
}

export function scoreItem(title: string, snippet: string | null, settings: Settings) {
  const haystack = `${title} ${snippet ?? ''}`.toLowerCase();

  for (const kw of settings.excludeKeywords) {
    if (containsKeyword(haystack, kw)) {
      return { skip: true, score: 0 };
    }
  }

  let score = 0;
  for (const kw of settings.includeKeywords) {
    if (containsKeyword(haystack, kw)) score += 1;
  }

  const rules = settings.scoreRules as Record<string, number>;
  for (const [kw, points] of Object.entries(rules)) {
    if (containsKeyword(haystack, kw)) score += points;
  }

  return { skip: false, score };
}
