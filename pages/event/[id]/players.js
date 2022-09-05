import styles from '/styles/pages/event/players.module.scss'
import Head from "next/head";
import * as cookie from "cookie";
import { MdSettings } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";
import CreateSideColor from "../../../utils/createSideColor";

const Players = props => {
    const Router                 = useRouter()
    const { query }              = Router
    const { event, user, roles } = props

    console.log( props )

    const [ Players, SetPlayers ] = useState( event.players )

    const ToggleConductorMenu = async e => {
        let menu = document.querySelector( `.${ styles.conductorMenu }` )
        menu.classList.toggle( styles.open )
    }

    const RevealRoles = async e => {
        const options          = {
            method:   'POST',
            headers:  {
                "Authorization": `Bearer ${ user.access_token }`,
                "Content-Type":  "application/json"
            },
            body:     JSON.stringify( {
                "_id": query.id
            } ),
            redirect: 'follow'
        };
        const response         = await fetch( `${ process.env.EVENT_URL }/event/reveal/roles`, options )
        const { data, status } = await response.json()

        if ( status === 200 ) {
            SetPlayers( data.players )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>بازیکنان { event.title }</title>
            </Head>

            <div className={ styles.content }>

                <header className={ styles.header } style={ { backgroundImage: "url(/event-detail-header.png)" } }>
                    <h2>{ event.title }</h2>
                    <span>بازیکنان : { event.players.length } نفر</span>
                </header>

                <div className={ styles.players }>
                    <ul>
                        {
                            Players.map( player => {
                                return (
                                    <li key={ player._id.$oid }
                                        style={ player.side_id !== null ? CreateSideColor( player.side_id.$oid ) : {} }>
                                        <strong>{ player.username }</strong>
                                        {
                                            player.role_id &&
                                            <span>
                                                {
                                                    roles.roles.map( role => {
                                                        if ( role._id.$oid === player.role_id.$oid ) {
                                                            return role.name
                                                        }
                                                    } )
                                                }
                                            </span>
                                        }
                                    </li>
                                )
                            } )
                        }
                    </ul>
                </div>

            </div>

            <div className={ styles.conductorMenu }>
                <button type={ "button" } onClick={ ToggleConductorMenu }>
                    <MdSettings />
                </button>
                <header>پنل گرداننده</header>
                <ul>
                    <li>
                        <button type={ "button" } onClick={ RevealRoles }>پخش کردن نقش ها</button>
                    </li>
                    <li>
                        <button type={ "button" }>بستن رزرو</button>
                    </li>
                </ul>
            </div>

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    const event      = await fetch( `${ process.env.EVENT_URL }/event/get/single`, {
        method:   'POST',
        headers:  { "Content-Type": "application/json" },
        body:     JSON.stringify( {
            "_id": context.query.id
        } ),
        redirect: 'follow'
    } )
    const event_data = await event.json()

    const roles      = await fetch( `${ process.env.EVENT_URL }/game/role/get/availables`, {
        method:   'GET',
        headers:  {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${ user.access_token }`
        },
        redirect: 'follow'
    } )
    const roles_data = await roles.json()

    return {
        props: {
            event: event_data.data,
            roles: roles_data.data,
            user:  user
        }
    }
}

export default Players