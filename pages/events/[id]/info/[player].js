import checkToken from "../../../../utils/checkToken";
import styles from "../../../../styles/pages/event/info/player.module.scss";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/header";
import Nav from "../../../../components/nav";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { MdRefresh } from "react-icons/md";
import CreateSideColor from "../../../../utils/createSideColor";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const Info = props => {
    const router = useRouter()

    const { user, token, player, deck } = props

    const [ status, setStatus ]   = useState( '...' )
    const [ newUser, updateUser ] = useState( player )

    let StatusText = number => {
        if ( number === 0 ) setStatus( 'شما در حال بازی هستید' )
        if ( number === 1 ) setStatus( 'شما از بازی اخراج شدید' )
        if ( number === 2 ) setStatus( 'شما از بازی خارج شدید' )
        if ( number === 3 ) setStatus( 'تمام توانایی های شما برای 3 شب گرفته شده' )
        if ( number === 4 ) setStatus( 'تمام توانایی های شما برای همیشه گرفته شده' )
        if ( number === 5 ) setStatus( 'به مدت 2 شب سایلنت هستید' )
        if ( number === 6 ) setStatus( 'به مدت 6 شب سایلنت هستید' )
        if ( number === 7 ) setStatus( 'به یک بازیکن متصل شدید' )
        if ( number === 8 ) setStatus( 'نقش شما تغییر کرده' )
        if ( number === 9 ) setStatus( 'ساید شما تغییر کرده' )
        if ( number === 10 ) setStatus( 'از بازی خارج شده اید' )
        if ( number === 11 ) setStatus( 'شما خدا رو فدا کرده اید' )
        if ( number === 12 ) setStatus( 'قاتل حرفه ای به دنبال شماست' )
    }

    useEffect( () => StatusText( player.status ), [ player.status ] )

    const reloadUser = async e => {
        let request  = await fetch( `${ process.env.GAME_URL }/game/player/get/single`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( {
                "event_id": router.query.id,
                "user_id":  router.query.player
            } )
        } )
        let response = await request.json()

        if ( response.status === 200 ) {
            updateUser( response.data )

            StatusText( response.data.status )
        }
    }

    const showRoleDetails = e => {
        let id = e.target.getAttribute( 'data-id' )

        deck.map( role => {
            if ( role._id === id ) {
                withReactContent( Swal ).fire( {
                    ...CreateSideColor( role.side_id ),
                    title:              <h3>{ role.name }</h3>,
                    html:               <div dangerouslySetInnerHTML={ { __html: role.desc } }></div>,
                    confirmButtonColor: 'var(--primary-color)',
                    confirmButtonText:  'متوجه شدم'
                } )
            }
        } )
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>اطلاعات شما در این ایونت</title>
            </Head>

            <Header user={ user } profile={ false } />

            <Nav user={ user } />

            <div className="container">

                <div className={ styles.card }>

                    <button type={ "button" } onClick={ reloadUser }>
                        <MdRefresh />
                    </button>

                    <div className={ styles.info }>
                        <Image src={ '/avatar.png' } alt={ player.username } width={ 100 } height={ 100 } />
                        <h2>{ player.username }</h2>
                        <span style={ newUser.side_id !== null ? CreateSideColor( newUser.side_id.$oid ) : {} }>
                            { newUser.role_name }
                        </span>
                    </div>

                    <div className={ styles.boxes }>
                        <div className={ styles.status }>
                            <div>
                                وضعیت شما در بازی
                                <p>
                                    { status }
                                </p>
                            </div>
                        </div>
                        <div className={ styles.role }></div>
                    </div>

                </div>

                <div className={ styles.deck }>
                    <div className="page-title">
                        <h2>دک بازی</h2>
                    </div>

                    <table>
                        <tbody>
                        {
                            deck.map( role => {
                                return (
                                    <tr key={ role._id }>
                                        <td style={ { color: CreateSideColor( role.side_id ).background } }>{ role.name }</td>
                                        <td>
                                            <button type={ "button" } onClick={ showRoleDetails } data-id={ role._id }>
                                                توضیحات
                                            </button>
                                        </td>
                                    </tr>
                                )
                            } )
                        }
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    )
}

export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    // Get current player info
    let player = await fetch( `${ process.env.GAME_URL }/game/player/get/single`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` },
        body:    JSON.stringify( {
            "event_id": context.query.id,
            "user_id":  context.query.player
        } )
    } )
    player     = await player.json()

    // Get current event deck
    let event = await fetch( `${ process.env.EVENT_URL }/event/get/single`, {
        method: 'POST',
        body:   JSON.stringify( { "_id": context.query.id } )
    } )
    event     = await event.json()

    // Get current event deck
    let deck = await fetch( `${ process.env.GAME_URL }/game/deck/get/single`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` },
        body:    JSON.stringify( { "_id": event.data.deck_id } )
    } )
    deck     = await deck.json()

    return {
        props: {
            user:   user,
            token:  context.req.cookies['token'],
            player: player.data,
            deck:   deck.data.roles
        }
    }
}

export default Info