import { useState } from "react";
import Landing from "../components/Landing";
import { useQuery } from "@apollo/client";
import EventCard from "../components/EventCard";
import UPCOMING_EVENTS from "../gql/getUpcomingEvents";

export default function Home() {
  const [currentTimestamp, setEventTimestamp] = useState(
    new Date().getTime().toString()
  );

  const { loading, error, data } = useQuery(UPCOMING_EVENTS, {
    variables: { currentTimestamp },
  });

  return (
    <Landing>
      {loading && <p>Loading...</p>}
      {error && <p>`Error! ${error.message}`</p>}
      {!loading && !error && (
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
        >
          {data?.events.map(({ id, name, eventTimestamp, imageURL }) => (
            <li key={id}>
              <EventCard
                id={id}
                name={name}
                eventTimestamp={eventTimestamp}
                imageURL={imageURL}
              />
            </li>
          ))}
        </ul>
      )}
    </Landing>
  );
}
