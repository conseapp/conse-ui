const CreateDeck = async ( deck_name, roles, token ) => {
    const headers = {
        'Authorization': `Bearer ${ token }`,
        'Content-Type':  'application/json'
    }

    const body = JSON.stringify( {
        "deck_name":   deck_name,
        "roles":       roles,
        "is_disabled": false,
        "created_at":  Math.floor( Date.now() / 1000 )
    } )

    const options = {
        method:   'POST',
        headers:  headers,
        body:     body,
        redirect: 'follow'
    }

    const response = await fetch( `${ process.env.GAME_URL }/game/deck/add`, options )
    return await response.json()
}

export default CreateDeck