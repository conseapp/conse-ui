import { useEffect, useState } from "react";

const PlayerRole = ( { roles } ) => {

    console.log( roles )

    const [ Role, SetRole ] = useState( '' )

    useEffect( () => {
        SetRole( 'salam' )
        //fetch( `${ process.env.GAME_URL }/game/role/get/availables` )
        //    .then( result => result.json() )
        //    .then( data => {
        //        data.data.roles.forEach( role => {
        //            if ( role._id.$oid === props.id ) {
        //                SetRole( role.name )
        //            }
        //        } )
        //    } )
    }, [] )

    return (
        <span>({ Role })</span>
    )
}

export async function getStaticProps() {
    const roles    = await fetch( `${ process.env.GAME_URL }/game/role/get/availables` )
    const { data } = await roles.json()

    return {
        props:      {
            roles: data,
        },
        revalidate: 10,
    }
}

export default PlayerRole