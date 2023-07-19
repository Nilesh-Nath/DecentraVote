import Image from "next/image";
import HomePage from "../../components/HomePage";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

export default function Home() {
  return (
    <div>
      <div>
        <HomePage />
      </div>
    </div>
  );
}
