import styles from '/styles/pages/profile/index.module.scss'
import React, { useEffect, useState } from "react";
import * as cookie from "cookie";
import { MdInfo, MdWarning } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

/**
 * Profile Page
 * @version 1.0
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Index = props => {
    /**
     * Get props of this page
     * @version 1.0
     * @var user, groups
     */
    const { user, groups, ingoing, expired } = props

    /**
     * Changing the state of panels when clicking on navigation items.
     * @version 1.0
     */
    useEffect( () => {
        let TabItems = document.querySelectorAll( `.${ styles.navigation } ul li` )
        let Tabs     = document.querySelectorAll( `.${ styles.tabs } > div` )

        TabItems.forEach( item => {

            item.addEventListener( 'click', function () {
                if ( item.classList.contains( styles.active ) ) return

                let target = item.getAttribute( 'data-target' )

                TabItems.forEach( li => li.classList.remove( styles.active ) )
                item.classList.add( styles.active )

                Tabs.forEach( div => div.classList.remove( styles.active ) )
                document.querySelector( target ).classList.add( styles.active )
            } )

        } )

    }, [] )

    /**
     * Checking whether the user has the ability to create a group or not.
     * @version 1.0
     * @returns {boolean}
     * @constructor
     */
    const CanCreateGroup = () => groups.filter( g => g.owner === user.username ).length <= 0

    /**
     * Set group name
     * @version 1.0
     */
    const [ GroupName, SetGroupName ] = useState( '' )
    useEffect( () => {
        let group = groups.filter( g => g.owner === user.username )
        if ( group.length > 0 ) {
            SetGroupName( group.at( -1 ).name )
        }
    }, [ groups, user.username ] )

    /**
     * Submit group
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const SubmitGroup = async e => {
        e.preventDefault()

        let form              = e.target,
            name              = form.querySelector( '#name' ),
            submit            = form.querySelector( 'button[type="submit"]' ),
            { _id, username } = user

        submit.setAttribute( 'disabled', 'disabled' )
        name.setAttribute( 'disabled', 'disabled' )

        if ( name.value === '' ) {
            submit.removeAttribute( 'disabled' )
            toast.warning( 'نام گروه نمیتواند خالی باشد' )
            return
        }

        let options = {
            method:   'POST',
            headers:  {
                "Authorization": `Bearer ${ user.access_token }`,
                "Content-Type":  "application/json"
            },
            body:     JSON.stringify( {
                "name":   name.value,
                "owner":  username,
                "god_id": _id.$oid
            } ),
            redirect: 'follow'
        }

        let response   = await fetch( `${ process.env.GAME_URL }/game/god/create/group`, options )
        let { status } = await response.json()

        if ( status === 201 ) {
            toast.success( 'گروه با موفقیت ثبت شد' )
            submit.remove()
        } else {
            toast.error( 'خطایی در هنگام ثبت گروه بوجود آمده، لطفا دوباره تلاش کنید' )
            submit.removeAttribute( 'disabled' )
        }
    }

    return (
        <div className={ styles.page }>

            <div className={ styles.navigation }>
                <ul>
                    <li className={ styles.active } data-target={ "#reserves" }>رزرو های من</li>

                    <li data-target={ "#history" }>تاریخچه</li>

                    { user.access_level !== 2 && <li data-target={ "#group" }>گروه من</li> }
                </ul>
            </div>

            <div className={ styles.tabs }>

                <div id={ "reserves" } className={ `${ styles.active } ${ styles.reserves }` }>
                    { ingoing.length > 0 ?
                        <ul>
                            { ingoing.filter( event => event.players ).map( event => {
                                return (
                                    <li key={ event._id.$oid }>
                                        <Link href={ `/event/${ event._id.$oid }` }>
                                            <a style={ { backgroundImage: 'url(/events-slide-2.png)' } }>
                                                <h3>
                                                    { event.title }
                                                </h3>
                                            </a>
                                        </Link>
                                    </li>
                                )
                            } ) }
                        </ul> :
                        <div className={ "alert" }>
                            <MdInfo />
                            <span>بازی رزروی وجود ندارد</span>
                        </div> }

                </div>

                <div id={ "history" } className={ styles.history }>
                    { expired.length > 0 ?
                        <ul>
                            { expired.map( event => {
                                return (
                                    <li key={ event._id.$oid }>
                                        <Link href={ `/event/${ event._id.$oid }` }>
                                            <a style={ { backgroundImage: 'url(/events-slide-2.png)' } }>
                                                <h3>
                                                    { event.title }
                                                </h3>
                                            </a>
                                        </Link>
                                    </li>
                                )
                            } ) }
                        </ul> :
                        <div className={ "alert" }>
                            <MdInfo />
                            <span>تاریخچه ای وجود ندارد</span>
                        </div> }
                </div>

                <div id={ "group" } className={ styles.group }>
                    { user.access_level !== 2 && CanCreateGroup === true ?
                        <>
                            <div className={ "page-title" }>
                                <h2>ثبت گروه</h2>
                            </div>

                            <div className={ "alert alert-warning" }>
                                <MdWarning />
                                <span>توجه داشته باشید، در صورت ثبت گروه دیگر قادر به تغییر نام آن نمیباشید، لذا برای تغییر آن باید درخواست خود را ثبت کنید تا پس از بررسی تغییر نام گروه برای شما انجام شود، پس با دقت نام گروه خود را انتخاب کنید</span>
                            </div>

                            <form onSubmit={ SubmitGroup } className={ "submit-form" }>
                                <div className="row">
                                    <label htmlFor="name">نام گروه</label>
                                    <input type="text" id={ "name" } />
                                </div>

                                <div className="row">
                                    <button type={ "submit" }>ثبت گروه</button>
                                </div>
                            </form>

                            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

                        </> : <>
                            <div className={ "page-title" }>
                                <h2>گروه شما</h2>
                            </div>

                            <div className={ "alert alert-info" }>
                                <MdInfo />
                                <span>شما نام گروه خود را انتخاب کردید برای تغییر به پشتیبانی درخواست دهید</span>
                            </div>

                            <form onSubmit={ SubmitGroup } className={ "submit-form" }>
                                <div className="row">
                                    <label htmlFor="name_temp">نام گروه</label>
                                    <input type="text" id={ "name_temp" } disabled={ true } value={ GroupName } />
                                </div>
                            </form>
                        </> }
                </div>

            </div>

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    // Get all groups
    let groups = await fetch( `${ process.env.GAME_URL }/game/get/group/all` )
    groups     = await groups.json()

    // Get all player ingoing events
    let ingoing = await fetch( `${ process.env.EVENT_URL }/event/get/all/player/in-going`, {
        method:   "POST",
        headers:  {
            "Authorization": `Bearer ${ user.access_token }`,
            "Content-Type":  "application/json"
        },
        body:     JSON.stringify( {
            "_id": user._id.$oid
        } ),
        redirect: 'follow'
    } )
    ingoing     = await ingoing.json()

    // Get all player ingoing events
    let expired = await fetch( `${ process.env.EVENT_URL }/event/get/all/player/done`, {
        method:   "POST",
        headers:  {
            "Authorization": `Bearer ${ user.access_token }`,
            "Content-Type":  "application/json"
        },
        body:     JSON.stringify( {
            "_id": user._id.$oid
        } ),
        redirect: 'follow'
    } )
    expired     = await expired.json()

    return {
        props: {
            groups:  groups.data.groups,
            ingoing: ingoing.data,
            expired: expired.data,
            user:    user
        }
    }
}

export default Index