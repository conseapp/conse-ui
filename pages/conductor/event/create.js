import styles from "/styles/pages/conductor/event/create.module.scss";
import Head from "next/head";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import * as cookie from "cookie";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Link from "next/link";
import createEvent from "../../../utils/createEvent";

const Create = props => {
    /**
     * User next.js router.
     * @version 1.0
     */
    const Router = useRouter()

    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { user, groups, decks } = props

    /**
     * Change the style of the dropdown list.
     * @version 1.0
     * @type {{control: (function(*, *): *&{border: string, backgroundColor: string, borderRadius: string}), multiValue: (function(*, *): *&{border: string, paddingRight: string}), option: (function(*, *): *&{cursor: string, "&:hover": {}})}}
     */
    const SelectStyles = {
        control:    ( provided ) => ( {
            ...provided,
            backgroundColor: '#E5E5E5',
            border:          'none',
            borderRadius:    '8px'
        } ),
        multiValue: ( provided ) => ( {
            ...provided,
            paddingRight: '4px',
            border:       '1px solid #CCC'
        } )
    }

    /**
     * Config decks options
     */
    const [ DeckOptions, SetDeckOptions ] = useState( [] )
    const [ DeckValue, SetDeckValue ]     = useState( '' )
    useEffect( () => {
        let options = [];

        decks.map( option => {
            options.push( {
                label: option.deck_name,
                value: JSON.stringify( option )
            } )
        } )

        SetDeckOptions( options )
    }, [ decks ] )

    /**
     * Submit Event
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const SubmitEvent = async e => {
        e.preventDefault()

        // Form Element
        let form    = e.target,
            title   = form.querySelector( '#title' ),
            content = form.querySelector( '#content' ),
            button  = form.querySelector( 'button[type="submit"]' )

        // Access token
        let { access_token } = user

        // Disable submit button
        button.setAttribute( 'disabled', 'disabled' )

        let deck = JSON.parse( DeckValue )

        let group_info = groups.at( -1 )
        group_info._id = group_info._id.$oid

        let body = {
            "title":                  title.value,
            "content":                content.value,
            "deck_id":                deck._id.$oid,
            "entry_price":            '0',
            "group_info":             group_info,
            "creator_wallet_address": "0x0000000000000000000000000000000000000000",
            "upvotes":                0,
            "downvotes":              0,
            "voters":                 [],
            "phases":                 [],
            "max_players":            deck.roles.length,
            "players":                []
        }

        let { status } = await createEvent( body, access_token )

        if ( status === 201 || status === 302 ) {
            toast.success( 'ایونت با موفقیت ایجاد شد' )
            setTimeout( () => Router.push( '/conductor/event/' ), 2000 )
        } else {
            toast.error( 'خطایی در هنگام ایجاد ایونت بوجود آمده' )
            button.removeAttribute( 'disabled' )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>افزودن ایونت</title>
            </Head>

            <div className="page-title">
                <h2>افزودن ایونت</h2>
                <Link href={ '/conductor/event' }>
                    <a>
                        بازگشت
                    </a>
                </Link>
            </div>

            <form onSubmit={ SubmitEvent } className={ "submit-form" }>

                <div className="row">
                    <label htmlFor="title">نام ایونت</label>
                    <input type="text" id={ "title" } />
                </div>

                <div className="row">
                    <label htmlFor="content">توضیحات</label>
                    <textarea id={ "content" } rows={ 8 }></textarea>
                </div>

                <div className="row">
                    <label htmlFor="deck">انتخاب دک بازی</label>
                    <Select placeholder={ 'انتخاب کنید' } styles={ SelectStyles } options={ DeckOptions } id={ "deck" } isRtl={ true } onChange={ e => {
                        SetDeckValue( e.value )
                    } } />
                </div>

                <div className="row">
                    <button type={ "submit" }>ثبت دک</button>
                </div>

            </form>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

/**
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @param context
 * @returns {Promise<{props: {roles: *, sides: *, user: any}}>}
 */
export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    // Set request options
    const options = {
        method:   'GET',
        headers:  { "Authorization": `Bearer ${ user.access_token }` },
        redirect: 'follow'
    };

    // Get available groups
    let groups = await fetch( `${ process.env.GAME_URL }/game/god/get/group/all`, {
        ...options,
        method: 'POST',
        body:   JSON.stringify( { "_id": user._id.$oid } )
    } )
    groups     = await groups.json()

    // Get available decks
    let decks = await fetch( `${ process.env.GAME_URL }/game/deck/get/availables`, options )
    decks     = await decks.json()

    return {
        props: {
            groups: groups.data.groups,
            decks:  decks.data.decks,
            user:   user
        }
    }
}

export default Create