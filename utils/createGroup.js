const CreateGroup = async ( name, owner, token ) => {
    const headers = {
        'Authorization': `Bearer ${ token }`,
        'Content-Type':  'application/json'
    }

    const body = JSON.stringify( {
        "name":  name,
        "owner": owner
    } )

    const options = {
        method:   'POST',
        headers:  headers,
        body:     body,
        redirect: 'follow'
    }

    const response = await fetch( `${ process.env.GAME_URL }/game/god/create/group`, options )
    return await response.json()
}

export default CreateGroup