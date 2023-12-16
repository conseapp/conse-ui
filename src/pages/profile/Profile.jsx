import React from 'react'
import { RegularButton } from '../../components/ui/buttons'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions';

const Profile = () => {
  const dispatch = useDispatch();
  return (
    <RegularButton text={'logout'} onClick={() => dispatch(logout())} />
  )
}

export default Profile