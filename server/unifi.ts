import { Agent, request } from 'undici'
import { config } from './config'

const agent = new Agent({ connect: { rejectUnauthorized: false } })

let cookie = ''

export async function loginToUnifi() {
  const res = await request(`${config.unifiUrl}/api/auth/login`, {
    method: 'POST',
    dispatcher: agent,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: config.unifiUser,
      password: config.unifiPass,
    }),
  })

  cookie = Array.isArray(res.headers['set-cookie'])
    ? res.headers['set-cookie'].join('; ')
    : String(res.headers['set-cookie'] ?? '')

  const body = await res.body.text()

  return {
    statusCode: res.statusCode,
    hasCookie: Boolean(cookie),
    body,
  }
}
