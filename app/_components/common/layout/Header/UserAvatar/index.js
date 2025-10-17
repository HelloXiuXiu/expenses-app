'use client'

import { useState } from 'react'
import Link from 'next/link'
import SignOutButton from '../SignOutButton'
import s from './styles.module.css'

function UserAvatar({ user }) {
  const [isOpen, setIsOpen] = useState(false)

  function closePopUp(e) {
    const targ = e.target.closest('.popup-box')
    if (targ) {
      window.addEventListener('click', closePopUp, { once: true })
      return
    } else {
      setIsOpen(false)
    }
  }

  function handleClick() {
    setIsOpen(true)
    window.addEventListener('click', closePopUp, { once: true })
  }

  return (
    <div className={s.user + ' popup-box'}>
      <img
        alt="user avatar"
        src={user.user_metadata.avatar_url}
        referrerPolicy="no-referrer"
        className={s.userImage}
        onClick={handleClick}
      />
      {isOpen && (
        <div className={s.userProfile}>
          <h2 className={s.userTitle}>Profile {user.email}</h2>
          <Link href="/account/settings">Settings</Link>
          <Link href="/account">Account</Link>
          <SignOutButton style={{ width: '100%' }} />
        </div>
      )}
    </div>
  )
}

export default UserAvatar
