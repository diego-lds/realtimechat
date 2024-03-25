const UserProfile = ({ user }) => {
    const { displayName, photoURL } = user;
    return (
        <>
            <div className='flex justify-end items-center w-full p-2'>
                <h4 className='text-xl pr-3'>{displayName} </h4>
                <img
                    className='rounded-full border-2'
                    alt='User'
                    src={photoURL}
                    width={55}
                />
            </div>
        </>
    );
};

export default UserProfile;
