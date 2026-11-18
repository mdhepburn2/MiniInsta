// File: api.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: API host and URL constants, plus a helper that builds full media URLs

export const host = 'https://cs-webapps.bu.edu/mhepburn'
export const url = host + '/mini_insta/api/'


export const mediaUrl = (path: string) =>
  path.startsWith("http") ? path : host + path;