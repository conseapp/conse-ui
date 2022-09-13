import styles from '/styles/pages/event/players.module.scss'
import Head from "next/head";
import * as cookie from "cookie";
import { MdClose, MdRefresh, MdSettings } from "react-icons/md";
import React, { useState } from "react";
import { useRouter } from "next/router";
import CreateSideColor from "../../../utils/createSideColor";
import Modal from 'react-modal';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Players = props => {
    const Router                        = useRouter()
    const { query }                     = Router
    const { event, user, roles, sides } = props

    const [ Players, SetPlayers ] = useState( event.players )

    const ToggleConductorMenu = async () => {
        let menu = document.querySelector( `.${ styles.conductorMenu }` )
        menu.classList.toggle( styles.open )
    }

    const RevealRoles = async () => {
        const response         = await fetch( `${ process.env.EVENT_URL }/event/reveal/roles`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ user.access_token }` },
            body:    JSON.stringify( { "_id": query.id } )
        } )
        const { data, status } = await response.json()

        if ( status === 200 ) {
            SetPlayers( data.players )
        }
    }

    /**
     * Modal Config
     */
    const [ ModalIsOpen, SetModalIsOpen ] = useState( false )
    const [ ModalUser, SetModalUser ]     = useState( {} )

    const OpenModal   = user => {
        SetModalUser( user )
        SetModalIsOpen( true )
    }
    const CloseModal  = () => SetModalIsOpen( false )
    const ModalStyles = {
        overlay: {
            zIndex:         4,
            background:     'rgba(0,0,0,0.7)',
            padding:        '40px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center'
        },
        content: {
            width:    '100%',
            position: 'unset',
            padding:  '32px'
        }
    }

    const AfterOpenModal = () => {
    }

    const ChangePlayerRole = async e => {
        let options = {
            method:   'POST',
            headers:  {
                "Authorization": `Bearer ${ user.access_token }`,
                "Content-Type":  "application/json"
            },
            body:     JSON.stringify( {
                "user_id": ModalUser._id.$oid,
                "role_id": e.target.value
            } ),
            redirect: 'follow'
        }

        let response   = await fetch( `${ process.env.GAME_URL }/game/player/update/role`, options )
        let { status } = await response.json()

        if ( status === 200 ) {
            toast.success( 'نقش با موفقیت تغییر پیدا کرد' )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>بازیکنان { event.title }</title>
            </Head>

            <div className={ styles.content }>

                <header className={ styles.header } style={ { backgroundImage: "url(/event-detail-header.png)" } }>
                    <h2>{ event.title }</h2>
                    <span>بازیکنان : { event.players.length } نفر</span>
                </header>

                <div className={ styles.players }>
                    <ul>
                        {
                            Players.map( player => {
                                return (
                                    <li key={ player._id.$oid }
                                        style={ player.side_id !== null ? CreateSideColor( player.side_id.$oid ) : {} }>
                                        <div className={ styles.info }>
                                            <strong>{ player.username }</strong>
                                            {
                                                player.role_id &&
                                                <span>
                                                {
                                                    roles.map( role => {
                                                        if ( role._id.$oid === player.role_id.$oid ) {
                                                            return role.name
                                                        }
                                                    } )
                                                }
                                            </span>
                                            }
                                        </div>
                                        <button type={ "button" } onClick={ () => {OpenModal( player )} }>
                                            <MdRefresh />
                                        </button>
                                    </li>
                                )
                            } )
                        }
                    </ul>
                </div>

            </div>

            <div className={ styles.conductorMenu }>
                <button type={ "button" } onClick={ ToggleConductorMenu }>
                    <MdSettings />
                </button>
                <header>پنل گرداننده</header>
                <ul>
                    <li>
                        <button type={ "button" } onClick={ RevealRoles }>پخش کردن نقش ها</button>
                    </li>
                    {/*<li>*/ }
                    {/*    <button type={ "button" }>بستن رزرو</button>*/ }
                    {/*</li>*/ }
                </ul>
            </div>

            <Modal isOpen={ ModalIsOpen } onAfterOpen={ AfterOpenModal } style={ ModalStyles } onRequestClose={ CloseModal } contentLabel="Example Modal">
                <div className={ styles.modalHeader }>
                    <h3>تغییر وضعیت { ModalUser.username }</h3>
                    <button type={ "button" } onClick={ CloseModal }>
                        <MdClose />
                    </button>
                </div>
                <div className={ styles.modalBody }>

                    <div className={ styles.row }>
                        <label htmlFor={ "status" }>وضعیت پلیر</label>
                        <select id={ "status" }>
                            <option value="0">کاربر در بازی بماند</option>
                            <option value="1">کاربر از بازی اخراج شود</option>
                            <option value="2">کاربر از بازی حذف شود</option>
                            <option value="3">تمام توانایی ها برای 3 شب گرفته شود</option>
                            <option value="4">تمام توانایی ها برای همیشه گرفته شود</option>
                            <option value="5">2 شب سایلنت شود</option>
                            <option value="6">6 شب سایلنت شود</option>
                            <option value="7">به یک بازیکن متصل شود</option>
                            <option value="8">نقش تغییر کند</option>
                            <option value="9">ساید تغییر کند</option>
                            <option value="10">از بازی خارج شد</option>
                            <option value="11">پلیر خود را فدا کرد</option>
                            <option value="12">قاتل حرفه ای به دنبال این بازیکن بیوفتد</option>
                        </select>
                    </div>

                    <div className={ styles.row }>
                        <label htmlFor={ "side" }>تغییر ساید پلیر</label>
                        <select id={ "side" }>
                            { sides.map( side => {
                                return <option key={ side._id.$oid } value={ side._id.$oid }>{ side.name }</option>
                            } ) }
                        </select>
                    </div>

                    <div className={ styles.row }>
                        <label htmlFor={ "side" }>تغییر نقش پلیر</label>
                        <select id={ "side" } onChange={ ChangePlayerRole }>
                            { roles.map( role => {
                                return <option key={ role._id.$oid } value={ role._id.$oid }>{ role.name }</option>
                            } ) }
                        </select>
                    </div>

                </div>
            </Modal>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    let event = await fetch( `${ process.env.EVENT_URL }/event/get/single/god/${ context.query.id }`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ user.access_token }` }
    } )
    event     = await event.json()

    let roles = await fetch( `${ process.env.EVENT_URL }/game/role/get/availables`, {
        method:  'GET',
        headers: { "Authorization": `Bearer ${ user.access_token }` }
    } )
    roles     = await roles.json()

    let sides = await fetch( `${ process.env.EVENT_URL }/game/side/get/availables`, {
        method:  'GET',
        headers: { "Authorization": `Bearer ${ user.access_token }` }
    } )
    sides     = await sides.json()

    return {
        props: {
            event: event.data,
            roles: roles.data.roles,
            sides: sides.data.sides,
            user:  user
        }
    }
}

export default Players