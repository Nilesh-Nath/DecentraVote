import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddress } from "../constants/index";
import { Button, useNotification } from "web3uikit";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddCandidatePage() {
  const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const decentraVoteAddress =
    chainId in contractAddress ? contractAddress[chainId]["0"] : null;
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(null);
  const [file, setFile] = useState(null);
  const [_name, _setName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState(null);
  const [_candidateImage, _setCandidateImage] = useState("");
  const [_partyName, _setPartyName] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [campaignState, setCampaignState] = useState(null);

  const dispatch = useNotification();

  const { runContractFunction: getOwner } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getOwner",
    params: {},
  });

  const { runContractFunction: addCandidates, isLoading } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "addCandidates",
    params: {
      _name,
      candidateAddress,
      _candidateImage,
      _partyName,
    },
  });

  const { runContractFunction: openCampaign, isLoading: loadingCampaign } =
    useWeb3Contract({
      abi: abi,
      contractAddress: decentraVoteAddress,
      functionName: "openCampaign",
      params: {},
    });

  const { runContractFunction: getCampaignState } = useWeb3Contract({
    abi: abi,
    contractAddress: decentraVoteAddress,
    functionName: "getCampaignState",
    params: {},
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      updateCampaignState();
    }
  }, [isWeb3Enabled]);

  async function updateCampaignState() {
    const campaignStateFromB = await getCampaignState();
    setCampaignState(campaignStateFromB);
  }

  useEffect(() => {
    if (
      _name !== "" &&
      candidateAddress !== null &&
      _candidateImage !== "" &&
      _partyName !== ""
    ) {
      (async () => {
        try {
          console.log("Uploading To Blockchain....");
          await addCandidates({
            onSuccess: handleSuccess,
            onError: (e) => {
              // Check if the error is due to user canceling the transaction
              if (e?.code === 4001) {
                console.log("Transaction canceled by the user.");
                return;
              }
              alert(e);
              console.error(e);
            },
          });
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [_partyName]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewSuccess(tx);
  };

  const handleNewSuccess = () => {
    dispatch({
      type: "info",
      message: "Candidate Added!",
      title: "Transaction Notification!",
      position: "topR",
    });
  };

  // Fetch owner information and update loading state
  useEffect(() => {
    async function fetchOwner() {
      try {
        const ownerOfContract = await getOwner({
          onError: (e) => {
            console.error(e);
          },
        });
        setOwner(ownerOfContract);
        setLoading(false); // Set loading state to false
      } catch (error) {
        console.error(error);
      }
    }
    fetchOwner();
  }, [getOwner]);

  let authorizedTothisPage = account?.toLowerCase() === owner?.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `12123569fa71dc40b27b`,
            pinata_secret_api_key: `3bdc70753baa6ccb6b4e019952f8c8523f42a008e9302d7593ddeeac27d623f8`,
            "Content-Type": "multipart/form-data",
          },
        });
        const fileURL = `ipfs://${resFile.data.IpfsHash}`;
        console.log(fileURL);
        console.log("Uploaded!");
        _setCandidateImage(fileURL);

        console.log(_candidateImage);
      } catch (error) {
        console.error(error);
        alert("Unable to upload file to Pinata!");
      }
    }
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const partyName = document.getElementById("partyName").value;
    _setName(name);
    setCandidateAddress(address);
    _setPartyName(partyName);
  };

  const retrieveFile = async (e) => {
    console.log("I was here!");
    const data = e.target.files[0];
    if (data && data instanceof Blob) {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
      reader.onloadend = () => {
        setFile(e.target.files[0]);
      };
      e.preventDefault();
    }
    setIsSelected(true);
  };

  const handleOpen = async () => {
    await openCampaign({
      onSuccess: handleOpenSuccess,
      onError: (e) => {
        console.error(e);
      },
    });
  };

  const handleOpenSuccess = async (tx) => {
    await tx.wait(1);
    handleNewOpenSuccess(tx);
  };

  const handleNewOpenSuccess = () => {
    dispatch({
      type: "info",
      message: "Campaign Opened! Please refresh the page and add candidates :)",
      title: "Transaction Notification!",
      position: "topR",
    });
  };

  return isWeb3Enabled ? (
    loading ? (
      <div className="h-screen flex justify-center items-center text-2xl font-bold font-mainFont">
        Loading...
      </div> // Add loading state
    ) : authorizedTothisPage ? (
      <div className="w-full h-fit items-center flex justify-center flex-col p-10">
        <form className="flex flex-col w-9/12 h-screen justify-center items-center border border-white rounded-lg">
          <h1 className="font-mainFont font-bold text-2xl mb-4">
            Credentials of the candidate
          </h1>
          {/* Input fields */}
          {campaignState == 0 ? (
            <div></div>
          ) : (
            <h2 className="mb-16 text-white">
              Campaign is closed please open the campaign before adding
              candidate!
            </h2>
          )}
          <label htmlFor="name"></label>
          <input
            className="bg-transparent w-1/2 border-b-2 border-b-white m-4 p-2 outline-none"
            type="text"
            id="name"
            placeholder="Enter Name Of Candidate...."
          />
          <label htmlFor="address"></label>
          <input
            className="bg-transparent w-1/2 border-b-2 border-b-white m-4 p-2 outline-none"
            type="text"
            id="address"
            placeholder="Enter the address of Candidate...."
          />
          {isSelected ? (
            <label htmlFor="file-select" className="custom-file-label">
              {file?.name || "Picture Picked!"}
            </label>
          ) : (
            <label htmlFor="file-select" className="custom-file-label">
              Pick the photo of candidate from your device....
            </label>
          )}

          <input
            className="custom-file-input"
            type="file"
            id="file-select"
            onChange={retrieveFile}
            placeholder="Pick the photo of candidate from your device...."
          />
          <label htmlFor="partyName"></label>
          <input
            className="bg-transparent w-1/2 border-b-2 border-b-white m-4 p-2 mb-10 outline-none"
            type="text"
            id="partyName"
            placeholder="Enter the party name of candidate...."
          />
          <button
            className="border bg-transparent hover:bg-slate-900  py-2 px-4 rounded-xl"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Add Candidate"
            )}
          </button>
        </form>
        <div className="h-fit border border-white flex flex-col m-10 p-4 rounded-xl">
          <h1 className="font-mainFont font-bold text-2xl m-10">
            Open Campaign
          </h1>
          <button
            className="border bg-transparent hover:bg-slate-900  py-2 px-4 rounded-xl w-1/2 m-auto mb-10"
            onClick={handleOpen}
            disabled={loadingCampaign}
          >
            {loadingCampaign ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full m-auto"></div>
            ) : (
              "Open"
            )}
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center m-auto min-w-full min-h-screen">
        <h1 className="font-mainFont font-bold text-3xl mb-4">
          Access Denied! 👮‍♂️
        </h1>
        <p>You are not authorized to access this page.</p>
      </div>
    )
  ) : (
    <div className="flex flex-col justify-center items-center m-auto min-w-full min-h-screen">
      <h1 className="font-mainFont font-bold text-3xl mb-4">
        Sorry, Web3 Not Enabled! 😟
      </h1>
      <p>Please connect your wallet or install Metamask!</p>
    </div>
  );
}
