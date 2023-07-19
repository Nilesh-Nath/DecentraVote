import React from "react";
import { useState } from "react";

const CandidateCard = ({ name, address, votes, partyName, image, onVote }) => {
  const [isLoading, setIsLoading] = useState(false); // Separate isLoading state for each candidate

  const handleVoteClick = async () => {
    setIsLoading(true); // Set isLoading to true before the vote function call
    await onVote(); // Call the onVote function passed as a prop
    setIsLoading(false); // Set isLoading back to false after the vote function call is done
  };

  return (
    <div className="mr-10 bg-slate-950 w-1/4 h-full flex flex-col justify-evenly items-center rounded-md p-16 mb-30 hover:bg-slate-900 duration-500 cursor-pointer">
      <img
        className="w-36 rounded-full mb-6"
        src={`https://ipfs.io/ipfs/${image.replace("ipfs://", "")}`}
        width={200}
        alt="Candidate Image"
      />
      <h2 className="text-2xl font-mainFont font-bold mb-2">{name}</h2>
      <p className="font-mainFont mb-2">{partyName}</p>
      <p className="font-mainFont mb-8">{votes.toString()}</p>
      <button
        className="border bg-transparent hover:bg-slate-700 duration-500  py-2 px-4 rounded-xl"
        onClick={handleVoteClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
        ) : (
          "Vote"
        )}
      </button>
    </div>
  );
};

export default CandidateCard;
