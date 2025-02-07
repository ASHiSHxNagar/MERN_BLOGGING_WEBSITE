import React from 'react'
import PageAnimation from '../common/PageAnimation'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { useContext } from 'react'
import { removeFromSession } from '../common/Session'

const UserNavigation = () => {

  const { userAuth: { username }, setUserAuth } = useContext(UserContext)

  const signOutUser = () => {
    removeFromSession("user")
    setUserAuth({ access_token: null })
  }
  return (
    <PageAnimation transition={{ duration: 0.2 }} className="absolute right-0 z-50 ">
      <div className='bg-white absolute right-0 border border-grey  w-60 overflow-hidden duration-200'>
        <Link to="/editor" className='flex gap-2 link md:hidden pl-8 py-4 '>
          <i className='fi fi-rr-file-edit '></i></Link>

        <Link to={`/user/${username}`} className=' link pl-8 py-4 '>
          Profile</Link>
        <Link to="/dashboard/blogs" className=' link pl-8 py-4 '>
          Dashboard</Link>
        <Link to="/settings/edit-profile" className=' link pl-8 py-4 '>
          Settings</Link>

        <span className='absolute border-t border-grey w-[100%]'></span>
        <button className='tetx-left p-4 hover:bg-grey w-full pl-8 py-4'
          onClick={signOutUser}>
          <h1 className='font-bold tetx-xl mb-1'>Sign Out</h1>
          <p className='text-dark-grey'>@{username}</p>
        </button>

      </div>
    </PageAnimation>
  )
}

export default UserNavigation