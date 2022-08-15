import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import EventCard from "../../components/EventCard";
import Dashboard from "../../components/Dashboard";
import GET_OWNERS_UPCOMING_EVENTS from "../../gql/getOwnersUpcomingEvents";

export default function MyUpcomingEvents() {
  const { data: account } = useAccount();

  const eventOwner = account?.address.toLowerCase() || "";
  const [currentTimestamp, setEventTimestamp] = useState(
    new Date().getTime().toString()
  );
  const { loading, error, data } = useQuery(GET_OWNERS_UPCOMING_EVENTS, {
    variables: { eventOwner, currentTimestamp },
  });

  const mapEvents = () =>
    data.events.map(({ id, name, eventTimestamp, imageURL }) => (
      <li key={id}>
        <EventCard
          id={id}
          name={name}
          eventTimestamp={eventTimestamp}
          imageURL={imageURL}
        />
      </li>
    ));

  return (
    <Dashboard page="events" isUpcoming={true}>
      {loading && <p>Loading...</p>}
      {error && <p>`Error! ${error.message}`</p>}

      {data &&
        (data.events.length ? (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {mapEvents()}
          </ul>
        ) : (
          <p>No upcoming events found</p>
        ))}

      {!account && (
        <div className="flex flex-col items-center py-8">
          <p className="mb-4">Please connect your wallet to view your events</p>
          <ConnectButton />
        </div>
      )}
    </Dashboard>
  );
}
