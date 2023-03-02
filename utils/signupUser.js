const signupUser = async ( username, password ) => {
    let body = JSON.stringify( {
        "username": username,
        "pwd":      password,
        "phone":    "09120000000",
        "status":   2
    } )

    let options = {
        method: 'POST',
        body:   body
    }

    let request = await fetch( `${ process.env.AUTH_URL }/auth/signup`, options )

    return await request.json()
}

export default signupUser