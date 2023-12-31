import { useEffect, useState } from 'react'
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


const Learning = () => {
  const [query, setQuery] = useState('')
  const globalUser = useSelector(state => state.userReducer)
  const [openModal, setOpenModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState(false)

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

  const handleOpen = (role) => {
    setOpenModal(true)
    setSelectedCard(role)
  }

  return (
    <div className='h-custom-screen flex flex-col gap-4 pt-2'>
      <SearchInput id='title' value={query} placeholder={'جستجو'} onChange={(e) => setQuery(e.target.value)} />
      <div className='w-full h-full overflow-auto flex flex-col gap-6 pt-6'>
        {
          sides?.data.sides.map(side => (
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
                        className='w-[calc(50%-8px)] flex flex-col justify-end p-3 aspect-square bg-gray-dark rounded-2xl'
                        key={role._id.$oid}
                        onClick={() => handleOpen(role)}
                      >
                        <span className='text-sm'>{role.name}</span>
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
                      className='w-[calc(50%-8px)] flex flex-col justify-end p-3 aspect-square bg-gray-dark rounded-2xl'
                      key={card._id.$oid}
                      onClick={() => handleOpen(card)}
                    >
                      <span className='text-sm'>{card.name}</span>
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
            : <></>
        }
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="min-w-[312px] gap-4 max-w-[400px] p-4 shadow-lg w-[80%] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
          <div className='w-full bg-gray-dark aspect-4/3 rounded-lg'></div>
          <h2 className='text-lg w-full'>{selectedCard.name}</h2>
          <p dangerouslySetInnerHTML={{ __html: selectedCard.desc }} className='text-justify'></p>
          <div className="w-full flex-1 flex flex-col justify-end">
            <TransparentButton onClick={() => setOpenModal(false)} text='بستن' />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Learning