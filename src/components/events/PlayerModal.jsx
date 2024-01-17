import { useEffect, useState } from 'react'
import { Modal } from '@mui/material'
import { RegularButton, TransparentButton } from '../ui/buttons'
import statuses from '../../utils/allPossibleStatus'
import { FaAngleDown } from 'react-icons/fa6'
import { chainPlayer, getChainInfo, getRoleAbility, updatePlayerRole, updatePlayerSide, updatePlayerStatus } from '../../api/gameApi'
import { useMutation, useQuery } from 'react-query'
import RoleSelectorOutline from '../ui/RoleSelectorOutline'
import { createEvent } from '../../api/eventApi'
import { updatePhaseState } from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'

const PlayerModal = ({ singleEvent, openModal, handleCloseModal, activePlayer, sides, roles, globalUser }) => {
    const { selectedTime } = useSelector(state => state.timeReducer);
    const [selectedRole, setSelectedRole] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [selectedSide, setSelectedSide] = useState(null)
    const [chainTo, setChainTo] = useState('none')
    const dispatch = useDispatch();

    useEffect(() => {
        if (!!activePlayer) {
            setSelectedStatus(activePlayer?.status)
            setSelectedRole(roles?.filter(role => role.name === activePlayer.role_name)[0])
            setSelectedSide(sides?.filter(side => side._id.$oid === activePlayer.side_id?.$oid)[0]?._id.$oid)
            setChainTo(prev => (
                chainInfo?.data.chain_infos ?
                    chainInfo?.data.chain_infos[chainInfo?.data.chain_infos.length - 1]?.to_id
                    : 'none'
            ))
        }
    }, [roles, sides, statuses, activePlayer])

    const reduceSides = (sides) => {
        if (roles && sides) {
            const sideIds = roles.map(role => role.side_id);
            const reducedSides = sides.filter(side => sideIds.includes(side._id.$oid));

            return reducedSides
        }
    }

    const { data: roleAbility, isLoading: roleAbilityIsLoading, isFetching: roleAbilityIsFetching } = useQuery([`role-ability-${activePlayer._id?.$oid}`], () => {
        const reqInfo = {
            token: globalUser.accessToken,
            body: {
                event_id: singleEvent._id.$oid,
                user_id: activePlayer._id?.$oid
            }
        }

        return getRoleAbility(reqInfo)
    }, {
        refetchOnWindowFocus: false,
        enabled: openModal
    })
    const { data: chainInfo, isLoading: chainInfoIsLoading, isFetching: chainInfoIsFetching } = useQuery([`chain-info-${activePlayer._id?.$oid}`], () => {
        const reqInfo = {
            token: globalUser.accessToken,
            body: {
                event_id: singleEvent._id.$oid,
                user_id: activePlayer._id?.$oid
            }
        }

        return getChainInfo(reqInfo)
    }, {
        refetchOnWindowFocus: false,
        enabled: openModal,
    })

    const { mutate: updatePlayerStatusMutation, updatePlayerStatusIsSuccess } = useMutation(updatePlayerStatus,
        {
            onError: (error) => {
                console.log(error);
            },
        })
    const { mutate: updatePlayerSideMutation, updatePlayerSideIsSuccess } = useMutation(updatePlayerSide,
        {
            onError: (error) => {
                console.log(error);
            },
        })
    const { mutate: updatePlayerRoleMutation, updatePlayerRoleIsSuccess } = useMutation(updatePlayerRole,
        {
            onError: (error) => {
                console.log(error);
            },
        })
    const { mutate: chainPlayerMutation } = useMutation(chainPlayer,
        {
            onSuccess: () => {
                const newData = {
                    to_id: chainTo,
                    chained_at: Math.floor(Date.now() / 1000),
                }
                const selectedUser = {
                    user_id: activePlayer?._id.$oid,
                    username: activePlayer?.username,
                    status: activePlayer?.status,
                    role_name: activePlayer?.role_name,
                    role_id: activePlayer?.role_id?.$oid,
                    side_id: activePlayer?.side_id?.$oid,
                }
                dispatch(updatePhaseState(selectedTime, selectedUser, newData, 'chain'));
            },
            onError: (error) => {
                console.log(error);
            },
        })

    const { mutate: createEventMutation } = useMutation(createEvent,
        {
            onSuccess: (result) => {
                // toast.success('ایونت با موفقیت آپدیت شد')
            },
            onError: (error) => {
                toast.error('خطایی در هنگام ذخیره تغیرات پیش آمده')
            },
        })

    const handleChainPlayer = async e => {
        if (chainTo !== "none") {
            const body = {
                from_id: activePlayer._id.$oid,
                to_id: chainTo,
                event_id: singleEvent?._id.$oid,
            }

            chainPlayerMutation({ token: globalUser.accessToken, body: body })
        }
    }

    const handleSubmit = () => {
        const user_id = activePlayer?._id.$oid
        const event_id = singleEvent._id.$oid

        const statusReqBody = {
            status: parseInt(selectedStatus),
            user_id,
            event_id,
        }
        const sideReqBody = {
            side_id: selectedSide,
            user_id,
            event_id,
        }
        const roleReqBody = {
            role_id: selectedRole._id.$oid,
            user_id,
            event_id,
        }

        let allPlayers = singleEvent.players

        let updateCurrentUser = {
            ...activePlayer,
            role_id: { $oid: selectedRole._id.$oid },
            role_name: selectedRole.name,
            status: parseInt(selectedStatus),
            side_id: { $oid: selectedSide },
        }

        allPlayers.map((player, index) => {
            if (player._id.$oid === updateCurrentUser._id.$oid) {
                allPlayers[index] = updateCurrentUser
            }
        })

        let editeEventBody = {
            title: singleEvent.title,
            content: singleEvent.content,
            deck_id: singleEvent.deck_id,
            entry_price: singleEvent.entry_price,
            group_info: singleEvent.group_info,
            creator_wallet_address: singleEvent.creator_wallet_address,
            upvotes: singleEvent.dataupvotes,
            downvotes: singleEvent.datadownvotes,
            voters: singleEvent.voters,
            phases: singleEvent.phases,
            max_players: singleEvent.max_players,
            players: allPlayers,
            started_at: singleEvent.started_at
        }

        updatePlayerStatusMutation({ token: globalUser.accessToken, body: statusReqBody })
        updatePlayerSideMutation({ token: globalUser.accessToken, body: sideReqBody })
        updatePlayerRoleMutation({ token: globalUser.accessToken, body: roleReqBody })
        createEventMutation({ token: globalUser.accessToken, body: editeEventBody })
        handleChainPlayer()

        handleCloseModal()
    }


    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div className="min-w-[312px] gap-4 max-w-[400px] p-6 shadow-lg w-[80%] h-[512px] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
                <h3 className="text-lg w-full">
                    وضعیت بازیکن {activePlayer.username}
                </h3>
                <div className='w-full flex-1 flex flex-col gap-4'>
                    <div className='flex flex-col w-full relative'>
                        <label className='z-10 text-xs text-center bg-navy relative top-2 right-4 w-min whitespace-nowrap px-1' htmlFor={"status"}>وضعیت بازیکن</label>
                        <FaAngleDown size={16} className="absolute left-4 top-8 pointer-events-none" />
                        <select value={selectedStatus} className='appearance-none border border-gray-light px-2.5 py-3 bg-navy rounded-2xl text-sm w-full focus:outline-none focus-visible:outline-none'
                            id={"status"}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            {
                                statuses.map((status, index) => {
                                    return (
                                        <option className='text-sm' key={index} value={index}>{status}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className='flex flex-col w-full relative'>
                        <label className='z-10 text-xs text-center bg-navy relative top-2 right-4 w-min whitespace-nowrap px-1' htmlFor={"side"}>ساید بازیکن</label>
                        <FaAngleDown size={16} className="absolute left-4 top-8 pointer-events-none" />
                        <select value={selectedSide} className='appearance-none border border-gray-light px-2.5 py-3 bg-navy rounded-2xl text-sm w-full focus:outline-none focus-visible:outline-none'
                            id={"side"}
                            onChange={(e) => setSelectedSide(e.target.value)}
                        >
                            {
                                reduceSides(sides)?.map(side => (<option key={side._id.$oid} value={side._id.$oid} >{side.name}</option>))
                            }
                        </select>
                    </div>

                    <div className='flex flex-col w-full relative'>
                        <label className='z-10 text-xs text-center bg-navy relative top-2 right-4 w-min whitespace-nowrap px-1' htmlFor={"chain"}>زنجیر شده به بازیکن دیگر</label>
                        <FaAngleDown size={16} className="absolute left-4 top-8 pointer-events-none" />
                        <select className='appearance-none border border-gray-light px-2.5 py-3 bg-navy rounded-2xl text-sm w-full focus:outline-none focus-visible:outline-none'
                            id={"chain"}
                            onChange={(e) => setChainTo(e.target.value)}
                            value={chainTo}
                        >
                            {(singleEvent?.players) ? <>
                                {singleEvent?.players.map(player => {
                                    return (
                                        (player._id.$oid == activePlayer?._id?.$oid) ?
                                            null
                                            :
                                            <option
                                                className='text-sm'
                                                key={player._id.$oid}
                                                value={player._id.$oid}
                                            >
                                                {player.username}
                                            </option>
                                    )
                                })}
                                <option
                                    // selected={(modalUserChainInfo == undefined) || (modalUserChainInfo == 'none')}
                                    value={'none'}
                                >{'هیچکدام'}
                                </option>
                            </> : undefined}

                            {/* <option className='text-sm' value={'player'}>بازیکن</option> */}
                        </select>
                    </div>

                    <RoleSelectorOutline
                        label={"نقش بازیکن"}
                        roles={roles}
                        selectedRole={selectedRole}
                        setSelectedRole={(role) => setSelectedRole(role)}
                        type={singleEvent?.title.includes('cp/') ? 'classic-role' : 'modern-role'}
                    />
                </div>
                <div className="w-full flex">
                    <RegularButton onClick={handleSubmit} text='ذخیره' />
                    <TransparentButton onClick={handleCloseModal} text='لغو' />
                </div>
            </div>
        </Modal>
    )
}

export default PlayerModal