import { FaMoneyBillWave } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoBackButton, RegularButton } from './ui/buttons';
import { useSelector } from 'react-redux';
import Avatar from './ui/Avatar';
import { Deposit, getUserBalance } from '../api/walletApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from "react";
import { Modal } from "@mui/material";
import { InputOutline } from "./ui/inputs";
import { toast } from "react-toastify";

const Header = () => {
  const globalUser = useSelector(state => state.userReducer)
  const location = useLocation();
  const from = location.state?.from
  const navigate = useNavigate()
  const [amount, setAmount] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const client = useQueryClient()

  const backPageName = () => {
    const previousPageName = ''
    if (from == '/mafia/profile') {
      return 'پروفایل'
    }
    if (from == '/mafia/manage') {
      return 'مدیریت بازی'
    }
    if (from == '/mafia/manage/events') {
      return 'مدیریت ایونت‌ها'
    }
    if (from?.includes('/players')) {
      return 'لیست بازیکنان'
    }
    return previousPageName
  }


  const { data: userBalance, isLoading: userBalanceLoading } =
    useQuery('user-balance', () => getUserBalance({ token: globalUser.accessToken, userID: globalUser.id }), {
      refetchOnWindowFocus: false
    })

  const { mutate: depositMutation } =
    useMutation(Deposit,
      {
        onSuccess: (result) => {
          console.log(result)
          client.invalidateQueries('user-balance')
          setOpenModal(false)
          setButtonDisabled(false)
          setAmount(0)
          toast.success('موجودی شما با موفقیت افزایش یافت')
        },
        onError: (error) => {
          toast.error('خطایی در هنگام افزایش موجودی پیش آمده')
        },
      })

  const handleDeposit = () => {
    setButtonDisabled(true)
    const reqInfo = { token: globalUser.accessToken, userID: globalUser.id, amount: amount.toString() }
    depositMutation(reqInfo)
  }


  return (
    <>
      <header className='flex w-full fixed justify-between top-0 left-0 p-4 box-border'>
        <div className='flex flex-col gap-2 justify-center'>
          {
            location.state?.backButton ?
              <GoBackButton onClick={() => location.state?.goToFrom ? navigate(from) : navigate(-1)} text={backPageName()} />
              :
              <>
                <span>{globalUser.username}</span>
                <span onClick={() => setOpenModal(true)} className='flex gap-1.5 text-sm cursor-pointer'>
                  <FaMoneyBillWave color='#32CD32' size={18} />
                  موجودی:&nbsp;
                  {userBalance ? Number(userBalance.data).toLocaleString() : 0} تومان
                  <span className='bg-primary-light rounded-full w-5 h-5 text-lg flex pt-1 justify-center items-center'>
                    +
                  </span>
                </span>
              </>
          }
        </div>
        <Link to="/mafia/profile">
          <Avatar
            color={'pink'}
            imgPath={globalUser.avatarPath ? `https://panel.api.jamshid.app/${globalUser.avatarPath}` : null}
          />
        </Link>
      </header>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="min-w-[312px] gap-4 max-w-[400px] p-6 shadow-lg w-[80%] h-[250px] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
          <p className='text-center text-lg'>مبلغ مورد نظر را به تومان وارد کنید</p>
          <div className="text-left">
            <InputOutline
              id='amount'
              value={amount.toLocaleString()}
              onChange={(e) => {
                if (!isNaN(Number(e.target.value.replace(/,/g, ''))))
                  setAmount(Number(e.target.value.replace(/,/g, '')))
              }}
              onFocus={e => e.target.select()}
            />
          </div>
          <div className='flex w-full gap-3'>
            <RegularButton
              onClick={handleDeposit}
              disabled={buttonDisabled}
              text={'تایید'}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Header