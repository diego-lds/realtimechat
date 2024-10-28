const Profile = ({ user }) => {
  const { photoURL, displayName } = user;
  return (
    <div className="flex items-center gap-2">
      <img
        className="rounded-full border-2"
        alt="User"
        src={photoURL}
        width={50}
        height={50}
      />
      <p>{displayName}</p>
    </div>
  );
};

export default Profile;
