const Profile = ({ username, photoURL }) => {
  return (
    <div className='profile'>
      <img alt='User profile' src={photoURL} />
      <p>{username}</p>
    </div>
  )
}

export default Profile
