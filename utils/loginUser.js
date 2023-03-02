const loginUser = async ( username, password ) => {
    let body = JSON.stringify( {
        "username": username,
        "pwd":      password
    } )

    let options = {
        method: 'POST',
        body:   body
    }

    let request = await fetch( `${ process.env.AUTH_URL }/auth/login`, options )

    return await request.json()
}

export default loginUser