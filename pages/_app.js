import '../styles/globals.scss'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie, hasCookie } from "cookies-next";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

function Conse( { Component, pageProps } ) {
    const Router = useRouter()

    const [ User, SetUser ] = useState( {} )

    // Check user
    useEffect( () => {

        // Check access token exists
        if ( !hasCookie( 'access_token' ) ) {

            // Check current path
            if ( Router.route.search( '/auth/' ) === -1 ) {

                // Redirect to login page
                Router.push( '/auth/login' )
            }

        } else {
            let access_token = getCookie( 'access_token' )

            SetUser( JSON.parse( atob( access_token ) ) )
        }

    }, [ Router ] )

    return (
        <>
            {
                Router.route.search( '/auth/' ) === 0 ?
                    // Authentication Pages
                    <Component { ...pageProps } /> :

                    // Other Pages
                    <div className={ "app" }>

                        <Sidebar user={ User } />

                        <Header user={ User } />

                        <div className="container">
                            <Component { ...pageProps } />
                        </div>

                    </div>
            }
        </>
    )
}

export default Conse