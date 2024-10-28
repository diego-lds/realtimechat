import ExitIcon from "../assets/exit.svg";

export default function SignOutButton({ handleSignOut }) {
  return (
    <button
      onClick={() => handleSignOut()}
      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
    >
      <img
        src={ExitIcon}
        alt="Logout"
        width={20}
        height={20}
        className="mr-2"
      />
      Sair
    </button>
  );
}
