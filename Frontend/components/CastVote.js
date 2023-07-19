import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddress } from "../constants/index";
import { useNotification } from "web3uikit";
import CandidateCard from "./CandidateCard";

export default function CastVotePage() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const decentraVoteAddress =
    chainId in contractAddress ? contractAddress[chainId]["0"] : null;

  const [candidateNames, setCandidateNames] = useState([]);
  const [candidateAddresses, setCandidateAddresses] = useState("");
  const [candidateVotes, setCandidateVotes] = useState([]);
  const [candidateImages, setCandidateImages] = useState([]);
  const [candidatePartyNames, setCandidatePartyNames] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const dispatch = useNotification();

  const {
    runContractFunction: getCandidatesData,
    isFetching: isCandidatesFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getCondidates",
    params: {},
  });

  const { runContractFunction: vote, isLoading } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "vote",
    params: {
      candidate,
    },
  });

  const {
    runContractFunction: getTotalVotes,
    isFetching: isTotalVoteFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getTotalVotes",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  async function updateUi() {
    try {
      const allCandidatesData = await getCandidatesData({
        onError: (e) => {
          console.error(e);
        },
      });

      const totalVotesFromBlock = await getTotalVotes({
        onError: (e) => {
          console.log(e);
        },
      });

      // Extract the candidate details from the returned data
      const names = allCandidatesData.map(
        (candidate) => candidate.candidateName
      );
      const addresses = allCandidatesData.map(
        (candidate) => candidate.candidateAddress
      );
      const votes = allCandidatesData.map((candidate) => candidate.voteCount);
      const images = allCandidatesData.map(
        (candidate) => candidate.candidateImage
      );
      const partyNames = allCandidatesData.map(
        (candidate) => candidate.partyName
      );

      setCandidateNames(names);
      setCandidateAddresses(addresses);
      setCandidateImages(images);
      setCandidatePartyNames(partyNames);
      setCandidateVotes(votes);
      setTotalVotes(totalVotesFromBlock);
    } catch (e) {
      console.error(e);
    }
  }

  const handleVoteSubmit = async (candidateAddress) => {
    setCandidate(candidateAddress);
  };

  useEffect(() => {
    if (candidate !== null) {
      runVoteFunc();
    }
  }, [candidate]);

  async function runVoteFunc() {
    await voteFunc();
  }

  async function voteFunc() {
    await vote({
      onSuccess: handleVoteSuccess,
      onError: (e) => {
        alert(e);
        console.error(e);
      },
    });
  }

  const handleVoteSuccess = async (tx) => {
    await tx.wait(1);
    handleNewVoteSuccess();
  };

  const handleNewVoteSuccess = () => {
    dispatch({
      type: "info",
      message: "Voted Successfully!",
      title: "Transaction Notification!",
      position: "topR",
    });
    // Update the vote count after successful vote
    updateUi();
  };

  const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr;

    const separator = "....";
    const separatorLength = separator.length;
    const charsToShow = strLen - separatorLength;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
      fullStr.substring(0, frontChars) +
      separator +
      fullStr.substring(fullStr.length - backChars)
    );
  };

  if (!isWeb3Enabled) {
    return (
      <div className="flex flex-col justify-center items-center m-auto min-w-full min-h-screen">
        <h1 className="font-mainFont font-bold text-3xl mb-4">
          Sorry, Web3 Not Enabled! 😟
        </h1>
        <p>Please connect your wallet or install Metamask!</p>
      </div>
    );
  }

  if (isCandidatesFetching || isTotalVoteFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="font-mainFont font-bold text-2xl flex justify-center items-center">
          Fetching data from blockchain please wait....
        </h2>
      </div>
    );
  }

  if (!candidateNames || candidateNames.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center m-auto min-w-full min-h-screen">
        <h1 className="font-mainFont font-bold text-3xl mb-4">
          Oops! No data available!
        </h1>
        <p>Please check back later for candidate information.</p>
      </div>
    );
  }

  return (
    <div className="h-fit">
      {/* Render candidate data */}
      <div className="w-4/5 m-auto">
        <h1 className="font-main font-medium text-2xl mb-4 h-10 mt-10 w-4/5">
          Candidates
        </h1>
        <p className="mb-10">
          Note : You can't vote if you haven't registered or try to vote more
          than once !
        </p>
      </div>
      <div className="mb-20 w-4/5 m-auto flex flex-wrap">
        {/* {candidateNames?.map((name, index) => (
          // <div
          //   className="mr-10 bg-slate-950 w-1/4 h-full flex flex-col justify-evenly items-center rounded-md p-16 mb-30 hover:bg-slate-900 duration-500 cursor-pointer"
          //   key={index}
          // >
          //   <img
          //     className="w-36 rounded-full mb-6"
          //     src={`https://ipfs.io/ipfs/${candidateImages[index].replace(
          //       "ipfs://",
          //       ""
          //     )}`}
          //     width={200}
          //     alt="Candidate Image"
          //   />
          //   <h2 className="text-2xl font-mainFont font-bold mb-2">{name}</h2>
          //   <p className="font-mainFont mb-2">
          //     {candidatePartyNames[index].toString()}
          //   </p>
          //   <p className="font-mainFont mb-8">
          //     {candidateVotes[index].toString()}
          //   </p>
          //   <button
          //     className="border bg-transparent hover:bg-slate-700 duration-500  py-2 px-4 rounded-xl"
          //     onClick={() =>
          //       handleVoteSubmit(candidateAddresses[index].toString())
          //     }
          //     disabled={isLoading}
          //   >
          //     {isLoading ? (
          //       <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
          //     ) : (
          //       "Vote"
          //     )}
          //   </button>
          // </div>
          <CandidateCard
            key={index}
            name={name}
            address={candidateAddresses[index].toString()}
            votes={candidateVotes[index]}
            partyName={candidatePartyNames[index].toString()}
            image={candidateImages[index]}
            isLoading={isLoading}
            onVote={() => handleVoteSubmit(candidateAddresses)}
          />
        ))} */}

        {candidateNames?.map((name, index) => {
          const candidateData = {
            name,
            address: candidateAddresses[index].toString(),
            votes: candidateVotes[index],
            partyName: candidatePartyNames[index].toString(),
            image: candidateImages[index],
          };

          return (
            <CandidateCard
              key={index}
              {...candidateData} // Spread the candidateData object as props
              onVote={() => handleVoteSubmit(candidateData.address)}
            />
          );
        })}
      </div>
      <div className="w-4/5 m-auto flex flex-row justify-between items-center mb-20">
        <div className="flex w-1/2 items-center">
          <img className="mr-10" src="beepCF.gif" width={10}></img>
          <p className="font-mainFont text-2xl">Live Vote Counting....</p>
        </div>
      </div>
      <div className="flex flex-row justify-evenly items-center w-4/5 mb-10 m-auto text-center">
        <span>Pic</span>
        <span>Name</span>
        <span>Party Name</span>
        <span>Vote Count</span>
        <span>Address</span>
      </div>
      <div className="mb-20">
        {candidateNames?.map((name, index) => (
          <div
            className="mb-10 bg-slate-950 w-4/5 m-auto flex flex-row justify-between items-center rounded-full mb-30 hover:bg-slate-900 duration-300 cursor-pointer"
            key={index}
          >
            <img
              className="w-36 rounded-full"
              src={`https://ipfs.io/ipfs/${candidateImages[index].replace(
                "ipfs://",
                ""
              )}`}
              width={200}
              alt="Candidate Image"
            />
            <h2 className="text-2xl">{name}</h2>
            <p>{candidatePartyNames[index].toString()}</p>
            <p>{candidateVotes[index].toString()}</p>
            <a
              className="mr-32 text-sky-700"
              target="_blank"
              href={`https://sepolia.etherscan.io/address/${candidateAddresses[
                index
              ].toString()}`}
            >
              {truncateStr(candidateAddresses[index].toString(), 12)}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
