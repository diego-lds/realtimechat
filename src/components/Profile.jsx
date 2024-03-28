const Profile = props => {
    const { user, ...rest } = props;
    const { photoURL } = user;
    return (
        <div className='' {...rest}>
            <img
                className='rounded-full border-2'
                alt='User'
                src={photoURL}
                width={50}
                height={50}
            />
        </div>
    );
};

export default Profile;
