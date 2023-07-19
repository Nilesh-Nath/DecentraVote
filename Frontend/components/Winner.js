import { abi, contractAddress } from "../constants/index";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

export default function Winner() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();

  const chainId = parseInt(chainIdHex);
  const decentraVoteAddress =
    chainId in contractAddress ? contractAddress[chainId]["0"] : null;
  const [campaignState, setCampaignState] = useState(null);
  const [interval, setInterval] = useState(null);
  const [winner, setWinner] = useState(null);
  const [candidateArrayLength, setCandidateArrayLength] = useState(0);

  const {
    runContractFunction: getWinnerCandidate,
    isFetching: fetchingWinner,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getWinnerCandidate",
    params: {},
  });

  const { runContractFunction: getInterval } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getInterval",
    params: {},
  });

  const { runContractFunction: getCampaignState } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getCampaignState",
    params: {},
  });

  const { runContractFunction: getCondidates } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getCondidates",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled && decentraVoteAddress) {
      updateUi();
    }
  }, [isWeb3Enabled, decentraVoteAddress]);

  useEffect(() => {
    // If the campaignState becomes 1, fetch the winner
    if (campaignState === 1) {
      fetchWinner();
    }
  }, [campaignState]);

  async function updateUi() {
    try {
      const campaignStateFromB = await getCampaignState();
      const intervalFromB = await getInterval();
      const candidateDataArray = await getCondidates({
        onError: (e) => {
          console.error(e);
        },
      });
      setCampaignState(campaignStateFromB);
      setInterval(intervalFromB);
      setWinner(null); // Reset winner state
      setCandidateArrayLength(candidateDataArray.length); // Update candidateArrayLength
    } catch (error) {
      console.error("Error getting campaign and interval details:", error);
    }
  }

  async function fetchWinner() {
    try {
      const winnerInfo = await getWinnerCandidate();
      setWinner(winnerInfo);
      console.log(winnerInfo);
    } catch (error) {
      console.error("Error getting winner details:", error);
    }
  }

  return (
    <div className="h-fit">
      {fetchingWinner ? (
        <div className="h-screen flex justify-center items-center">
          <div className="text-2xl font-mainFont font-bold">Fetching....</div>
        </div>
      ) : winner ? (
        // Show the winner when campaignState is 1 and winner is available
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="text-4xl font-mainFont font-bold mb-20">
            Congratulations 🎉🎉🎉🎉
          </h1>
          <div className="flex flex-col items-center">
            <img
              className="w-56 rounded-xl mb-6"
              src={`https://ipfs.io/ipfs/${winner.candidateImage.replace(
                "ipfs://",
                ""
              )}`}
              alt="Candidate Image"
            />
            <span className="text-2xl font-mainFont font-bold mb-5">
              {winner.candidateName}
            </span>
            <span className="text-xl font-mainFont font-bold">
              {winner.partyName}
            </span>
          </div>
          <p className="mt-4">
            Congratulation🎉 to the {winner.candidateName} for winning this
            election with {winner.voteCount.toNumber()} votes who belongs to{" "}
            {winner.partyName} party.
          </p>
        </div>
      ) : (
        // Show message when campaignState is 1 but winner is not available
        <div className="h-screen flex justify-center items-center">
          <div className="text-2xl font-mainFont font-bold">No winner yet.</div>
        </div>
      )}
    </div>
  );
}
