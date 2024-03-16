const Profile = ({ username, photoURL }) => {
  return (
    <div className='profile'>
      <img alt='User' src={photoURL} />
      <h4>{username}</h4>
    </div>
  )
}

export default Profile
