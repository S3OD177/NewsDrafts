export const defaultSettings = {
  includeKeywords: ['security', 'incident', 'release'],
  excludeKeywords: ['rumor', 'unconfirmed'],
  dedupDays: 30,
  scoreRules: {
    cve: 3,
    exploit: 3,
    breach: 3,
    outage: 3,
    critical: 3,
    release: 3,
    update: 3,
    rumor: -2,
    leak: -2,
    unconfirmed: -2,
  },
};
