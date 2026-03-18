const loadEnvFile = () => {
  const isNodeRuntime =
    typeof window === 'undefined' &&
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node

  if (!isNodeRuntime) return

  try {
    // Avoid static fs/path imports so the client bundle does not try to resolve them.
    const req = eval('require')
    const fs = req('fs')
    const path = req('path')
    const envPath = path.resolve(process.cwd(), '.env')
    if (!fs.existsSync(envPath)) return

    const envText = fs.readFileSync(envPath, 'utf8')
    envText.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return

      const equalsIndex = trimmed.indexOf('=')
      if (equalsIndex === -1) return

      const key = trimmed.slice(0, equalsIndex).trim()
      let value = trimmed.slice(equalsIndex + 1).trim()

      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      if (process.env[key] === undefined) {
        process.env[key] = value
      }
    })
  } catch (err) {
    // Ignore env file loading errors and continue with existing process.env values.
  }
}

loadEnvFile()

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/mernproject',
  stripe_connect_test_client_id: process.env.STRIPE_CONNECT_TEST_CLIENT_ID || 'YOUR_stripe_connect_test_client',
  stripe_test_secret_key: process.env.STRIPE_TEST_SECRET_KEY || 'YOUR_stripe_test_secret_key',
  stripe_test_api_key: process.env.STRIPE_TEST_API_KEY || 'YOUR_stripe_test_api_key' 
}

export default config
