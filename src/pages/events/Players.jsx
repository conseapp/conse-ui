import { MdEdit } from "react-icons/md";
import Avatar from '../../components/ui/Avatar'
import { useEffect, useState } from "react";
import { IoWarningOutline } from "react-icons/io5"
import { expireEvent, getSingleGodEvent, lockEvent } from "../../api/eventApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Circular from "../../components/ui/Circular";
import { useSelector } from "react-redux";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal } from "@mui/material"
import { OutlineButton, RegularButton, TransparentButton } from "../../components/ui/buttons";
import PlayerModal from "../../components/events/PlayerModal";
import { revealRoles } from "../../api/eventApi";
import { toast } from "react-toastify";
import { getRoles, getSides, getSingleDeck } from "../../api/gameApi";



const Players = () => {
  const [players, setPlayers] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [activePlayer, setActivePlayer] = useState({})
  const client = useQueryClient()
  const { eventId } = useParams()
  const [AvailableCards, SetAvailableCards] = useState(undefined)
  const [selectedCard, setSelectedCard] = useState(undefined)
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

  useEffect(() => {
    if (singleDeck?.data.last_move_cards.length > 0)
      SetAvailableCards(singleDeck?.data.last_move_cards)
  }, [singleDeck])

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
  const handleShowLastMoveCard = async e => {
    let cards = AvailableCards
    let newCards = []

    let random = Math.floor(Math.random() * cards.length)
    let card = cards[random]

    delete cards[random]

    cards.filter(c => {
      if (typeof c !== 'undefined') {
        newCards.push(c)
      }
    })

    SetAvailableCards(newCards)

    if (typeof card !== 'undefined') {
      setSelectedCard(card);
      setOpenDialog(true);
    } else {
      toast.warning('کارت حرکت آخر دیگری وجود ندارد! در صورت نیاز صفحه را رفرش کنید')
    }
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
                players.length ?
                  players?.map(player => (
                    <div key={player._id.$oid} className='w-full flex bg-navy p-2 pl-3.5 rounded-3xl items-center'>
                      <Avatar
                        imgPath={player.avatar_path ? `https://panel.api.jamshid.app/${player.avatar_path}` : null} color='blue' />
                      <div className="h-full flex-1 flex flex-col justify-center px-4">
                        <span>{player.username.split('::')[0]}</span>
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
                  :
                  <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3 text-center'>هنوز هیچ بازیکنی شرکت نکرده.</p>

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
                    {
                      (godEvent?.data.deck_id && players.length) ?
                        <>
                          <OutlineButton
                            fontSize={"sm"}
                            text='پخش کردن نقش‌ها'
                            onClick={() =>
                              handleRevealRoles()
                            }
                          />
                          <OutlineButton
                            fontSize={"sm"}
                            text='نمایش کارت حرکت آخر'
                            onClick={() =>
                              handleShowLastMoveCard()
                            }
                          />
                        </> :
                        <></>
                    }
                    {(players.length) ?
                      <RegularButton
                        fontSize={"sm"}
                        onClick={handleLockEvent}
                        text='شروع بازی'
                      />
                      :
                      <></>
                    }
                  </> :
                  (!godEvent?.data.is_expired) ?
                    <RegularButton fontSize={"sm"} onClick={handleExpireEvent} text='پایان بازی' />
                    :
                    <p className='text-center border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>این ایونت بسته شده است.</p>
              }

            </div>
          </>
      }
      {
        openDialog ?
          <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-screen h-screen bg-black bg-opacity-50">
            <div className="min-w-[312px] gap-4 max-w-[400px] p-6 shadow-lg w-[80%] rounded-2xl bg-navy flex flex-col justify-between items-center">
              <h3 className="text-xl">
                {selectedCard?.name}
              </h3>
              <p className="text-justify" dangerouslySetInnerHTML={{ __html: selectedCard?.desc }}></p>
              <div>
                <TransparentButton text='بستن' onClick={() => setOpenDialog(false)} />
              </div>
            </div>
          </div> : <></>
      }
      <PlayerModal globalUser={globalUser} singleEvent={godEvent?.data} roles={singleDeck?.data.roles.map(role => ({ ...role, _id: { $oid: role._id } }))} sides={sides?.data.sides} activePlayer={activePlayer} openModal={openModal} handleCloseModal={handleCloseModal} />

    </div >
  )
}

export default Players