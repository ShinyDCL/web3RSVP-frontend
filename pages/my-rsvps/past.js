import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import EventCard from "../../components/EventCard";
import Dashboard from "../../components/Dashboard";
import GET_RSVPS from "../../gql/getRSVPs";

export default function MyPastRSVPs() {
  const { data: account } = useAccount();
  const id = account?.address.toLowerCase() || "";
  const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime());
  const { loading, error, data } = useQuery(GET_RSVPS, {
    variables: { id },
  });

  const mapEvents = () => {
    return data.account.rsvps.map(
      ({ event: { id, name, eventTimestamp, imageURL } }) =>
        eventTimestamp < currentTimestamp && (
          <li key={id}>
            <EventCard
              id={id}
              name={name}
              eventTimestamp={eventTimestamp}
              imageURL={imageURL}
            />
          </li>
        )
    );
  };

  return (
    <Dashboard page="rsvps" isUpcoming={false}>
      {loading && <p>Loading...</p>}
      {error && <p>`Error! ${error.message}`</p>}

      {data && (
        <div>
          {!data.account && <p>No upcoming RSVPs found</p>}
          {data?.account && (
            <ul
              role="list"
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
            >
              {mapEvents()}
            </ul>
          )}
        </div>
      )}

      {!account && (
        <div className="flex flex-col items-center py-8">
          <p className="mb-4">Please connect your wallet to view your rsvps</p>
          <ConnectButton />
        </div>
      )}
    </Dashboard>
  );
}
