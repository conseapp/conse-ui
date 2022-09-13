import styles from '/styles/pages/learn.module.scss'
import Header from "../components/header";
import checkToken from "../utils/checkToken";
import Nav from "../components/nav";
import React from "react";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/free-mode';
import { CgChevronLeft } from "react-icons/cg";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CreateSideColor from "../utils/createSideColor";

const Learn = props => {
    const { user, sides, roles } = props

    const openModal = async e => {
        let id = e.target.getAttribute( 'data-id' )

        roles.map( role => {
            if ( role._id.$oid === id ) {
                withReactContent( Swal ).fire( {
                    ...CreateSideColor( role.side_id.$oid ),
                    title:              <h3>{ role.name }</h3>,
                    html:               <div dangerouslySetInnerHTML={ { __html: role.desc } }></div>,
                    confirmButtonColor: 'var(--primary-color)',
                    confirmButtonText:  'متوجه شدم'
                } )
            }
        } )
    }

    return (
        <div className={ styles.page }>

            <Header user={ user } profile={ false } />

            <Nav user={ user } />

            <div className={ "container" }>

                {
                    sides.map( side => {
                        return (
                            <div key={ side._id.$oid } className="row" style={ { marginBottom: '40px' } }>
                                <div className="page-title">
                                    <h3>{ side.name }</h3>
                                </div>

                                <Swiper spaceBetween={ 16 } slidesPerView={ 2 } freeMode={ true } modules={ [ FreeMode ] } className={ styles.swiper }>
                                    { roles.map( role => {
                                        if ( role.side_id.$oid === side._id.$oid ) {
                                            return (
                                                <SwiperSlide key={ role._id.$oid }>
                                                    <button type={ "button" } style={ CreateSideColor( role.side_id.$oid ) } onClick={ openModal } data-id={ role._id.$oid }>
                                                        <h3>{ role.name }</h3>
                                                        <span dangerouslySetInnerHTML={ { __html: role.desc } } />
                                                        <b>
                                                            بیشتر
                                                            <CgChevronLeft />
                                                        </b>
                                                    </button>
                                                </SwiperSlide>
                                            )
                                        }
                                    } ) }
                                </Swiper>
                            </div>
                        )
                    } )
                }

            </div>

        </div>
    )
}

export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    // Get events
    let sides = await fetch( `${ process.env.GAME_URL }/game/side/get/availables`, {
        method:  'GET',
        headers: {
            "Authorization": `Bearer ${ context.req.cookies['token'] }`
        }
    } )
    sides     = await sides.json()

    // Get roles
    let roles = await fetch( `${ process.env.GAME_URL }/game/role/get/availables`, {
        method:  'GET',
        headers: {
            "Authorization": `Bearer ${ context.req.cookies['token'] }`
        }
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

export default Learn