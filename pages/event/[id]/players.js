import styles from '../../../assets/scss/event/Players.module.css'
import Header from "../../../components/header";
import Nav from "../../../components/nav";
import { MdOutlineChangeCircle } from "react-icons/md";
import { getCookie } from "cookies-next";
import getRole from "../../../utils/getRoles";
import { useRouter } from "next/router";
import Head from "next/head";

const EventPlayers = ( { players } ) => {
    const router = useRouter();
    const query  = router.query;

    const playerColor = ( sideID ) => {
        switch ( sideID ) {
            case '62ff5f1a94474205d5992116': // Citizen
                return { backgroundColor: '#4af6c9' }
                break
            case '62ff86360bd1f9c22ec75cbb': // Mafia
                return {
                    backgroundColor: '#Fe5052',
                    color:           '#FFFFFF',
                }
                break
            case '63051ac7d82b8e70c9ceb3fc': // independent
                return { backgroundColor: '#FED152' }
                break
        }
    }

    const RevealRoles = () => {
        let token = getCookie( 'access_token' )


        fetch( `${ process.env.EVENT_URL }/event/reveal/roles`, {
            method:  'POST',
            headers: {
                "Authorization": `Bearer ${ token }`,
                "Content-Type":  "application/json",
            },
            body:    JSON.stringify( {
                "_id": query.id,
            } ),
        } )
            .then( response => response.json() )
            .then( result => {
                if ( result.status === 200 ) {
                    router.reload( window.location.pathname )
                }
            } )
            .catch( error => console.log( 'error', error ) );
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>لیست بازیکنان ایونت</title>
            </Head>

            <Header showProfile={ false } />

            <div className="container">
                <div className={ styles.header }>
                    <div className={ styles.info }>
                        <h2>سناریو: بازی حرفه ای</h2>
                        <span>22 شهریور - کافه لند</span>
                    </div>
                    <span className={ styles.players }>{ players.length } بازیکن</span>
                </div>

                <div className={ styles.content }>

                    <button type={ "button" } onClick={ RevealRoles } className={ styles.revealRoleButton }>
                        پخش کردن دوباره نقش ها
                    </button>

                    <table>
                        <tbody>
                        { players.map( player => {
                            return (
                                <tr key={ player._id.$oid } style={ player.side_id !== null ? playerColor( player.side_id.$oid ) : { background: '#dfdfdf' } }>
                                    <td>
                                        <strong>{ player.username }</strong>
                                    </td>
                                    <td>
                                        <span>{ player.role_id !== null ? getRole( player.role_id.$oid ) : '' }</span>
                                    </td>
                                    <td>
                                        <button type={ "button" }>
                                            <MdOutlineChangeCircle />
                                        </button>
                                    </td>
                                </tr> )
                        } ) }
                        </tbody>
                    </table>
                </div>
            </div>

            <Nav />

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token = getCookie( 'access_token' )

    const event    = await fetch( `${ process.env.EVENT_URL }/event/get/single`, {
        method:  'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${ token }`,
        },
        body:    JSON.stringify( { "_id": context.params.id } ),
    } )
    const { data } = await event.json()

    return {
        props: {
            players: data.players,
        },
    }
}

export default EventPlayers