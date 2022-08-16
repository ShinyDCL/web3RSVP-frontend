import { useState, useEffect } from "react";
import Link from "next/link";
import client from "../../../apollo-client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import connectContract from "../../../utils/connectContract";
import formatTimestamp from "../../../utils/formatTimestamp";
import Alerts from "../../../components/Alerts";
import AttendeeTable from "../../../components/AttendeeTable";
import Head from "next/head";
import DashboardNav from "../../../components/DashboardNav";
import GET_EVENT_WITH_ATTENDEES from "../../../gql/getEventWithAttendees";

export default function PastEvent({ event }) {
  const { data: account } = useAccount();
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [mounted, setMounted] = useState(false);

  const confirmAttendee = async (attendee) => {
    try {
      const rsvpContract = connectContract();

      if (rsvpContract) {
        const txn = await rsvpContract.confirmAttendee(event.id, attendee);
        setLoading(true);
        console.log("Minting...", txn.hash);

        await txn.wait();
        console.log("Minted -- ", txn.hash);
        setSuccess(true);
        setLoading(false);
        setMessage("Attendance has been confirmed.");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Error!");
      setLoading(false);
      console.log(error);
    }
  };

  const confirmAllAttendees = async () => {
    try {
      const rsvpContract = connectContract();

      if (rsvpContract) {
        const txn = await rsvpContract.confirmAllAttendees(event.id, {
          gasLimit: 300000,
        });
        console.log("await txn");
        setLoading(true);
        console.log("Minting...", txn.hash);

        await txn.wait();
        console.log("Minted -- ", txn.hash);
        setSuccess(true);
        setLoading(false);
        setMessage("All attendees confirmed successfully.");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Error!");
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>My Dashboard | web3rsvp</title>
        <meta name="description" content="Manage your events and RSVPs" />
      </Head>
      <div className="flex flex-wrap py-8">
        <DashboardNav page={"events"} />
        <div className="sm:w-10/12 sm:pl-8">
          <Alerts success={success} message={message} loading={loading} />
          {account ? (
            account.address.toLowerCase() === event.eventOwner.toLowerCase() ? (
              <section>
                <Link href="/my-events/past">
                  <a className="text-indigo-800 text-sm hover:underline">
                    &#8592; Back
                  </a>
                </Link>
                <h6 className="text-sm mt-4 mb-2">
                  {formatTimestamp(event.eventTimestamp)}
                </h6>
                <h1 className="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl mb-8">
                  {event.name}
                </h1>
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <AttendeeTable
                    event={event}
                    confirmAttendee={confirmAttendee}
                    confirmAllAttendees={confirmAllAttendees}
                  />
                </div>
              </section>
            ) : (
              <p>You do not have permission to manage this event.</p>
            )
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  const { data } = await client.query({
    query: GET_EVENT_WITH_ATTENDEES,
    variables: {
      id,
    },
  });

  return {
    props: {
      event: data.event,
    },
  };
}
