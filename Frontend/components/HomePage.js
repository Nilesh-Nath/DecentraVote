import { useEffect, useState } from "react";

export default function HomePage() {
  return (
    <div className="flex flex-col h-fit">
      <div className="w-1/2 h-screen m-auto flex flex-col justify-center items-center text-white">
        <div>
          <h1 className="text-5xl font-mainFont mb-10">
            Welcome to Decentralized Voting
          </h1>
          <p className="text-xl text-center mb-20">
            Make your voice heard by casting your vote!
          </p>
        </div>
      </div>
      <div className="w-4/5 m-auto h-fit flex items-start flex-row justify-between mb-56">
        <p className="w-1/2 mt-20 text-center text-white">
          A Secure and Transparent Way of Voting on the Blockchain DecentraApp
          revolutionizes the democratic voting process by providing a secure and
          transparent platform. With DecentraApp, individuals can cast their
          votes for representatives with confidence, knowing that blockchain
          technology protects their votes. The immutability and decentralization
          of the blockchain ensure the integrity of each vote, making it
          tamper-proof and fraud-resistant. Moreover, DecentraApp promotes
          transparency by allowing live vote counting and enabling users to
          check who voted. This transparency fosters trust, as anyone can verify
          the accuracy of the results and ensure the legitimacy of the
          participants. Join DecentraApp and be a part of the decentralized
          voting revolution! Note: Each paragraph has been condensed to fit into
          two paragraphs as requested.{" "}
        </p>
        <img
          className="rounded-xl"
          alt="img"
          src="/DecentraVoteGeeks.png"
          width={500}
        />
      </div>
    </div>
  );
}
