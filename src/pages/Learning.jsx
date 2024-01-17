import React, { useEffect, useState } from 'react'
import { SearchInput } from '../components/ui/inputs'
import { useQuery } from 'react-query'
import { getCards, getRoles, getSides } from '../api/gameApi'
import { useSelector } from 'react-redux'
import { Pagination, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { TransparentButton } from '../components/ui/buttons'
import { Modal } from '@mui/material'
import LearningCard from '../components/learning/LearningCard'
import LearningModal from '../components/learning/LearningModal'
import Circular from '../components/ui/Circular'


const Learning = () => {
  const [query, setQuery] = useState('')
  const globalUser = useSelector(state => state.userReducer)
  const [openModal, setOpenModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  const { data: sides, isFetching: sidesIsFetching } = useQuery([`sides`], () => getSides(globalUser.accessToken), {
    refetchOnWindowFocus: false,
  })

  const { data: roles, isFetching: rolesIsFetching } = useQuery([`roles`], () => getRoles(globalUser.accessToken), {
    refetchOnWindowFocus: false
  })

  const { data: cards, isFetching: cardsIsFetching } = useQuery([`cards`], () => getCards(globalUser.accessToken), {
    refetchOnWindowFocus: false
  })

  const Search = (data) => {
    return data?.filter(item => item.name.toLowerCase().includes(query));
  }

  const handleOpen = (card, type) => {
    setOpenModal(true)
    setSelectedCard({ card: card, type: type })
  }

  const handleClose = () => {
    setOpenModal(false)
    setSelectedCard(null)
  }

  return (
    <div className='h-custom-screen flex flex-col gap-4 pt-2'>
      <SearchInput id='title' value={query} placeholder={'جستجو'} onChange={(e) => setQuery(e.target.value)} />
      {
        (sides && cards && roles) ?

          <div className='w-full h-full overflow-auto flex flex-col gap-6 pt-6'>
            {
              sides.data.sides.map(side => (
                roles?.data.roles.filter(role => role.side_id.$oid === side._id.$oid &&
                  role.name.toLowerCase().includes(query)).length ?
                  <div key={side._id.$oid} className='flex flex-col gap-4'>
                    <h3>نقش‌های {side.name}</h3>
                    <Swiper
                      className='w-full max-w-2xl pb-8'
                      grabCursor={true}
                      slidesPerView={'auto'}
                      pagination={{
                        dynamicBullets: true,
                      }}
                      freeMode={true}
                      modules={[FreeMode, Pagination]}
                      spaceBetween={8}
                    >
                      {
                        Search(roles?.data.roles.filter(role => role.side_id.$oid === side._id.$oid))?.map(role => (
                          <SwiperSlide
                            className='w-[calc(50%-8px)] aspect-square bg-gray-dark rounded-2xl overflow-hidden'
                            key={role._id.$oid}
                            onClick={() => handleOpen(role, 'modern-role')}
                          >

                            {
                              role.name.includes('cp/') ?
                                <LearningCard card={role} type={'classic-role'} />
                                :
                                <LearningCard card={role} type={'modern-role'} />
                            }
                          </SwiperSlide>
                        ))
                      }
                    </Swiper>
                  </div>
                  : <></>
              ))
            }
            {
              Search(cards?.data)?.length > 0 ?
                <div className='flex flex-col gap-4'>
                  <h3>کارت‌های حرکت آخر</h3>
                  <Swiper
                    className='w-full max-w-2xl pb-8'
                    grabCursor={true}
                    slidesPerView={'auto'}
                    pagination={{
                      dynamicBullets: true,
                    }}
                    freeMode={true}
                    modules={[FreeMode, Pagination]}
                    spaceBetween={8}
                  >
                    {
                      Search(cards?.data)?.map(card => (
                        <SwiperSlide
                          className='w-[calc(50%-8px)] bg-gray-dark rounded-2xl overflow-hidden'
                          key={card._id.$oid}
                          onClick={() => handleOpen(card, 'last-move-card')}
                        >
                          <LearningCard card={card} type={'last-move-card'} />
                        </SwiperSlide>
                      ))
                    }
                  </Swiper>
                </div>
                : <></>
            }
          </div> : <Circular />
      }
      <LearningModal openModal={openModal} handleClose={handleClose} selectedCard={selectedCard} />
    </div>
  )
}

export default Learning