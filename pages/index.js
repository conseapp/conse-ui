import { useEffect } from 'react'
import checkToken from "../utils/checkToken";
import { useRouter } from "next/router";

/**
 * Home page
 * @constructor
 */
const Home = () => {
    const router = useRouter()

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
}

export default Home