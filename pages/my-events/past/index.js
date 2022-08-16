import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import EventCard from "../../../components/EventCard";
import Dashboard from "../../../components/Dashboard";
import GET_OWNERS_PAST_EVENTS from "../../../gql/getOwnersPastEvents";

export default function MyPastEvents() {
  const { data: account } = useAccount();

  const eventOwner = account?.address.toLowerCase() || "";
  const [currentTimestamp, setEventTimestamp] = useState(
    new Date().getTime().toString()
  );
  const [mounted, setMounted] = useState(false);
  const { loading, error, data } = useQuery(GET_OWNERS_PAST_EVENTS, {
    variables: { eventOwner, currentTimestamp },
  });

  const events = data?.events?.map(({ id, name, eventTimestamp, imageURL }) => (
    <li key={id}>
      <EventCard
        id={id}
        name={name}
        eventTimestamp={eventTimestamp}
        imageURL={imageURL}
      />
      <Link href={`/my-events/past/${id}`}>
        <a className="text-indigo-800 text-sm truncate hover:underline">
          Confirm attendees
        </a>
      </Link>
    </li>
  ));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dashboard page="events" isUpcoming={false}>
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
          <p>No past events found</p>
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
