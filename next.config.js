/** @type {{reactStrictMode: boolean, swcMinify: boolean, experimental: {images: {allowFutureImage: boolean}}, env: {AUTH_URL: string, EVENT_URL: string, GAME_URL: string}}} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify:       true,
    experimental:    {
        images: {
            allowFutureImage: true
        }
    },
    env:             {
        AUTH_URL:  process.env.AUTH_URL,
        EVENT_URL: process.env.EVENT_URL,
        GAME_URL:  process.env.GAME_URL
    }
}

module.exports = nextConfig
