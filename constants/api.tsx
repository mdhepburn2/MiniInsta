export const host = 'http://10.239.127.250:8000'
export const url = host + '/mini_insta/api/'


export const mediaUrl = (path: string) =>
  path.startsWith("http") ? path : host + path;