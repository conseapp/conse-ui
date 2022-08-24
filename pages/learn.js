import styles from '../assets/scss/Learn.module.css'
import Header from "../components/header";
import Nav from "../components/nav";
import { IoIosSearch } from "react-icons/io";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/free-mode";
import { FreeMode } from "swiper";
import { useEffect, useState } from "react";

const Learn = ( { sides } ) => {
    document.querySelectorAll( '[data-side-id]' ).forEach( side => {
        console.log( side )
    } )

    const LoadRoles = () => {
        let id = this.getAttribute( 'data-id' )
        alert( 'salam' )
    }

    return (
        <div className={ styles.page }>

            <Header showProfile={ false } />

            <div className={ styles.search }>
                <label>
                    <IoIosSearch />
                    <input type="text" placeholder="جست و جو کنید" />
                </label>
            </div>

            <div className="container">

                { sides.map( side => {
                    return (
                        <div className={ styles.row } key={ side._id.$oid }>
                            <div className={ styles.title }>{ side.name }</div>
                            <div className={ styles.content } data-side-id={ side._id.$oid }>
                                { role }
                            </div>
                        </div>
                    )
                } ) }

                {/*{ groups.map( group => {*/ }
                {/*    return (*/ }
                {/*        //eslint-disable-next-line react/jsx-key*/ }
                {/*        <div className={ `${ styles.row }` } key={ group.id }>*/ }
                {/*            <div className={ styles.title }>{ group.name }</div>*/ }
                {/*            <div className={ styles.content }>*/ }
                {/*                <Swiper spaceBetween={ 12 } slidesPerView={ 2 } freeMode={ true } modules={ [ FreeMode ] }>*/ }
                {/*                    { group.values.map( slide => {*/ }
                {/*                        return (*/ }
                {/*                            //eslint-disable-next-line react/jsx-key*/ }
                {/*                            <SwiperSlide>*/ }
                {/*                                /!* eslint-disable-next-line @next/next/no-img-element */ }
                {/*                                <img src={ slide.image } alt={ slide.name } />*/ }
                {/*                            </SwiperSlide>*/ }
                {/*                        )*/ }
                {/*                    } ) }*/ }
                {/*                </Swiper>*/ }
                {/*            </div>*/ }
                {/*        </div>*/ }
                {/*    )*/ }
                {/*} ) }*/ }

            </div>

            <Nav />

        </div>
    )
}

export async function getStaticProps() {
    const getAllSides = await fetch( `${ process.env.GAME_URL }/game/side/get/availables` )
    const sides       = await getAllSides.json()

    return {
        revalidate: 10,
        props:      {
            sides: sides.data.sides,
        },
    }
}

export default Learn