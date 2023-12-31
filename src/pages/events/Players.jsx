import { MdEdit } from "react-icons/md";
import Avatar from '../../components/ui/Avatar'
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5"
import { expireEvent, getSingleGodEvent, lockEvent } from "../../api/eventApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Circular from "../../components/ui/Circular";
import { useSelector } from "react-redux";
import { Modal } from "@mui/material"
import { OutlineButton, RegularButton, TransparentButton } from "../../components/ui/buttons";
import PlayerModal from "../../components/events/PlayerModal";
import { revealRoles } from "../../api/eventApi";
import { toast } from "react-toastify";
import { getRoles, getSides, getSingleDeck } from "../../api/gameApi";



const Players = () => {
  const [players, setPlayers] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [activePlayer, setActivePlayer] = useState({})
  const client = useQueryClient()
  const { eventId } = useParams()
  const globalUser = useSelector(state => state.userReducer)
  const navigate = useNavigate()

  const { data: godEvent, isLoading: godEventIsLoading, isFetching: godEventIsFetching } = useQuery([`god-event-${eventId}`], () => {
    const reqInfo = { token: globalUser.accessToken, eventId: eventId }

    return getSingleGodEvent(reqInfo)
  }, {
    onSuccess: (result) => {
      if (result.data.group_info.god_id === globalUser.id)
        setPlayers(result.data.players)
    },
    refetchOnWindowFocus: false
  })

  const { data: sides, isFetching: sidesIsFetching } = useQuery([`sides`], () => getSides(globalUser.accessToken), {
    refetchOnWindowFocus: false,
  })

  const { data: singleDeck, isLoading: singleDeckIsLoading, isFetching: singleDeckIsFetching } =
    useQuery([`single-deck-${godEvent?.data.deck_id}`], () => {
      if (godEvent?.data.deck_id !== null) {
        const reqInfo = { token: globalUser.accessToken, body: { _id: godEvent?.data.deck_id } }

        return getSingleDeck(reqInfo)
      }
    }, {
      refetchOnWindowFocus: false
    })

  const { mutate: revealRolesMutation } = useMutation(revealRoles,
    {
      onSuccess: (result) => {
        toast.success('نقش ها با موفقیت پخش شد')
        client.invalidateQueries([`god-event-${eventId}`])
      },
      onError: (error) => {
        toast.error('خطایی در هنگام پخش نقش‌ها پیش آمده')
      },
    })

  const { mutate: lockEventMutation } = useMutation(lockEvent,
    {
      onSuccess: (result) => {
        toast.success('ایونت با موفقیت شروع شد')
        client.invalidateQueries([`god-event-${eventId}`])
      },
      onError: (error) => {
        toast.error('خطایی در هنگام شروع ایونت پیش آمده')
      },
    })

  const { mutate: expireEventMutation } = useMutation(expireEvent,
    {
      onSuccess: (result) => {
        toast.success('ایونت با موفقیت بسته شد')
        client.invalidateQueries([`god-event-${eventId}`])
      },
      onError: (error) => {
        toast.error('خطایی در هنگام بستن ایونت پیش آمده')
      },
    })

  const handleOpenModal = async user => {
    setOpenModal(true)
    setActivePlayer(user)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setActivePlayer({})
  }

  const handleRevealRoles = () => {
    const body = {
      _id: eventId
    }
    const reqInfo = { token: globalUser.accessToken, body }
    revealRolesMutation(reqInfo)

  }
  const handleLockEvent = () => {
    const body = {
      _id: eventId
    }
    const reqInfo = { token: globalUser.accessToken, body }
    lockEventMutation(reqInfo)

  }
  const handleExpireEvent = () => {
    const body = {
      _id: eventId
    }
    const reqInfo = { token: globalUser.accessToken, body }
    expireEventMutation(reqInfo)

  }

  return (
    <div className='h-custom-screen overflow-y-auto flex flex-col gap-6 py-1 relative'>
      <h2 className='text-xl w-full'>لیست بازیکنان</h2>
      {
        godEventIsFetching ?
          <Circular />
          :
          <>
            <div className='flex flex-col gap-2 h-custom-screen overflow-y-auto'>
              {
                players?.map(player => (
                  <div key={player._id.$oid} className='w-full flex bg-navy p-2 pl-3.5 rounded-3xl items-center'>
                    <Avatar color='blue' />
                    <div className="h-full flex-1 flex flex-col justify-center px-4">
                      <span>{player.username}</span>
                      {
                        player.role_name ?
                          <span className="text-sm">نقش: {player.role_name}</span>
                          :
                          <span className="text-sm text-gray-light">نقشی تعلق نگرفته است.</span>
                      }
                    </div>
                    <MdEdit onClick={() => handleOpenModal(player)} size={32} className='pl-2 text-primary-light cursor-pointer' />
                  </div>
                ))
              }

            </div>
            <div className="flex flex-col gap-2">
              {
                (!godEvent?.data.is_locked) ?
                  <>
                    <OutlineButton
                      fontSize={"sm"}
                      text='چیدن نقش‌ها'
                      onClick={() =>
                        navigate('event-roles', { state: { from: location.pathname, backButton: true } })
                      }
                    />
                    {(godEvent?.data.deck_id) ?
                      <OutlineButton
                        fontSize={"sm"}
                        text='پخش کردن نقش‌ها'
                        onClick={() =>
                          handleRevealRoles()
                        }
                      /> :
                      <></>
                    }
                    <RegularButton fontSize={"sm"} onClick={handleLockEvent} text='شروع بازی' />
                  </> :
                  (!godEvent?.data.is_expired) ?
                    <RegularButton fontSize={"sm"} onClick={handleExpireEvent} text='پایان بازی' />
                    :
                    <p className='text-center border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>این ایونت بسته شده است.</p>
              }

            </div>
          </>
      }
      <PlayerModal globalUser={globalUser} singleEvent={godEvent?.data} roles={singleDeck?.data.roles} sides={sides?.data.sides} activePlayer={activePlayer} openModal={openModal} handleCloseModal={handleCloseModal} />
    </div >
  )
}

export default Players