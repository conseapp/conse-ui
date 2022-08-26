export default async function getRole( role_id ) {
    let role

    role = fetch( `${ process.env.GAME_URL }/game/role/get/availables` )
        .then( response => response.json() )
        .then( result => {
            return result.data.roles.filter( r => r._id.$oid === role_id )[0]
        } )

    Promise.resolve()

    return role
}