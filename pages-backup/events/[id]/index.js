import styles from '/styles/pages/event/index.module.scss'
import * as cookie from "cookie";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

const SingleEvent = props => {
    /**
     * Use next.js router.
     * @version 1.0
     */
    const Router    = useRouter()
    const { query } = Router

    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { user, single_event, ingoing_events } = props

    /**
     * Checking if the current user is a moderator or a player.
     * @version 1.0
     */
    const [ IsUserRegistered, SetUserRegistered ] = useState( false )
    useEffect( () => {

        // Check for current user access level
        if ( single_event.group_info.owner === user._id.$oid ) {

            SetUserRegistered( false )

        } else {

            // Checking whether the current event exists in the user's event list or not
            let list = ingoing_events.filter( event => event._id.$oid === single_event._id.$oid )
            SetUserRegistered( list.length !== 0 )

        }

    }, [ ingoing_events, single_event, single_event.group_info.owner, user._id.$oid ] )

    /**
     * Function to vote an event.
     *
     * @version 1.0
     * @param is_upvote
     * @returns {Promise<void>}
     * @constructor
     */
    const VoteOnEvent = async is_upvote => {
        let response   = await fetch( `${ process.env.EVENT_URL }/event/cast-vote`, {
            method:  'POST',
            headers: {
                'Authorization': `Bearer ${ user.access_token }`,
                'Content-Type':  'application/json'
            },
            body:    JSON.stringify( {
                "_id":   query.id,
                "voter": {
                    "nft_owner_wallet_address": "",
                    "is_upvote":                is_upvote,
                    "score":                    0
                }
            } )
        } )
        let { status } = await response.json()

        if ( status === 200 ) {
            toast.success( 'رای شما با موفقیت ثبت شد' )
        } else {
            toast.error( 'خطایی در هنگام ثبت رای بوجود آمده' )
        }

    }

    /**
     * Lock event.
     *
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const LockEvent = async e => {
        const { access_token } = user

        const response = await fetch( `${ process.env.EVENT_URL }/event/set-lock`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ access_token }` },
            body:    JSON.stringify( { "_id": query.id } )
        } )
        const { data } = await response.json()

        if ( data.is_locked === true ) {
            e.target.remove()
        }
    }

    /**
     * Reserve and event
     *
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const ReserveEvent = async e => {
        const response   = await fetch( `${ process.env.EVENT_URL }/event/reserve/mock`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ user.access_token }` },
            body:    JSON.stringify( {
                "event_id":     query.id,
                "requested_at": Math.floor( Date.now() / 1000 )
            } )
        } )
        const { status } = await response.json()

        if ( status === 200 ) {
            toast.success( 'شما با موفقیت در ایونت ثبت نام کردید' )
            setTimeout( () => Router.reload(), 2000 )
        } else {
            toast.error( 'خطایی در هنگام رزرو ایونت وجود دارد' )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>{ single_event.title }</title>
            </Head>

            <div className={ styles.header } style={ { backgroundImage: "url('/event-detail-header.png')" } }>

                <h2>{ single_event.title }</h2>

                <span className={ styles.maxPlayers }>
                    ظرفیت { single_event.max_players } نفر
                </span>

                {
                    IsUserRegistered &&
                    <div className={ styles.vote }>
                        <button type={ "button" } onClick={ () => {VoteOnEvent( true )} } className={ styles.upvote }>
                            <AiFillLike />
                        </button>
                        <button type={ "button" } onClick={ () => {VoteOnEvent( false )} } className={ styles.downvote }>
                            <AiFillDislike />
                        </button>
                    </div>
                }

            </div>

            <div className={ styles.content }>

                <div className={ "page-title" }><h2>توضیحات</h2></div>
                <div className={ styles.description }>
                    { single_event.content }
                </div>

            </div>

            <div className={ styles.footer }>
                {
                    single_event.group_info.owner === user.username ?
                        <>
                            <Link href={ `${ query.id }/players` }>
                                <a>
                                    مشاهده لیست بازیکنان
                                </a>
                            </Link>
                            {
                                single_event.is_locked === false &&
                                <button type={ "button" } onClick={ LockEvent }>
                                    بستن رزرو ایونت
                                </button>
                            }
                        </> :
                        <>
                            {
                                IsUserRegistered ?
                                    <Link href={ `${ query.params.id }/info/${ user._id.$oid }` }>
                                        <a>
                                            مشاهده جزئیات بازی
                                        </a>
                                    </Link> :
                                    <button type={ "button" } onClick={ ReserveEvent }>رزرو ایونت</button>

                            }
                        </>
                }
            </div>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    // Get single event details
    let single_event = await fetch( `${ process.env.EVENT_URL }/event/get/single`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ user.access_token }` },
        body:    JSON.stringify( { "_id": context.query.id } )
    } )
    single_event     = ( await single_event.json() ).data

    // Get all in-going events for current user
    let ingoing_events = await fetch( `${ process.env.EVENT_URL }/event/get/all/player/in-going`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ user.access_token }` }
    } )
    ingoing_events     = ( await ingoing_events.json() ).data

    return {
        props: {
            user:           user,
            single_event:   single_event,
            ingoing_events: ingoing_events
        }
    }
}

export default SingleEvent