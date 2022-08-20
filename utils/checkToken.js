import { getCookie, setCookie } from "cookies-next";

export default async function checkToken() {
    let token = getCookie( 'access_token' )

    let response = false

    if ( token ) {
        // Check validation of access_token
        const init = {
            method:  'post',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${ token }`,
            },
            body:    JSON.stringify( { "access_token": token } ),
        }

        response = fetch( `${ process.env.AUTH_URL }/auth/check-token`, init )
            .then( response => response.json() )
            .then( data => {
                if ( data.status === 200 ) {
                    setCookie( 'username', data.data.username )
                    setCookie( '_id', data.data._id.$oid )
                    return true
                }
                return false
            } );
    }


    return response
}