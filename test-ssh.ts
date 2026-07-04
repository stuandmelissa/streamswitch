import 'dotenv/config'
import { NodeSSH } from 'node-ssh'

const ssh = new NodeSSH()

try {
  console.log('Connecting...', {
    host: process.env.UDR_HOST,
    username: process.env.UDR_USER,
    passLength: process.env.UDR_PASS?.length,
  })

  await ssh.connect({
    host: process.env.UDR_HOST!,
    username: process.env.UDR_USER!,
    password: process.env.UDR_PASS!,
    tryKeyboard: true,
  })

  const result = await ssh.execCommand('echo ok && hostname')
  console.log(result)
  ssh.dispose()
} catch (err) {
  console.error(err)
  process.exit(1)
}
