import { useEffect } from 'react'
import checkToken from "../utils/checkToken";
import { useRouter } from "next/router";
import Head from "next/head";

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

    return <Head><title>لطفا منتظر بمانید، در حال بررسی اطلاعات</title></Head>
}

export default Home