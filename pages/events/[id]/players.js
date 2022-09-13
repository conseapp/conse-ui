import styles from '/styles/pages/event/players.module.scss'
import Head from "next/head";
import { MdClose, MdRefresh, MdSettings } from "react-icons/md";
import React, { useState } from "react";
import { useRouter } from "next/router";
import CreateSideColor from "../../../utils/createSideColor";
import Modal from 'react-modal';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import checkToken from "../../../utils/checkToken";
import Header from "../../../components/header";
import Nav from "../../../components/nav";
import statuses from "../../../utils/allPossibleStatus";

const Players = props => {
    const Router                              = useRouter()
    const { query }                           = Router
    const { user, token, event, sides, deck } = props

    const [ Players, SetPlayers ] = useState( event.players )

    const ToggleConductorMenu = async () => {
        let menu = document.querySelector( `.${ styles.conductorMenu }` )
        menu.classList.toggle( styles.open )
    }

    const RevealRoles = async () => {
        const request  = await fetch( `${ process.env.EVENT_URL }/event/reveal/roles`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( { "_id": query.id } )
        } )
        const response = await request.json()

        if ( response.status === 200 ) {
            SetPlayers( response.data.players )
        }
    }

    /**
     * Modal Config
     */
    const [ ModalIsOpen, SetModalIsOpen ] = useState( false )
    const [ ModalUser, SetModalUser ]     = useState( {} )
    const OpenModal                       = user => {
        SetModalUser( user )
        SetModalIsOpen( true )
        console.log( ModalUser )
    }
    const CloseModal                      = () => SetModalIsOpen( false )
    const ModalStyles                     = {
        overlay: {
            zIndex:         4,
            background:     'rgba(0,0,0,0.7)',
            padding:        '40px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center'
        },
        content: {
            width:        '100%',
            position:     'unset',
            padding:      '32px',
            borderRadius: '8px'
        }
    }

    const ChangePlayerStatus = async e => {
        const request  = await fetch( `${ process.env.GAME_URL }/game/player/update/status`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( {
                "user_id":  ModalUser._id.$oid,
                "status":   parseInt( e.target.value ),
                "event_id": query.id
            } )
        } )
        const response = await request.json()
    }

    const ChangePlayerSide = async e => {
        const request  = await fetch( `${ process.env.GAME_URL }/game/player/update/side`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( {
                "user_id":  ModalUser._id.$oid,
                "side_id":  e.target.value,
                "event_id": query.id
            } )
        } )
        const response = await request.json()
    }

    const ChangePlayerRole = async e => {
        const request  = await fetch( `${ process.env.GAME_URL }/game/player/update/role`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( {
                "user_id":  ModalUser._id.$oid,
                "role_id":  JSON.parse( e.target.value ).id,
                "event_id": query.id
            } )
        } )
        const response = await request.json()
    }

    const UpdateEvent = async e => {
        e.preventDefault()

        let status = document.querySelector( '#status' ).value
        let side   = document.querySelector( '#side' ).value
        let role   = JSON.parse( document.querySelector( '#role' ).value )

        let allPlayers = event.players

        let updateCurrentUser = {
            ...ModalUser,
            'role_id':   role.id,
            'role_name': role.name,
            'status':    parseInt( status ),
            'side_id':   side
        }

        allPlayers.map( ( player, index ) => {
            if ( player._id.$oid === updateCurrentUser._id.$oid ) {
                allPlayers[index] = updateCurrentUser
            }
        } )

        let body = {
            "title":                  event.title,
            "content":                event.content,
            "deck_id":                event.deck_id,
            "entry_price":            event.entry_price,
            "group_info":             event.group_info,
            "creator_wallet_address": event.creator_wallet_address,
            "upvotes":                event.upvotes,
            "downvotes":              event.downvotes,
            "voters":                 event.voters,
            "phases":                 event.phases,
            "max_players":            event.max_players,
            "players":                allPlayers
        }

        let request  = await fetch( `${ process.env.EVENT_URL }/event/add`, {
            method:  "POST",
            headers: { "Authorization": `Bearer ${ token }` },
            body:    JSON.stringify( body )
        } )
        let response = await request.json()

        if ( response.status === 302 ) {
            SetPlayers( response.data.players )
            toast.success( 'اطلاعات جدید با موفقیت ذخیره شد' )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>بازیکنان { event.title }</title>
            </Head>

            <Header user={ user } profile={ false } />

            <Nav user={ user } />

            <div className="container">

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
                                                { player.role_id &&
                                                  <span>
                                                      { deck.map( role => {
                                                          if ( role._id === player.role_id.$oid ) {
                                                              return role.name
                                                          }
                                                      } ) }
                                                  </span> }
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

            </div>

            <div id={ "ModalContainer" } />

            <Modal isOpen={ ModalIsOpen } style={ ModalStyles } onRequestClose={ CloseModal } contentLabel="Example Modal">
                <div className={ styles.modalHeader }>
                    <h3>تغییر وضعیت { ModalUser.username }</h3>
                    <button type={ "button" } onClick={ CloseModal }>
                        <MdClose />
                    </button>
                </div>
                <div className={ styles.modalBody }>

                    <div className={ styles.row }>
                        <label htmlFor={ "status" }>وضعیت پلیر</label>
                        <select id={ "status" } onChange={ ChangePlayerStatus }>
                            {
                                statuses.map( ( status, index ) => {
                                    let isSelected = false
                                    if ( Object.keys( ModalUser ).length !== 0 ) {
                                        if ( ModalUser.status === index ) {
                                            isSelected = true
                                        }
                                    }
                                    return (
                                        <option key={ index } value={ index } selected={ isSelected }>{ status }</option>
                                    )
                                } )
                            }
                        </select>
                    </div>

                    <div className={ styles.row }>
                        <label htmlFor={ "side" }>تغییر ساید پلیر</label>
                        <select id={ "side" } onChange={ ChangePlayerSide }>
                            { sides.map( side => {
                                let isSelected = false
                                if ( Object.keys( ModalUser ).length !== 0 ) {
                                    if ( ModalUser.side_id !== null ) {
                                        if ( ModalUser.side_id.$oid === side._id.$oid ) {
                                            isSelected = true
                                        }
                                    }
                                }
                                return <option key={ side._id.$oid } value={ side._id.$oid } selected={ isSelected }>{ side.name }</option>
                            } ) }
                        </select>
                    </div>

                    <div className={ styles.row }>
                        <label htmlFor={ "role" }>تغییر نقش پلیر</label>
                        <select id={ "role" } onChange={ ChangePlayerRole }>
                            { deck.map( role => {
                                let isSelected = false
                                if ( Object.keys( ModalUser ).length !== 0 ) {
                                    if ( ModalUser.role_id !== null ) {
                                        if ( ModalUser.role_id.$oid === role._id ) {
                                            isSelected = true
                                        }
                                    }
                                }
                                return (
                                    <option key={ role._id }
                                            value={ JSON.stringify( {
                                                'id':   role._id,
                                                'name': role.name
                                            } ) }
                                            selected={ isSelected }>
                                        { role.name }
                                    </option>
                                )
                            } ) }
                        </select>
                    </div>

                    <div className={ styles.row }>
                        <button type={ "button" } onClick={ UpdateEvent }>ذخیره</button>
                    </div>

                </div>
            </Modal>

            <ToastContainer ariaHideApp={ false } position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    let event = await fetch( `${ process.env.EVENT_URL }/event/get/single/${ context.query.id }/god`, {
        method:  'POST',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    event     = await event.json()

    let roles = await fetch( `${ process.env.EVENT_URL }/game/role/get/availables`, {
        method:  'GET',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    roles     = await roles.json()

    let sides = await fetch( `${ process.env.EVENT_URL }/game/side/get/availables`, {
        method:  'GET',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    sides     = await sides.json()

    let deck = await fetch( `${ process.env.GAME_URL }/game/deck/get/single`, {
            method:  'POST',
            headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` },
            body:    JSON.stringify( {
                '_id': event.data.deck_id
            } )
        }
    )
    deck     = await deck.json()

    return {
        props: {
            user:  user,
            token: context.req.cookies['token'],
            event: event.data,
            roles: roles.data.roles,
            sides: sides.data.sides,
            deck:  deck.data.roles
        }
    }
}

export default Players