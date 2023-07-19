const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const chainId = network.config.chainId;
const { interval, nameOfElection } = require("../../helper.config");

chainId == 31337
  ? describe("DecentraVote", () => {
      let deployer, voter1, voter2, candidate1, candidate2;
      let deployerConnectedContract,
        voter1ConnectedContract,
        voter2ConnectedContract;
      const candidate1Name = "Candidate1";
      const candidate2Name = "Candidate2";
      const candidate1Image = "ipfs://examplePic";
      const candidate1PartyName = "Party1";

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0].address;
        voter1 = accounts[1].address;
        voter2 = accounts[2].address;
        candidate1 = accounts[3].address;
        candidate2 = accounts[4].address;
        await deployments.fixture(["all"]);
        deployerConnectedContract = await ethers.getContract(
          "DecentraVote",
          deployer
        );
        voter1ConnectedContract = await ethers.getContract(
          "DecentraVote",
          voter1
        );
        voter2ConnectedContract = await ethers.getContract(
          "DecentraVote",
          voter2
        );
      });

      describe("Constructor", () => {
        it("1.It should initialized the value of constructor properly!", async () => {
          const campaignName =
            await deployerConnectedContract.getCampaignName();
          const intervalFromContract =
            await deployerConnectedContract.getInterval();
          const owner = await deployerConnectedContract.getOwner();
          const totalVotes = await deployerConnectedContract.getTotalVotes();
          const highestVote = await deployerConnectedContract.getHighestVote();
          assert.equal(campaignName, nameOfElection);
          assert.equal(intervalFromContract, interval);
          assert.equal(owner, deployer);
          assert.equal(totalVotes.toString(), "0");
          assert.equal(highestVote.toString(), "0");
        });
      });

      describe("AddCandidate", () => {
        it("1.It should revert if the caller is not owner!", async () => {
          await expect(
            voter1ConnectedContract.addCandidates(
              candidate1Name,
              candidate1,
              candidate1Image,
              candidate1PartyName
            )
          ).to.be.reverted;
        });

        it("2.It should push the credentials of the candidate to the array!", async () => {
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          const candidateName =
            await deployerConnectedContract.getCandidateNames();
          const candidateAddress =
            await deployerConnectedContract.getCandidateAddress();
          const candidateVoteCount =
            await deployerConnectedContract.getCandidateVote();
          const candidateImage =
            await deployerConnectedContract.getCandidateImage();
          const candidatePartyName =
            await deployerConnectedContract.getPartyName();
          assert.equal(candidateName[0], candidate1Name);
          assert.equal(candidateAddress[0], candidate1);
          assert.equal(candidateVoteCount[0], 0);
          assert.equal(candidateImage[0], candidate1Image);
          assert.equal(candidatePartyName[0], candidate1PartyName);
        });

        it("3.It should fire an event after the candidate is Added!", async () => {
          await expect(
            deployerConnectedContract.addCandidates(
              candidate1Name,
              candidate1,
              candidate1Image,
              candidate1PartyName
            )
          ).to.emit(deployerConnectedContract, "candidateAdded");
        });

        it("4.It should revert of the campaign is in close state!", async () => {
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
        });
      });

      describe("RegisterVote", () => {
        let age, lowerAge, nationality, otherNationality;
        beforeEach(() => {
          age = 20;
          lowerAge = 16;
          nationality = "nepali";
          otherNationality = "Indian";
        });

        it("1.It should revert if the age is less than 18!", async () => {
          await expect(
            voter1ConnectedContract.registerVoter(lowerAge, nationality)
          ).to.be.reverted;
        });

        it("2.It should revert if the natinality is other than nepali!", async () => {
          await expect(
            voter1ConnectedContract.registerVoter(age, otherNationality)
          ).to.be.reverted;
        });

        it("3.It should revert if the voter has already voted!", async () => {
          const txReg = await voter1ConnectedContract.registerVoter(
            age,
            nationality
          );
          await txReg.wait(1);
          const tx = await voter1ConnectedContract.vote(candidate1);
          await tx.wait(1);
          await expect(voter1ConnectedContract.registerVoter(age, nationality))
            .to.be.reverted;
        });

        it("4.It should set the eligibility of voter to true!", async () => {
          const tx = await voter1ConnectedContract.registerVoter(
            age,
            nationality
          );
          await tx.wait(1);
          const eligibility = await voter1ConnectedContract.getEligibility(
            voter1
          );
          expect(eligibility).to.be.true;
        });

        it("5.It should emit an event after the voter registered!", async () => {
          await expect(
            voter1ConnectedContract.registerVoter(age, nationality)
          ).to.emit(voter1ConnectedContract, "voterRegistered");
        });
      });

      describe("Vote", () => {
        it("1.It should revert if the eligibility is false!", async () => {
          await expect(voter1ConnectedContract.vote(candidate1)).to.be.reverted;
        });

        it("2.It should revert if the voter tries to vote for more than 1 times !", async () => {
          const age = 20;
          const nationality = "nepali";
          const tx = await voter1ConnectedContract.registerVoter(
            age,
            nationality
          );
          await tx.wait(1);
          const txVote = await voter1ConnectedContract.vote(candidate1);
          await txVote.wait(1);
          await expect(voter1ConnectedContract.vote(candidate1)).to.be.reverted;
        });

        it("3.It should increase the vote count of the candidate by 1 when someone voted him/her!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          const voteCounts = await voter1ConnectedContract.getCandidateVote();
          const voteCountOfCandidate1 = voteCounts[0];
          assert.equal(voteCountOfCandidate1.toString(), "1");
        });

        it("4.It should mark the voter as voted!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          await expect(voter1ConnectedContract.registerVoter(age, nationality))
            .to.be.reverted;
        });

        it("5.It should increase total votes by 1.", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          const voteCount = await voter1ConnectedContract.getTotalVotes();
          assert.equal(voteCount.toString(), "1");
        });

        it("6.It should update the voter's votedTo with the address of the candidate whome voter voted!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          const votedTo = await voter1ConnectedContract.getVotedTo(voter1);
          assert.equal(votedTo, candidate1);
        });

        it("7.It should emit an event after voter has successfully voted!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );

          await voter1ConnectedContract.registerVoter(age, nationality);
          await expect(voter1ConnectedContract.vote(candidate1)).to.emit(
            voter1ConnectedContract,
            "voted"
          );
        });

        it("8.It should revert is the campaign is in close state!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.performUpkeep("0x");
          await voter1ConnectedContract.registerVoter(age, nationality);
          await expect(voter1ConnectedContract.vote(candidate1)).to.be.reverted;
        });
      });

      describe("CheckUpKeep", () => {
        let interval;
        beforeEach(async () => {
          interval = await deployerConnectedContract.getInterval();
        });

        it("1.It should revert if the campaign is in the Close!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.performUpkeep("0x");
          const { upkeepNeeded } = await deployerConnectedContract.checkUpkeep(
            "0x"
          );
          assert(!upkeepNeeded);
        });

        it("2.It should revert if there are not enough candidates!", async () => {
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await deployerConnectedContract.checkUpkeep(
            "0x"
          );
          assert(!upkeepNeeded);
        });

        it("3.It should revert if the time stamp is reached!", async () => {
          const { upkeepNeeded } = await deployerConnectedContract.checkUpkeep(
            "0x"
          );
          assert(!upkeepNeeded);
        });

        it("4.It should return true if all conditions are met!", async () => {
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );

          const { upkeepNeeded } = await deployerConnectedContract.checkUpkeep(
            "0x"
          );
          assert(upkeepNeeded);
        });
      });

      describe("PerformUpKeep", () => {
        it("1.It should revert if the upkeep is false!", async () => {
          await expect(deployerConnectedContract.performUpkeep("0x")).to.be
            .reverted;
        });

        it("2.It should close the campaign while PerformUpKeep!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.performUpkeep("0x");
          const campaignState =
            await deployerConnectedContract.getCampaignState();
          assert.equal(campaignState.toString(), "1");
        });

        it("3.It should get the winner's name!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.performUpkeep("0x");
          const winnerName = await deployerConnectedContract.getWinnerName();
          assert.equal(winnerName, candidate1Name);
        });

        it("4.It should get the winner's address!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.performUpkeep("0x");
          const winnerAddress =
            await deployerConnectedContract.getWinnerAddress();
          assert.equal(winnerAddress, candidate1);
        });

        it("5.It should close the voting campaign!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await deployerConnectedContract.performUpkeep("0x");
          const campaignState =
            await deployerConnectedContract.getCampaignState();
          assert.equal(campaignState.toString(), "1");
        });

        it("6.It should emit an event after the winner is Picked!", async () => {
          const age = 20;
          const nationality = "nepali";
          await deployerConnectedContract.addCandidates(
            candidate1Name,
            candidate1,
            candidate1Image,
            candidate1PartyName
          );
          await voter1ConnectedContract.registerVoter(age, nationality);
          await voter1ConnectedContract.vote(candidate1);
          await network.provider.send("evm_increaseTime", [
            Number(interval) + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await expect(deployerConnectedContract.performUpkeep("0x")).to.emit(
            deployerConnectedContract,
            "gotWinner"
          );
        });

        // it("3.It should emit an event after the winner is picked!", async () => {
        //   await new Promise(async (resolve, reject) => {
        //     deployerConnectedContract.once("gotWinner", async () => {
        //       console.log("Got Winner Fired!");
        //       console.log("Why not Fired????");
        //       try {
        //         const winnerName =
        //           await deployerConnectedContract.getWinnerName();
        //         const winnerAddress =
        //           await deployerConnectedContract.getWinnerAddress();
        //         const campaignState =
        //           await deployerConnectedContract.getCampaignState();
        //         assert.equal(winnerName, candidate1Name);
        //         assert.equal(winnerAddress, candidate1);
        //         assert.equal(campaignState.toString(), "0");
        //         resolve();
        //       } catch (e) {
        //         reject(e);
        //       }
        //     });
        //     console.log("I'm Here!");
        //     const age = 20;
        //     const nationality = "nepali";
        //     await deployerConnectedContract.addCandidates(
        //         candidate1Name,
        //         candidate1,
        //         candidate1Image,
        //         candidate1PartyName
        //     );
        //     await voter1ConnectedContract.registerVoter(age, nationality);
        //     await voter1ConnectedContract.vote(candidate1);
        //     await deployerConnectedContract.performUpkeep("0x");
        //   });
        // });
      });
    })
  : describe.skip;
