import styles from '/styles/pages/profile/index.module.scss'
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as cookie from "cookie";

const Index = props => {
    const Router = useRouter()

    const { user } = props

    useEffect( () => {
        let TabItems = document.querySelectorAll( `.${ styles.navigation } ul li` )
        let Tabs     = document.querySelectorAll( `.${ styles.tabs } > div` )

        TabItems.forEach( item => {

            item.addEventListener( 'click', function () {
                if ( item.classList.contains( styles.active ) ) return

                let target = item.getAttribute( 'data-target' )

                TabItems.forEach( li => li.classList.remove( styles.active ) )
                item.classList.add( styles.active )

                Tabs.forEach( div => div.classList.remove( styles.active ) )
                document.querySelector( target ).classList.add( styles.active )
            } )

        } )

    }, [] )

    return (
        <div className={ styles.page }>

            <div className={ styles.navigation }>
                <ul>
                    <li className={ styles.active } data-target={ "#reserves" }>رزرو های من</li>

                    <li data-target={ "#history" }>تاریخچه</li>

                    {
                        user.access_level === 1 || user.access_level === 0 &&
                        <li data-target={ "#group" }>گروه من</li>
                    }
                </ul>
            </div>

            <div className={ styles.tabs }>
                <div id={ "reserves" } className={ styles.active }>رزرو های من</div>

                <div id={ "history" }>تاریخچه</div>

                {
                    user.access_level === 1 || user.access_level === 0 &&
                    <div id={ "group" }>گروه من</div>
                }

            </div>

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    return {
        props: {
            user: user
        }
    }
}

export default Index