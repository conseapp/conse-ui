const CreateDeck = async ( deck_name, roles, cards, token, id = null ) => {
    const headers = {
        'Authorization': `Bearer ${ token }`,
        'Content-Type':  'application/json'
    }

    let body = {
        "deck_name":       deck_name,
        "roles":           roles,
        "last_move_cards": cards,
        "is_disabled":     false,
        "created_at":      Math.floor( Date.now() / 1000 )
    }

    if ( id !== null ) {
        body = {
            "_id":             id,
            "deck_name":       deck_name,
            "roles":           roles,
            "last_move_cards": cards,
            "is_disabled":     false,
            "created_at":      Math.floor( Date.now() / 1000 )
        }
    }

    const options = {
        method:   'POST',
        headers:  headers,
        body:     JSON.stringify( body ),
        redirect: 'follow'
    }

    const response = await fetch( `${ process.env.GAME_URL }/game/deck/add`, options )
    return await response.json()
}

export default CreateDeck