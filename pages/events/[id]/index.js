import styles from '/styles/pages/event/index.module.scss'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import checkToken from "../../../utils/checkToken";
import Head from "next/head";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import Header from "../../../components/header";
import Nav from "../../../components/nav";

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
    const { user, token, single, ingoing } = props

    const [ TodayIsEventDay, SetTodayIsEventDay ] = useState( false )

    useEffect( () => {
        let event   = new Date( single.started_at * 1000 )
        let current = new Date()

        let e_date = `${ event.getFullYear() }/${ event.getMonth() }/${ event.getDay() }`,
            c_date = `${ current.getFullYear() }/${ current.getMonth() }/${ current.getDay() }`

        SetTodayIsEventDay( e_date === c_date )
    }, [ single.started_at ] )

    /**
     * Checking if the current user is a moderator or a player.
     * @version 1.0
     */
    const [ IsUserRegistered, SetUserRegistered ] = useState( false )
    useEffect( () => {

        // Check for current user access level
        if ( single.group_info.owner === user._id.$oid ) {

            SetUserRegistered( false )

        } else {

            // Checking whether the current event exists in the user's event list or not
            let list = ingoing.filter( event => event._id.$oid === single._id.$oid )
            SetUserRegistered( list.length !== 0 )

        }

    }, [ ingoing, single, single.group_info.owner, user._id.$oid ] )

    /**
     * Function to vote an event.
     *
     * @version 1.0
     * @param is_upvote
     * @returns {Promise<void>}
     * @constructor
     */
    const VoteOnEvent = async is_upvote => {
        let request  = await fetch( `${ process.env.EVENT_URL }/event/cast-vote`, {
            method:  'POST',
            headers: { 'Authorization': `Bearer ${ token }` },
            body:    JSON.stringify( {
                "_id":   query.id,
                "voter": {
                    "nft_owner_wallet_address": "",
                    "is_upvote":                is_upvote,
                    "score":                    0
                }
            } )
        } )
        let response = await request.json()

        if ( response.status === 200 ) {
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
        let request  = await fetch( `${ process.env.EVENT_URL }/event/set-lock`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( { "_id": query.id } )
        } )
        let response = await request.json()

        if ( response.data.is_locked === true ) {
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
        const request  = await fetch( `${ process.env.EVENT_URL }/event/reserve/mock`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( {
                "event_id":     query.id,
                "requested_at": Math.floor( Date.now() / 1000 )
            } )
        } )
        const response = await request.json()

        if ( response.status === 200 ) {
            toast.success( 'شما با موفقیت در ایونت ثبت نام کردید' )
            setTimeout( () => Router.reload(), 2000 )
        } else {
            toast.error( 'خطایی در هنگام رزرو ایونت وجود دارد' )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>{ single.title }</title>
            </Head>

            <Header user={ user } />

            <Nav user={ user } />

            <div className="container" style={ { padding: 0 } }>

                <div className={ styles.header } style={ { backgroundImage: "url('/event-detail-header.png')" } }>

                    <h2>{ single.title }</h2>

                    <span className={ styles.maxPlayers }>
                           ظرفیت { single.max_players } نفر
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
                        { single.content }
                    </div>

                </div>

                <div className={ styles.footer }>
                    {
                        single.group_info.owner === user.username ?
                            <>
                                <Link href={ `${ query.id }/players` }>
                                    <a>
                                        مشاهده لیست بازیکنان
                                    </a>
                                </Link>
                                {
                                    single.is_locked === false &&
                                    <button type={ "button" } onClick={ LockEvent }>
                                        بستن رزرو ایونت
                                    </button>
                                }
                            </> :
                            <>
                                {
                                    IsUserRegistered ?
                                        TodayIsEventDay ?
                                            <Link href={ `${ query.id }/info/${ user._id.$oid }` }>
                                                <a>
                                                    مشاهده جزئیات بازی
                                                </a>
                                            </Link> :
                                            <></> :
                                        <button type={ "button" } onClick={ ReserveEvent }>رزرو ایونت</button>

                                }
                            </>
                    }
                </div>

            </div>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    // Get single event details
    let single = await fetch( `${ process.env.EVENT_URL }/event/get/single`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` },
        body:    JSON.stringify( { "_id": context.query.id } )
    } )
    single     = await single.json()

    // Get all in-going events for current user
    let ingoing = await fetch( `${ process.env.EVENT_URL }/event/get/all/player/in-going`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    ingoing     = await ingoing.json()

    return {
        props: {
            user:    user,
            token:   context.req.cookies['token'],
            single:  single.data,
            ingoing: ingoing.data
        }
    }
}

export default SingleEvent