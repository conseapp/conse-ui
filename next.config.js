const withPWA = require( 'next-pwa' )( {
    dest: 'public'
} )

/** @type {{reactStrictMode: boolean, swcMinify: boolean, experimental: {images: {allowFutureImage: boolean}}, env: {AUTH_URL: string, EVENT_URL: string, GAME_URL: string}}} */
module.exports = withPWA( {
    pwa:             {
        dest:        "public",
        register:    true,
        skipWaiting: true
    },
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
        GAME_URL:  process.env.GAME_URL,
        ADMIN_URL:  process.env.ADMIN_URL
    }
} )
