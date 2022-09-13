import styles from '/styles/pages/index.module.scss'
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import 'swiper/css';
import 'swiper/css/free-mode';

const Index = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { events } = props

    return (
        <div className={ styles.page }>

            <div className={ styles.lastEvents }>
                <div className={ "page-title" }>
                    <h3>آخرین ایونت ها</h3>
                    <Link href={ "/events" }>
                        <a>بیشتر</a>
                    </Link>
                </div>
                <Swiper spaceBetween={ 12 } slidesPerView={ 2 } freeMode={ true } modules={ [ FreeMode ] } className={ styles.swiper }>
                    { events.map( event => {
                        return (
                            <SwiperSlide key={ event._id.$oid }>
                                <Link href={ `/events/${ event._id.$oid }` }>
                                    <a className={ styles.item } style={ { backgroundImage: 'url("/events-slide-1.png")' } }>
                                        <h3>{ event.title }</h3>
                                    </a>
                                </Link>
                            </SwiperSlide>
                        )
                    } ) }
                </Swiper>
            </div>

        </div>
    )
}

/**
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @returns {Promise<{props: {roles: *, sides: *, user: any}}>}
 */
export async function getServerSideProps() {
    let events = await fetch( `${ process.env.EVENT_URL }/event/get/all/in-going` )
    events     = await events.json()

    return {
        props: {
            events: events.data.reverse()
        }
    }
}

export default Index