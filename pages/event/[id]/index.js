import styles from '../../../assets/scss/event/Detail.module.css'
import Header from "../../../components/header";
import Nav from "../../../components/nav";
import Head from "next/head";
import { MdGames, MdLocationPin } from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";
import { IoTicket } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import checkToken from "../../../utils/checkToken";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import getRole from "../../../utils/getRoles";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EventDetail = ( { data } ) => {
    const router = useRouter()
    const query  = router.query;

    const [ date, setDate ] = useState( '' )

    useEffect( () => {
        let date  = new Date( data.expire_at * 1000 )
        let year  = date.getFullYear(),
            month = date.getMonth() + 1,
            day   = date.getDate()
        setDate( `${ year }/${ month }/${ day }` )
    }, [ data.expire_at ] )

    useEffect( () => {
        Promise.resolve( checkToken() )
               .then( result => { if ( result !== true ) router.push( '/auth/login' ) } )
    }, [ router ] )

    //eslint-disable-next-line react-hooks/exhaustive-deps
    const ReserveToEvent = () => {
        let token   = getCookie( 'access_token' )
        let headers = new Headers();
        headers.append( "Authorization", `Bearer ${ token }` );
        headers.append( "Content-Type", "application/json" );

        let requestOptions = {
            method:   'POST',
            headers:  headers,
            body:     JSON.stringify( {
                "event_id":     query.id,
                "requested_at": Math.floor( Date.now() / 1000 ),
            } ),
            redirect: 'follow',
        };

        fetch( `${ process.env.EVENT_URL }/event/reserve/mock`, requestOptions )
            .then( response => response.text() )
            .then( result => console.log( result ) )
            .catch( error => console.log( 'error', error ) );
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
    const RevealPlayerRole = () => {

        fetch( `${ process.env.EVENT_URL }/event/get/single`, {
            method: 'POST',
            body:   JSON.stringify( { "_id": query.id } ),
        } )
            .then( result => result.json() )
            .then( response => {
                let id          = getCookie( '_id' )
                let currentUser = response.data.players.filter( player => player._id.$oid === id )
                let role        = currentUser[0].role_id.$oid
                if ( role ) {
                    toast.info( `نقش شما ${ getRole( role ) } میباشد`, {
                        position:        "bottom-center",
                        autoClose:       5000,
                        hideProgressBar: false,
                        closeOnClick:    true,
                        pauseOnHover:    true,
                        draggable:       true,
                        progress:        undefined,
                    } );
                }
            } )
    }

    const [ footer, setFooter ] = useState( '' )

    useEffect( () => {
        let out = () => {
            let username = getCookie( 'username' )
            if ( username === 'blueash' ) {
                return 'god'
            } else {
                if ( data.players.filter( player => player.username === username ).length === 0 ) {
                    return 'guest'
                } else {
                    return 'player'
                }
            }
        }
        setFooter( out )
    }, [data.players] )

    return (
        <div className={ styles.page }>
            <Head>
                <title>{ data.title }</title>
            </Head>

            <Header />

            <img src={ '/event-detail-header.png' } className={ styles.cover } />

            <div className="container">
                <div className={ styles.header }>
                    <div className={ styles.title }>
                        <h2>{ data.title }</h2>
                        <div className={ `${ styles.meta }` }>
                            <span>ظرفیت { data.players.length }/{ data.max_players }</span>
                            <time>{ date }</time>
                        </div>
                    </div>
                </div>

                <div className={ styles.body }>
                    <div className={ `${ styles.info } d-none` }>
                        <ul>
                            <li>
                                <MdGames />
                                سناریو: بازی حرفه ای
                            </li>
                            <li>
                                <RiUser3Fill />
                                گرداننده: علی عباسی
                            </li>
                            <li>
                                <IoTicket />
                                ورودی: 15000 تومان
                            </li>
                            <li>
                                <MdLocationPin style={ { color: "#B80000" } } />
                                لوکیشن: کافه لند
                            </li>
                        </ul>
                    </div>
                    <div className={ styles.description }>
                        <strong>توضیحات:</strong>
                        { data.content }
                    </div>
                </div>

                <div className={ styles.footer }>
                    { footer === 'god' &&
                      <>
                          <Link href={ `${ data._id.$oid }/players` }>
                              <a>لیست نفرات ثبت نامی</a>
                          </Link>
                          <button type={ "button" }>شروع بازی</button>
                      </>
                    }
                    { footer === 'guest' && <button type={ "button" } onClick={ ReserveToEvent }>رزرو نقش</button> }
                    { footer === 'player' && <button type={ "button" } onClick={ RevealPlayerRole }>مشاهده نقش من</button> }
                </div>
            </div>

            <ToastContainer position="bottom-center" autoClose={ 5000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

            <Nav />
        </div>
    )
}

export async function getServerSideProps( context ) {
    const res      = await fetch( `${ process.env.EVENT_URL }/event/get/single`, {
        method: 'POST',
        body:   JSON.stringify( { "_id": context.query.id } ),
    } )
    const { data } = await res.json()

    return {
        props: {
            data: data,
        },
    }
}

export default EventDetail