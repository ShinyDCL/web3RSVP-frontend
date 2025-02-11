import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  const { loading, error, data } = useQuery(GET_RSVPS, {
    variables: { id },
  });

  const events = data?.account?.rsvps
    ?.filter(
      ({ event: { eventTimestamp } }) => eventTimestamp < currentTimestamp
    )
    .map(({ event: { id, name, eventTimestamp, imageURL } }) => (
      <li key={id}>
        <EventCard
          id={id}
          name={name}
          eventTimestamp={eventTimestamp}
          imageURL={imageURL}
        />
      </li>
    ));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dashboard page="rsvps" isUpcoming={false}>
      {loading && <p>Loading...</p>}
      {error && <p>`Error! ${error.message}`</p>}

      {data &&
        (events.length ? (
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {events}
          </ul>
        ) : (
          <p>No past RSVPs found</p>
        ))}

      {!account && (
        <div className="flex flex-col items-center py-8">
          <p className="mb-4">Please connect your wallet to view your rsvps</p>
          <ConnectButton />
        </div>
      )}
    </Dashboard>
  );
}
