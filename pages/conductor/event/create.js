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
    const Router   = useRouter()
    const { user } = props

    /**
     * Config Group options
     */
    const [ GroupOptions, SetGroupOptions ] = useState( [] )
    const [ GroupValue, SetGroupValue ]     = useState( '' )
    useEffect( () => {
        let options = [];

        props.groups.map( group => {
            let value = {
                "name":       group.name,
                "owner":      group.owner,
                "god_id":     "630a36a78c198e0d655c8ae2",
                "_id":        group._id.$oid,
                "created_at": 1660903680,
                "updated_at": 1660904003
            }

            options.push( {
                label: group.name,
                value: JSON.stringify( value )
            } )
        } )

        SetGroupOptions( options )

    }, [ props.groups ] )

    /**
     * Config Group options
     */
    const [ DeckOptions, SetDeckOptions ] = useState( [] )
    const [ DeckValue, SetDeckValue ]     = useState( '' )
    useEffect( () => {
        let options = [];

        props.decks.map( option => {
            options.push( {
                label: option.deck_name,
                value: option._id.$oid
            } )
        } )

        SetDeckOptions( options )

    }, [ props.decks ] )

    // Insert and update deck
    const SubmitEvent = async e => {
        e.preventDefault()

        let form             = e.target,
            title            = form.querySelector( '#title' ),
            content          = form.querySelector( '#content' ),
            button           = form.querySelector( 'button[type="submit"]' ),
            { access_token } = user

        button.setAttribute( 'disabled', 'disabled' )

        let body = {
            "title":                  title.value,
            "content":                content.value,
            "deck_id":                DeckValue,
            "entry_price":            "0",
            "group_info":             JSON.parse( GroupValue ),
            "creator_wallet_address": "0x0000000000000000000000000000000000000000",
            "upvotes":                0,
            "downvotes":              0,
            "voters":                 [],
            "phases":                 [],
            "max_players":            DeckOptions.length,
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
                <Link href={ '/conductor/deck' }>
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
                    <label htmlFor="group">انتخاب گروه</label>
                    <Select options={ GroupOptions } id={ "group" } isRtl={ true } onChange={ e => {SetGroupValue( e.value )} } />
                </div>

                <div className="row">
                    <label htmlFor="deck">انتخاب دک بازی</label>
                    <Select options={ DeckOptions } id={ "deck" } isRtl={ true } onChange={ e => {SetDeckValue( e.value )} } />
                </div>

                <div className="row">
                    <button type={ "submit" }>ثبت دک</button>
                </div>

            </form>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token            = cookie.parse( context.req.headers.cookie )
    const { access_token } = JSON.parse( atob( token.access_token ) )

    const options = {
        method:   'GET',
        headers:  {
            "Authorization": `Bearer ${ access_token }`
        },
        redirect: 'follow'
    };

    const AvailableGroups = await fetch( `${ process.env.GAME_URL }/game/get/group/all`, options )
    const Groups          = await AvailableGroups.json()

    const AvailableDecks = await fetch( `${ process.env.GAME_URL }/game/deck/get/availables`, options )
    const Decks          = await AvailableDecks.json()

    return {
        props: {
            groups: Groups.data.groups,
            decks:  Decks.data.decks
        }
    }
}

export default Create