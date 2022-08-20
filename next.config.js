/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify:       true,
    env:             {
        AUTH_URL:  process.env.AUTH_URL,
        EVENT_URL: process.env.EVENT_URL,
        GAME_URL:  process.env.GAME_URL,
    },
}

module.exports = nextConfig
