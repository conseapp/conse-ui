import { useEffect } from 'react'
import checkToken from "../utils/checkToken";
import { useRouter } from "next/router";
import Head from "next/head";
import { setCookie } from "cookies-next";

/**
 * Home page
 * @constructor
 */
const Home = () => {
    const router = useRouter()

    fetch( `${ process.env.GAME_URL }/game/role/get/availables` )
        .then( response => response.json() )
        .then( result => {
            if ( result.status === 200 ) {
                localStorage.setItem( 'all_roles', JSON.stringify( result.data.roles ) )
            }
        } )
        .catch( error => console.log( 'error', error ) )

    useEffect( () => {
        Promise.resolve( checkToken() )
               .then( result => {
                   if ( result === true ) {
                       router.push( '/home' )
                   } else {
                       router.push( '/auth/login' )
                   }
               } )
    }, [ router ] )

    return <Head><title>لطفا منتظر بمانید، در حال بررسی اطلاعات</title></Head>
}

export default Home