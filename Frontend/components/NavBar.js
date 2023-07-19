import Link from "next/link";
import { ConnectButton } from "web3uikit";

export default function NavBar() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-1/4 ml-5">
        <img
          src="/DecentraLogo.png"
          width={100}
          alt="DecentraVote"
          className="cursor-pointer"
        ></img>
      </div>
      <div className="flex flex-row justify-start items-center w-1/2">
        <Link legacyBehavior href="/">
          <a className="m-8 font-medium hover:text-violet-700 ease-linear duration-200">
            Home
          </a>
        </Link>
        <Link legacyBehavior href="/RegisterPage">
          <a className="m-8 font-medium hover:text-violet-700 ease-linear duration-200">
            Register
          </a>
        </Link>
        <Link legacyBehavior href="/CastVotePage">
          <a className="m-8 font-medium hover:text-violet-700 ease-linear duration-200">
            Cast Vote
          </a>
        </Link>
        <Link legacyBehavior href="/AddCandidatePage">
          <a className="m-8 font-medium hover:text-violet-700 ease-linear duration-200">
            Add Candidate
          </a>
        </Link>
        <Link legacyBehavior href="/WinnerPage">
          <a className="m-8 font-medium hover:text-violet-700 ease-linear duration-200">
            Check Winner
          </a>
        </Link>
      </div>
      <div className="w-1/4 justify-center items-center">
        <ConnectButton />
      </div>
    </div>
  );
}
