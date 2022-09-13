import styles from "/styles/pages/conductor/deck/create.module.scss";
import Head from "next/head";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Link from "next/link";
import CreateSideColor from "../../../utils/createSideColor";
import CreateDeck from "../../../utils/createDeck";
import checkToken from "../../../utils/checkToken";
import Header from "../../../components/header";
import Nav from "../../../components/nav";
import { getCookie } from "cookies-next";

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
    const { user, sides, roles } = props

    /**
     * Create drop down menu options.
     * @version 1.0
     */
    const [ Options, SetOptions ] = useState( [] )

    /**
     * Selected roles.
     * @version 1.0
     */
    const [ SelectedRoles, SetSelectedRoles ] = useState( [] )

    /**
     * Change the style of the dropdown list.
     * @version 1.0
     * @type {{control: (function(*, *): *&{border: string, backgroundColor: string, borderRadius: string}), multiValue: (function(*, *): *&{border: string, paddingRight: string}), option: (function(*, *): *&{cursor: string, "&:hover": {}})}}
     */
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
                border:          'none',
                borderRadius:    '8px'
            }
        },
        multiValue: ( provided, state ) => ( {
            ...provided,
            paddingRight: '4px',
            border:       '1px solid #CCC'
        } )
    }

    /**
     * Set options of select box.
     * @version 1.0
     */
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

    /**
     * Enable the registration button if the name field is not empty.
     * @version 1.0
     * @param e
     * @constructor
     */
    const CheckDeckName = ( e ) => {
        let value        = e.target.value,
            submitButton = document.querySelector( 'button[type="submit"]' )

        if ( value !== '' ) {
            submitButton.removeAttribute( 'disabled' )
        } else {
            submitButton.setAttribute( 'disabled', 'disabled' )
        }
    }

    /**
     * Registering the selected roles in the corresponding variable.
     * @version 1.0
     * @param options
     * @constructor
     */
    const SelectRoles = ( options ) => SetSelectedRoles( options )

    /**
     * Submit deck
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const InsertDeck = async e => {
        e.preventDefault()

        // Variables
        let form   = e.target,
            title  = form.querySelector( '#title' ),
            button = form.querySelector( 'button' )

        // Roles
        let roles = []

        // Access token
        let token = getCookie( 'token' )

        // Disable submit button
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

        let { status } = await CreateDeck( title.value, roles, token )

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
                <title>افزودن دک بازی</title>
            </Head>

            <Header user={ user } />

            <Nav user={ user } />

            <div className="container">

                <div className="page-title">
                    <h2>افزودن دک بازی</h2>
                    <Link href={ '/conductor/deck' }>
                        <a>
                            بازگشت
                        </a>
                    </Link>
                </div>

                <form onSubmit={ InsertDeck } className={ "submit-form" }>

                    <div className="row">
                        <label htmlFor="title">نام دک</label>
                        <input type="text" id={ "title" } onChange={ CheckDeckName } />
                    </div>

                    <div className="row">
                        <label htmlFor="roles">انتخاب نقش ها</label>
                        <Select placeholder={ 'انتخاب کنید' } styles={ SelectStyles } options={ Options } id={ "roles" } isRtl={ true } isMulti={ true } onChange={ SelectRoles } />
                    </div>

                    <div className="row">
                        <button type={ "submit" } disabled={ true }>ثبت دک</button>
                    </div>

                </form>

            </div>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    // Get available sides
    let sides = await fetch( `${ process.env.GAME_URL }/game/side/get/availables`, {
        method:  'GET',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    sides     = await sides.json()

    // Get available roles
    let roles = await fetch( `${ process.env.GAME_URL }/game/role/get/availables`, {
        method:  'GET',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    roles     = await roles.json()

    return {
        props: {
            user:  user,
            sides: sides.data.sides,
            roles: roles.data.roles
        }
    }
}

export default Create