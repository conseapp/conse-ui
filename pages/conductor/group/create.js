import styles from "/styles/pages/conductor/event/create.module.scss";
import Head from "next/head";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Link from "next/link";
import CreateGroup from "../../../utils/createGroup";

const Create = props => {
    const Router   = useRouter()
    const { user } = props

    // Check group name
    const CheckGroupName = async e => {
        let value        = e.target.value
        let submitButton = document.querySelector( 'button[type="submit"]' )

        if ( value !== '' ) {
            submitButton.removeAttribute( 'disabled' )
        } else {
            submitButton.setAttribute( 'disabled', 'disabled' )
        }
    }

    // Submit group
    const SubmitEvent = async e => {
        e.preventDefault()

        let form                       = e.target,
            name                       = form.querySelector( '#name' ).value,
            submitButton               = form.querySelector( 'button[type="submit"]' ),
            { username, access_token } = user

        submitButton.setAttribute( 'disabled', 'disabled' )

        let { status } = await CreateGroup( name, username, access_token )

        if ( status === 201 ) {
            toast.success( 'گروه شما با موفقیت ساخته شد' )
            setTimeout( () => Router.push( '/conductor/group' ), 2000 )
        } else {
            toast.error( 'خطایی در هنگام ساختن گروه بوجود آمده' )
            submitButton.removeAttribute( 'disabled' )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>افزودن گروه</title>
            </Head>

            <div className="page-title">
                <h2>افزودن گروه</h2>
                <Link href={ '/conductor/group' }>
                    <a>
                        بازگشت
                    </a>
                </Link>
            </div>

            <form onSubmit={ SubmitEvent } className={ "submit-form" }>

                <div className="row">
                    <label htmlFor="name">نام گروه</label>
                    <input type="text" id={ "name" } onChange={ CheckGroupName } />
                </div>

                <div className="row">
                    <button type={ "submit" } disabled={ true }>ثبت گروه</button>
                </div>

            </form>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export default Create