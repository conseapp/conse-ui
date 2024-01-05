import React, { Fragment, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa6'
import { RegularButton, TransparentButton } from '../../components/ui/buttons'
import RoleSelector from '../../components/ui/RoleSelector'
import { useSelector } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getCards, getRoles, getSides, getSingleDeck, upsertDeck } from '../../api/gameApi'
import Circular from '../../components/ui/Circular'
import { createEvent, getSingleGodEvent } from '../../api/eventApi'
import { toast } from 'react-toastify'

const EventRoles = () => {
    const globalUser = useSelector(state => state.userReducer)
    const navigate = useNavigate()
    const { eventId } = useParams()
    const client = useQueryClient()
    const [selectedRoles, setSelectedRoles] = useState({})
    const [selectedCards, setselectedCards] = useState({})
    const [deckID, setDeckID] = useState(null)


    const { data: sides, isFetching: sidesIsFetching } = useQuery([`sides`], () => getSides(globalUser.accessToken), {
        refetchOnWindowFocus: false
    })
    const { data: roles, isFetching: rolesIsFetching } = useQuery([`roles`], () => getRoles(globalUser.accessToken), {
        refetchOnWindowFocus: false
    })
    const { data: cards, isFetching: cardsIsFetching } = useQuery([`cards`], () => getCards(globalUser.accessToken), {
        refetchOnWindowFocus: false
    })
    const { data: godEvent, isLoading: godEventIsLoading, isFetching: godEventIsFetching } =
        useQuery([`god-event-${eventId}`], () => {
            const reqInfo = { token: globalUser.accessToken, eventId: eventId }

            return getSingleGodEvent(reqInfo)
        }, {
            onSuccess: (result) => {
                if (result.data.deck_id)
                    setDeckID(result.data.deck_id)
            },
            refetchOnWindowFocus: false
        })

    const { data: singleDeck, isLoading: singleDeckIsLoading, isFetching: singleDeckIsFetching } =
        useQuery([`single-deck-${deckID}`], () => {
            if (deckID !== null) {
                const reqInfo = { token: globalUser.accessToken, body: { _id: deckID } }

                return getSingleDeck(reqInfo)
            }
        }, {
            onSuccess: (result) => {
                if (result !== undefined) {
                    setPrevRoles(result.data.roles)
                    setPrevCards(result.data.last_move_cards)
                }
            },
            refetchOnWindowFocus: false
        })

    const { mutate: upsertDeckMutation } = useMutation(upsertDeck,
        {
            onSuccess: (result) => {
                if (deckID)
                    handleUpsertEvent(deckID)
                else
                    handleUpsertEvent(result.data.$oid)
            },
            onError: (error) => {
                toast.error('خطایی در هنگام انتخاب نقش‌ها پیش آمده')
            },
        })

    const { mutate: createEventMutation } = useMutation(createEvent,
        {
            onSuccess: (result) => {
                toast.success('انتخاب نقش‌ها با موفقیت انجام شد')
                client.invalidateQueries([`god-event-${eventId}`])
                navigate(-1)
            },
            onError: (error) => {
                toast.error('خطایی در هنگام ویرایش ایونت پیش آمده')
                console.log(error);
            },
        })


    const handleUpsertDeck = () => {
        let roles = []
        let cards = []

        Object.keys(selectedRoles).forEach(side => {
            selectedRoles[side].forEach(role => {
                let {
                    _id,
                    name,
                    rate,
                    desc,
                    abilities,
                    side_id,
                    is_disabled,
                    created_at,
                    updated_at
                } = role
                roles.push({
                    _id: _id.$oid,
                    name: name,
                    rate: rate,
                    desc: desc,
                    abilities: abilities,
                    side_id: side_id.$oid,
                    is_disabled: is_disabled,
                    created_at: created_at,
                    updated_at: updated_at
                })
            })
        })
        selectedCards.forEach(card => {
            let {
                _id,
                name,
                rate,
                desc,
                is_disabled,
                created_at,
                updated_at
            } = card

            cards.push({
                _id: _id.$oid,
                name: name,
                rate: rate,
                desc: desc,
                is_disabled: is_disabled,
                created_at: created_at,
                updated_at: updated_at
            })
        })

        if (roles.length > 0 && cards.length > 0) {
            let body = {
                deck_name: `deck_${eventId}`,
                roles: roles,
                last_move_cards: cards,
                is_disabled: false,
                created_at: Math.floor(Date.now() / 1000)
            }

            if (deckID !== null)
                body._id = deckID

            const reqInfo = {
                body: body,
                token: globalUser.accessToken,
            }

            upsertDeckMutation(reqInfo)
        }
        else if (roles.length > 0)
            toast.warning('حداقل یک کارت حرکت آخر باید انتخاب شود')
        else if (cards.length > 0)
            toast.warning('حداقل یک نقش باید انتخاب شود')
        else
            toast.warning('حداقل یک نقش و یک کارت حرکت آخر باید انتخاب شود')

    }

    const handleUpsertEvent = async deckID => {
        const {
            title,
            content,
            deck_id,
            entry_price,
            group_info,
            creator_wallet_address,
            upvotes,
            downvotes,
            voters,
            phases,
            max_players,
            players,
            started_at,
        } = godEvent.data

        let body = {
            title: title,
            content: content,
            deck_id: deckID,
            entry_price: entry_price,
            group_info: group_info,
            creator_wallet_address: creator_wallet_address,
            upvotes: upvotes,
            downvotes: downvotes,
            voters: voters,
            phases: phases,
            max_players: max_players,
            players: players,
            started_at: started_at
        }

        const reqInfo = {
            body: body,
            token: globalUser.accessToken,
        }

        createEventMutation(reqInfo)
    }

    const setPrevRoles = (roles) => {
        let prevRoles = {}
        sides.data.sides.forEach(side => {
            let sideRoles = []
            roles.filter(role => {
                if (role.side_id === side._id.$oid) {
                    {
                        role._id = { $oid: role._id }
                        role.side_id = { $oid: role.side_id }
                        sideRoles.push(role)
                    }
                }
            })

            prevRoles[side.name] = sideRoles
        })
        setSelectedRoles(prevRoles)
    }

    const setPrevCards = (cards) => {
        let prevCards = []
        cards.forEach(card => {
            card._id = { $oid: card._id }
            prevCards.push(card)
        })
        setselectedCards(prevCards)
    }

    return (
        <div className='h-custom-screen overflow-y-auto flex flex-col gap-2 py-1'>
            {(sidesIsFetching || rolesIsFetching || cardsIsFetching) ?
                <Circular /> :
                <>
                    <div className='flex flex-col gap-6 h-custom-screen overflow-y-auto'>
                        <div className='flex flex-col gap-4'>
                            <h2 className='w-full'>انتخاب کارت‌های حرکت آخر</h2>
                            <RoleSelector
                                type={'last-move-card'}
                                label='کارت‌های حرکت آخر'
                                roles={cards?.data}
                                selectedRoles={selectedCards}
                                setSelectedRoles={setselectedCards}
                            />
                        </div>
                        <div className='flex flex-col gap-4'>
                            <h2 className='w-full'>انتخاب نقش‌ها</h2>
                            {sides?.data.sides.map(side => {
                                if (roles?.data.roles.filter(role => role.side_id.$oid === side._id.$oid).length) {
                                    return (
                                        <Fragment key={`side_${side._id.$oid}`}>
                                            <RoleSelector
                                                type={'modern-role'}
                                                label={`نقش‌های ${side.name}`}
                                                roles={roles?.data.roles.filter(role => role.side_id.$oid === side._id.$oid)}
                                                selectedRoles={selectedRoles[side.name]}
                                                setSelectedRoles={(arr) => setSelectedRoles(prev => ({ ...prev, [side.name]: arr }))}
                                            />
                                        </Fragment>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </>}
            <div className='flex-1 flex flex-col justify-end'>
                <RegularButton onClick={handleUpsertDeck} text='تایید چیدمان نقش‌ها' />
            </div>
        </div >
    )
}

export default EventRoles