import styles from '/styles/pages/event/index.module.scss'
import Head from "next/head";
import * as cookie from "cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AiFillDislike, AiFillLike } from "react-icons/ai";

const SingleEvent = props => {
    const Router = useRouter()

    const { event, user, roles } = props
    const { query }              = Router

    console.log( props )

    const [ IsUserRegistered, SetUserRegistered ] = useState( false )
    useEffect( () => {
        let players = event.players.filter( player => player._id.$oid === user._id.$oid )
        SetUserRegistered( players.length !== 0 )
    }, [ event.players, user._id.$oid ] )

    const LockEvent = async e => {
        const { access_token } = user

        const options = {
            method:   'POST',
            headers:  {
                "Authorization": `Bearer ${ access_token }`,
                "Content-Type":  "application/json"
            },
            body:     JSON.stringify( {
                "_id": query.id
            } ),
            redirect: 'follow'
        }

        const response = await fetch( `${ process.env.EVENT_URL }/event/set-lock`, options )
        const { data } = await response.json()

        if ( data.is_locked === true ) {
            e.target.remove()
        }
    }

    const ShowPlayerRole = async e => {
        const event    = await fetch( `${ process.env.EVENT_URL }/event/get/single`, {
            method:  'POST',
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify( {
                "_id": query.id
            } )
        } )
        const { data } = await event.json()

        const { players }   = data
        const { role_name } = players.filter( player => player.username === user.username )[0]

        if ( role_name !== null ) {
            toast.info( `نقش شما ${ role_name } میباشد` )
        } else {
            toast.info( 'نقش ها توسط گرداننده پخش نشده' )
        }

    }

    const ReserveEvent = async e => {
        const options = {
            method:   'POST',
            headers:  {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${ user.access_token }`
            },
            body:     JSON.stringify( {
                "event_id":     query.id,
                "requested_at": Math.floor( Date.now() / 1000 )
            } ),
            redirect: 'follow'
        }

        const response   = await fetch( `${ process.env.EVENT_URL }/event/reserve/mock`, options )
        const { status } = await response.json()

        if ( status === 200 ) {
            toast.success( 'شما با موفقیت در ایونت ثبت نام کردید' )
            setTimeout( () => Router.reload(), 2000 )
        } else {
            toast.error( 'خطایی در هنگام رزرو ایونت وجود دارد' )
        }
    }

    const VoteOnEvent = async is_upvote => {
        let id = Router.query.id

        let options = {
            method:   'POST',
            headers:  {
                'Authorization': `Bearer ${ user.access_token }`,
                'Content-Type':  'application/json'
            },
            body:     JSON.stringify( {
                "_id":   id,
                "voter": {
                    "nft_owner_wallet_address": "",
                    "is_upvote":                is_upvote,
                    "score":                    0
                }
            } ),
            redirect: 'follow'
        };

        let response   = await fetch( `${ process.env.EVENT_URL }/event/cast-vote`, options )
        let { status } = await response.json()

        if ( status === 200 ) {
            toast.success( 'رای شما با موفقیت ثبت شد' )
        } else {
            toast.error( 'خطایی در هنگام ثبت رای بوجود آمده' )
        }

    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>{ event.title }</title>
            </Head>

            <div className={ styles.header } style={ { backgroundImage: "url('/event-detail-header.png')" } }>
                <h2>{ event.title }</h2>
                <span className={ styles.maxPlayers }>
                    ظرفیت { event.max_players - event.players.length } نفر
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
                    { event.content }
                </div>

                <div className={ styles.footer }>
                    {
                        event.group_info.owner === user.username ?
                            <>
                                <Link href={ `${ query.id }/players` }>
                                    <a>
                                        مشاهده لیست بازیکنان
                                    </a>
                                </Link>
                                {
                                    event.is_locked === false &&
                                    <button type={ "button" } onClick={ LockEvent }>
                                        بستن رزرو ایونت
                                    </button>
                                }
                            </> :
                            <>
                                {
                                    IsUserRegistered ?
                                        <>
                                            <button type={ "button" } onClick={ ShowPlayerRole }>
                                                نمایش نقش
                                            </button>
                                        </> :
                                        <>
                                            <button type={ "button" } onClick={ ReserveEvent }>
                                                رزرو ایونت
                                            </button>
                                        </>
                                }
                            </>
                    }
                </div>

            </div>

            <ToastContainer position="bottom-center" autoClose={ 5000 } hideProgressBar newestOnTop={ false } closeOnClick={ false } rtl pauseOnFocusLoss draggable pauseOnHover />

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

    const roles      = await fetch( `${ process.env.GAME_URL }/game/role/get/availables`, {
        method:  'GET',
        headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${ user.access_token }`
        }
    } )
    const roles_data = await roles.json()

    return {
        props: {
            event: event_data.data,
            roles: roles_data,
            user:  user
        }
    }
}

export default SingleEvent