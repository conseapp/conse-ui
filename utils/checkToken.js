const checkToken = async token => {
    const options = {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${ token }` }
    }
    const request = await fetch( `${ process.env.AUTH_URL }/auth/check-token`, options )

    const response = await request.json()

    return response.data
}

export default checkToken