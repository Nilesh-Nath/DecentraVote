import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants/index";
import { useNotification } from "web3uikit";
import { useEffect, useState } from "react";

export default function Register() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const decentraVoteAddress =
    chainId in contractAddress ? contractAddress[chainId]["0"] : null;

  const [_age, setAge] = useState("0");
  const [nationality, setNationality] = useState("");
  const [isRegistered, setIsRegistered] = useState(null);
  const [voter, setVoter] = useState("");

  const dispatch = useNotification();

  const { runContractFunction: registerVoter, isLoading: isRegistering } =
    useWeb3Contract({
      abi: abi,
      contractAddress: decentraVoteAddress,
      functionName: "registerVoter",
      params: {
        _age,
        nationality,
      },
    });

  const { runContractFunction: getEligibility, isFetching: isChecking } =
    useWeb3Contract({
      abi: abi,
      contractAddress: decentraVoteAddress,
      functionName: "getEligibility",
      params: {
        voter,
      },
    });

  const [isCheckClicked, setIsCheckClicked] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const age = document.getElementById("age").value;
    const nationality = document
      .getElementById("nationality")
      .value.toLowerCase();
    setAge(age);
    console.log(nationality);
    setNationality(nationality);
  };

  useEffect(() => {
    if (_age !== "0" && nationality !== "") {
      registerVote();
    }
  }, [_age, nationality]);

  async function registerVote() {
    try {
      await registerVoter({
        onSuccess: handleSuccess,
        onError: (e) => {
          alert(e);
          console.error(e);
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewSuccess(tx);
  };

  const handleNewSuccess = () => {
    dispatch({
      type: "info",
      message: "Registered!",
      title: "Transaction Notification!",
      position: "topR",
    });
  };

  const checkRegister = () => {
    const voterAddress = document.getElementById("address").value;
    console.log(voterAddress);

    if (!voterAddress) {
      setError("Please enter a valid voter address.");
      return;
    }

    setError("");
    setVoter(voterAddress);
    setIsCheckClicked(true);
  };

  useEffect(() => {
    updateUI();
  }, [voter]);

  async function updateUI() {
    if (isCheckClicked) {
      const eligible = await getEligibility({
        onError: (e) => {
          console.error(e);
        },
      });
      console.log(`Eligible : ${eligible}`);
      setIsRegistered(eligible);
    }
  }

  return isWeb3Enabled ? (
    <div className="h-fit flex flex-col">
      <div className="h-fit flex flex-row justify-evenly w-4/5 m-auto mb-20">
        <div className="w-1/4 border border-indigo-400 p-10 rounded-xl mt-20 h-fit">
          <p className="text-xl border-b border-b-indigo-400 text-white mb-4">
            Conditions to meet for Register:
          </p>
          <ul className="list-disc">
            <li>Age should be greater than or equal to 18.</li>
            <li>Nationality should be Nepali.</li>
            <li>A voter can register for only once.</li>
          </ul>
        </div>
        <div className="border border-indigo-400 w-1/4 rounded-xl h-fit mt-20 pt-10 pb-10 pl-4 pr-4">
          <form className="flex flex-col justify-evenly">
            <h2 className="text-xl text-white text-center mb-4">Register</h2>
            <label htmlFor="age"></label>
            <input
              id="age"
              className="bg-transparent border-b-2 border-b-white m-4 outline-none"
              placeholder="Enter Your Age...."
            />
            <label htmlFor="nationality"></label>
            <input
              id="nationality"
              className="bg-transparent border-b-2 border-b-white m-4 outline-none mb-8"
              placeholder="Enter your nationality...."
            />
            <button
              className="border bg-transparent hover:bg-slate-900  py-2 px-4 rounded-xl w-1/2 ml-4"
              onClick={handleRegister}
              disabled={isRegistering}
            >
              {isRegistering ? (
                <div className="m-auto animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="p-10 h-fit">
        <h2 className="text-xl text-white text-center mb-20">
          Are you registered?
        </h2>
        <div className="flex justify-center items-center">
          <label htmlFor="address"></label>

          <input
            id="address"
            className="bg-transparent border-b-2 border-b-white m-4 outline-none w-1/4 mr-6 active:bg-transparent"
            placeholder="Enter Your Wallet Address...."
          />
          <button
            className="border bg-transparent hover:bg-slate-900  py-2 px-4 rounded-xl ml-4 mr-10"
            onClick={checkRegister}
            disabled={isChecking}
          >
            {isChecking ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Check"
            )}
          </button>
          {error && <div>{error}</div>}
          {isCheckClicked && isRegistered !== null && (
            <div>
              {isRegistered ? (
                <div>Yes! You are registered!</div>
              ) : (
                <div>No! You're not registered!</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center m-auto min-w-full min-h-screen">
      <h1 className="font-mainFont font-bold text-3xl mb-4">
        Sorry, Web3 Not Enabled! 😟
      </h1>
      <p>Please connect your wallet or install Metamask!</p>
    </div>
  );
}
