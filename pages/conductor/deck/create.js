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

const Create = props => {
    const Router = useRouter()

    const { sides, roles, user } = props

    const [ Options, SetOptions ]             = useState( [] )
    const [ SelectedRoles, SetSelectedRoles ] = useState( [] )

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

    // Active submit button if name value isn't empty
    const CheckDeckName = ( e ) => {
        let value = e.target.value

        if ( value !== '' ) {
            document.querySelector( 'button[type="submit"]' ).removeAttribute( 'disabled' )
        } else {
            document.querySelector( 'button[type="submit"]' ).setAttribute( 'disabled', 'disabled' )
        }
    }

    // Select roles from fields
    const SelectRoles = ( options ) => SetSelectedRoles( options )

    // Insert and update deck
    const UpsertDeck = async e => {
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
                <title>افزودن دک بازی</title>
            </Head>

            <div className="page-title">
                <h2>افزودن دک بازی</h2>
                <Link href={ '/conductor/deck' }>
                    <a>
                        بازگشت
                    </a>
                </Link>
            </div>

            <form onSubmit={ UpsertDeck } className={ "submit-form" }>

                <div className="row">
                    <label htmlFor="title">نام دک</label>
                    <input type="text" id={ "title" } onChange={ CheckDeckName } />
                </div>

                <div className="row">
                    <label htmlFor="roles">انتخاب نقش ها</label>
                    <Select options={ Options } id={ "roles" } isRtl={ true } isMulti={ true } onChange={ SelectRoles } />
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
    const token            = cookie.parse( context.req.headers.cookie )
    const { access_token } = JSON.parse( atob( token.access_token ) )

    const options = {
        method:   'GET',
        headers:  {
            "Authorization": `Bearer ${ access_token }`
        },
        redirect: 'follow'
    };

    const AvailableSides = await fetch( `${ process.env.GAME_URL }/game/side/get/availables`, options )
    const Sides          = await AvailableSides.json()

    const AvailableRoles = await fetch( `${ process.env.GAME_URL }/game/role/get/availables`, options )
    const Roles          = await AvailableRoles.json()

    return {
        props: {
            sides: Sides.data.sides,
            roles: Roles.data.roles
        }
    }
}

export default Create