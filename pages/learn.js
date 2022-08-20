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

const Learn = () => {
    const [ groups, setGroups ] = useState( [] )

    useEffect( () => {
        setGroups( [
            {
                id:     1,
                name:   'شهروند ها',
                values: [
                    {
                        id:    1,
                        name:  'شهردار',
                        image: '/citizen.png',
                    },
                    {
                        id:    2,
                        name:  'کلانتر',
                        image: '/citizen.png',
                    },
                    {
                        id:    3,
                        name:  'قاضی',
                        image: '/citizen.png',
                    },
                    {
                        id:    4,
                        name:  'دست کج',
                        image: '/citizen.png',
                    },
                ],
            },
            {
                id:     2,
                name:   'مافیا',
                values: [
                    {
                        id:    1,
                        name:  'رئیس مافیا',
                        image: '/mafia.png',
                    },
                    {
                        id:    2,
                        name:  'محافظ',
                        image: '/mafia.png',
                    },
                    {
                        id:    3,
                        name:  'معشوقه',
                        image: '/mafia.png',
                    },
                    {
                        id:    4,
                        name:  'روانکاو',
                        image: '/mafia.png',
                    },
                ],
            },
        ] )
    }, [] )

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

                { groups.map( group => {
                    return (
                        //eslint-disable-next-line react/jsx-key
                        <div className={ `${ styles.row }` } key={ group.id }>
                            <div className={ styles.title }>{ group.name }</div>
                            <div className={ styles.content }>
                                <Swiper spaceBetween={ 12 } slidesPerView={ 2 } freeMode={ true } modules={ [ FreeMode ] }>
                                    { group.values.map( slide => {
                                        return (
                                            //eslint-disable-next-line react/jsx-key
                                            <SwiperSlide>
                                                {/* eslint-disable-next-line @next/next/no-img-element */ }
                                                <img src={ slide.image } alt={ slide.name } />
                                            </SwiperSlide>
                                        )
                                    } ) }
                                </Swiper>
                            </div>
                        </div>
                    )
                } ) }

            </div>

            <Nav />

        </div>
    )
}

export default Learn