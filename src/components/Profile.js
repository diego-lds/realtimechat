import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth'

function Profile({ photo, name }) {
  return (
    <div className='profile'>
      <img alt={name} src={photo} />
      <h6>{name}</h6>
    </div>
  )
}

export default Profile()
