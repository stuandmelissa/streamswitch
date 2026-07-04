import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT ?? 3333),
  unifiUrl: process.env.UNIFI_URL ?? 'https://192.168.1.1',
  unifiApiKey: process.env.UNIFI_API_KEY ?? '',
  unifiSiteId: process.env.UNIFI_SITE_ID ?? '',
}
