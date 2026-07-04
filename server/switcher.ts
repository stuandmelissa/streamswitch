import { NodeSSH } from 'node-ssh'
import 'dotenv/config'
import { COUNTRIES, DEVICES } from './streamConfig'

async function runUdrCommand(command: string) {
  const ssh = new NodeSSH()

  await ssh.connect({
    host: process.env.UDR_HOST!,
    username: process.env.UDR_USER!,
    password: process.env.UDR_PASS!,
    tryKeyboard: true,
    readyTimeout: 20000,
  })

  const result = await ssh.execCommand(command)
  ssh.dispose()

  if (result.stderr) {
    throw new Error(result.stderr)
  }

  return result.stdout
}

export async function switchDevice(device: string, country: string) {
  const targetDevice = DEVICES[device as keyof typeof DEVICES]
  const targetCountry = COUNTRIES[country as keyof typeof COUNTRIES]

  if (!targetDevice) throw new Error(`Unknown device: ${device}`)
  if (!targetCountry) throw new Error(`Unknown country: ${country}`)

  const update =
    targetCountry.networkId === null
      ? '{$set:{enabled:false}}'
      : `{$set:{enabled:true,network_id:"${targetCountry.networkId}"}}`

  const command = `mongo --port 27117 ace --quiet --eval '
db.traffic_route.updateOne(
  {_id:ObjectId("${targetDevice.routeId}")},
  ${update}
);
db.traffic_route.find(
  {_id:ObjectId("${targetDevice.routeId}")},
  {description:1,enabled:1,network_id:1}
).pretty();
'`

  const output = await runUdrCommand(command)

  return {
    ok: true,
    device,
    country,
    output,
  }
}

export async function getDevices() {
  const routeIds = Object.values(DEVICES).map((d) => `ObjectId("${d.routeId}")`).join(',')

  const command = `mongo --port 27117 ace --quiet --eval '
printjson(
  db.traffic_route.find(
    {_id:{$in:[${routeIds}]}},
    {_id:1,description:1,enabled:1,network_id:1}
  ).toArray()
)
'`

  const output = await runUdrCommand(command)

  const routes = JSON.parse(
    output
      .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
      .replace(/ISODate\("([^"]+)"\)/g, '"$1"')
  )

  return Object.entries(DEVICES).map(([id, device]) => {
    const route = routes.find((r: any) => r._id === device.routeId)

    const current =
      !route?.enabled
        ? 'usa'
        : Object.entries(COUNTRIES).find(
            ([, country]) => country.networkId === route?.network_id
          )?.[0] ?? 'unknown'

    return {
      id,
      name: device.name,
      current,
    }
  })
}
