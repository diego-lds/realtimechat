const SignOutButton = ({ signOut }) => {
  return (
    <button className='sign-out' onClick={() => signOut()}>
      Deslogar
    </button>
  )
}

export default SignOutButton
