import React, { useEffect, useState } from 'react'
import styles from '/styles/pages/learn/single-side.module.scss'
import Header from "../../components/header";
import Nav from "../../components/nav";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import { CgChevronLeft } from "react-icons/cg";
import CreateSideColor from "../../utils/createSideColor";
import Circular from '../../components/Circular';
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { MdSearch } from "react-icons/md";




export default function singleSide() {

    const { globalUser } = useSelector(state => state.userReducer)
    const [roles, setRoles] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')


    const loadRoles = async () => {
        // const { globalUser } = useSelector(state => state.userReducer)
        const res = await fetch(`${process.env.GAME_URL}/game/role/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        const data = await res.json()
        if (data.status == 200)
            setRoles(data.data.roles)
        console.log(data)
        // return data
    }

    useEffect(() => {
        loadRoles()
    }, [])

    useEffect(() => {
        if (roles)
            setLoading(false)
    }, [roles])

    const { query } = useRouter()

    const openRoleModal = async e => {
        let id = e.target.getAttribute('data-id')

        roles.map(role => {
            if (role._id.$oid === id) {
                withReactContent(Swal).fire({
                    ...CreateSideColor(role.side_id.$oid),
                    title: <h3>{role.name}</h3>,
                    html: <div dangerouslySetInnerHTML={{ __html: role.desc }}></div>,
                    confirmButtonColor: 'var(--primary-color)',
                    confirmButtonText: 'متوجه شدم'
                })
            }
        })
    }

    const Search = (data) => {
        return data.filter(item => item.name.toLowerCase().includes(searchQuery));
    }

    return (
        <div className={styles.page}>


            <Header user={globalUser} profile={false} />

            <Nav user={globalUser} />

            <div className={styles.search}>
                <label>
                    <input type={"text"} onChange={e => setSearchQuery(e.target.value)} placeholder={"جست و جو کنید"} />
                    <MdSearch />
                </label>
            </div>

            <>
                {loading ? <><div><Circular /></div></> : <>
                    <div className={styles.container}>
                        <div className="page-title">
                            <h3>{CreateSideColor(query.id).name}</h3>
                        </div>
                        {
                            roles.filter(role => (role.side_id.$oid === query.id && role.name.toLowerCase().includes(searchQuery))).length ?
                                <ul className={styles.list}>
                                    {Search(roles).map(role => {
                                        if (role.side_id.$oid === query.id) {
                                            return (
                                                <li key={role._id.$oid}>
                                                    <div className={styles.card} style={CreateSideColor(role.side_id.$oid)} onClick={openRoleModal} data-id={role._id.$oid}>
                                                        <h3>{role.name}</h3>
                                                        <span dangerouslySetInnerHTML={{ __html: role.desc }} />
                                                        <b data-id={role._id.$oid}>
                                                            بیشتر
                                                            <CgChevronLeft />
                                                        </b>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    })}
                                </ul >


                                :
                                <div className={styles.notFound}>
                                    <span className={styles.icon}>
                                        :
                                    </span>
                                    <h2>متاسفانه نتیجه ای یافت نشد !!</h2>
                                    <h4>لطفا دوباره تلاش کنید</h4>
                                </div>
                        }
                    </div>
                </>
                }

            </>

        </div >
    )
}
