import styles from "/styles/pages/conductor/deck/create.module.scss";
import Head from "next/head";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import * as cookie from "cookie";
import CreateDeck from "../../../utils/createDeck";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Link from "next/link";
import CreateSideColor from "../../../utils/createSideColor";

const Create = props => {
    const Router = useRouter()

    const { sides, roles, user, deck } = props

    console.log( deck )

    const [ Options, SetOptions ]             = useState( [] )
    const [ Values, SetValues ]               = useState( [] )
    const [ SelectedRoles, SetSelectedRoles ] = useState( [] )

    const SelectStyles = {
        option:     ( provided, state ) => {
            let { side_id } = JSON.parse( state.value )
            let color       = {}
            if ( side_id.$oid === '630a35978c198e0d655c8adf' ) color = { color: '#549088' }
            if ( side_id.$oid === '630a359e8c198e0d655c8ae0' ) color = { color: '#cb5240' }
            if ( side_id.$oid === '630a35a38c198e0d655c8ae1' ) color = { color: '#ffde43' }
            if ( side_id.$oid === '630a3773696bb14037bdec19' ) color = { color: '#333333' }
            if ( side_id.$oid === '630a383d696bb14037bdec1a' ) color = { color: '#83bb70' }
            if ( side_id.$oid === '630a389a696bb14037bdec1b' ) color = { color: '#1d1a21' }
            if ( side_id.$oid === '630a3926696bb14037bdec1d' ) color = { color: '#333333' }
            return {
                ...provided,
                ...color,
                "&:hover": { ...CreateSideColor( side_id.$oid ) },
                cursor:    'pointer'
            }
        },
        control:    ( provided, state ) => {
            return {
                ...provided,
                backgroundColor: '#E5E5E5',
                borderRadius:    '8px'
            }
        },
        multiValue: ( provided, state ) => {
            //console.log( state )
            let { side_id } = JSON.parse( state.data.value )
            return {
                ...provided,
                border:  '1px solid #CCC',
                padding: '4px'
            }
        }
    }

    // Insert select box value
    useEffect( () => {
        let groups = []
        sides.forEach( side => {
            let options = []
            roles.filter( role => {
                if ( role.side_id.$oid === side._id.$oid ) {
                    options.push( {
                        label: role.name,
                        value: JSON.stringify( role )
                    } )
                }
            } )

            groups.push( { label: side.name, options: options } )
        } )

        SetOptions( groups )

    }, [ props.sides, roles, sides ] )

    // Insert select box value
    //useEffect( () => {
    //    let { id }  = Router.query
    //    let options = []
    //
    //    decks.filter( deck => {
    //        if ( deck._id.$oid === id ) {
    //            let { roles } = deck
    //            roles.forEach( role => {
    //                options.push( {
    //                    label: role.name,
    //                    value: JSON.stringify( role )
    //                } )
    //            } )
    //        }
    //    } )
    //
    //    SetValues( options )
    //}, [ Router.query, decks ] )

    // Active submit button if name value isn't empty
    const CheckDeckName = e => {
        let value = e.target.value

        if ( value !== '' ) {
            document.querySelector( 'button[type="submit"]' ).removeAttribute( 'disabled' )
        } else {
            document.querySelector( 'button[type="submit"]' ).setAttribute( 'disabled', 'disabled' )
        }
    }

    // Select roles from fields
    const SelectRoles = value => SetSelectedRoles( value )

    // Insert and update deck
    const UpdateDeck = async e => {
        e.preventDefault()

        let form             = e.target,
            title            = form.querySelector( '#title' ),
            roles            = [],
            button           = form.querySelector( 'button' ),
            { access_token } = user

        button.setAttribute( 'disabled', 'disabled' )

        SelectedRoles.forEach( role => {
            let {
                    _id,
                    name,
                    rate,
                    desc,
                    abilities,
                    side_id,
                    is_disabled,
                    created_at,
                    updated_at
                } = JSON.parse( role.value )

            roles.push( {
                "_id":         _id.$oid,
                "name":        name,
                "rate":        rate,
                "desc":        desc,
                "abilities":   abilities,
                "side_id":     side_id.$oid,
                "is_disabled": is_disabled,
                "created_at":  created_at,
                "updated_at":  updated_at
            } )
        } )

        let { status } = await CreateDeck( title.value, roles, access_token )

        if ( status ) {
            button.removeAttribute( 'disabled' )

            if ( status === 201 || status === 302 ) {
                toast.success( 'دک با موفقیت ایجاد شد' )

                setTimeout( () => Router.push( '/conductor/deck/' ), 2000 )
            } else {
                toast.error( 'خطایی در هنگام ایجاد دک بوجود آمده' )
                button.removeAttribute( 'disabled' )
            }
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>ویرایش دک بازی</title>
            </Head>

            <div className="page-title">
                <h2>ویرایش دک بازی</h2>
                <Link href={ '/conductor/deck' }>
                    <a>
                        بازگشت
                    </a>
                </Link>
            </div>

            <form onSubmit={ UpdateDeck } className={ "submit-form" }>

                <div className="row">
                    <label htmlFor="title">نام دک</label>
                    <input type="text" id={ "title" } onChange={ CheckDeckName } value={ deck.deck_name } />
                </div>

                <div className="row">
                    <label htmlFor="roles">انتخاب نقش ها</label>
                    <Select placeholder={ 'انتخاب کنید' }
                            styles={ SelectStyles }
                            options={ Options }
                            id={ "roles" }
                            isRtl={ true }
                            isMulti={ true }
                            onChange={ SelectRoles } />
                </div>

                <div className="row">
                    <button type={ "submit" } disabled={ true }>ثبت دک</button>
                </div>

            </form>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    const { id } = context.params

    const options = {
        method:   'GET',
        headers:  { "Authorization": `Bearer ${ user.access_token }` },
        redirect: 'follow'
    };

    const AvailableSides = await fetch( `${ process.env.GAME_URL }/game/side/get/availables`, options )
    const Sides          = await AvailableSides.json()

    const AvailableRoles = await fetch( `${ process.env.GAME_URL }/game/role/get/availables`, options )
    const Roles          = await AvailableRoles.json()

    const AvailableDecks = await fetch( `${ process.env.GAME_URL }/game/deck/get/availables`, options )
    const Decks          = await AvailableDecks.json()

    let deck = Decks.data.decks.filter( deck => deck._id.$oid === id )

    return {
        props: {
            sides: Sides.data.sides,
            roles: Roles.data.roles,
            deck:  deck[0],
            user:  user
        }
    }
}

export default Create