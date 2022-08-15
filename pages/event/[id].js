import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import {
  EmojiHappyIcon,
  TicketIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import client from "../../apollo-client";
import GET_EVENTS from "../../gql/getEvents";
import formatTimestamp from "../../utils/formatTimestamp";
import connectContract from "../../utils/connectContract";
import RSVP from "../../components/RSVP";
import Alerts from "../../components/Alerts";

export default function Event({ event }) {
  const {
    id,
    name,
    deposit,
    eventTimestamp,
    description,
    totalRSVPs,
    maxCapacity,
    imageURL,
    eventOwner,
  } = event;

  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);

  const createNewRSVP = async () => {
    try {
      const rsvpContract = connectContract();
      if (rsvpContract) {
        const txn = await rsvpContract.createNewRSVP(id, {
          value: deposit,
          gasLimit: 300000,
        });

        setLoading(true);
        console.log("Minting...", txn.hash);
        await txn.wait();
        console.log("Minted -- ", txn.hash);

        setSuccess(true);
        setLoading(false);
        setMessage("Your RSVP has been created successfully.");
      } else {
        console.log("Error getting contract.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Error!");
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{name} | web3rsvp</title>
        <meta name="description" content={name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="relative py-12">
        <Alerts success={success} message={message} loading={loading} />
        <h6 className="mb-2">{formatTimestamp(eventTimestamp)}</h6>
        <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-6 lg:mb-12">
          {name}
        </h1>
        <div className="flex flex-wrap-reverse lg:flex-nowrap">
          <div className="w-full pr-0 lg:pr-24 xl:pr-32">
            <div className="mb-8 w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              {imageURL && (
                <Image src={imageURL} alt="event image" layout="fill" />
              )}
            </div>
            <p>{description}</p>
          </div>
          <div className="max-w-xs w-full flex flex-col gap-4 mb-6 lg:mb-0">
            <RSVP event={event} createNewRSVP={createNewRSVP} />
            <div className="flex item-center">
              <UsersIcon className="w-6 mr-2" />
              <span className="truncate">
                {totalRSVPs}/{maxCapacity} attending
              </span>
            </div>
            <div className="flex item-center">
              <TicketIcon className="w-6 mr-2" />
              <span className="truncate">1 RSVP per wallet</span>
            </div>
            <div className="flex items-center">
              <EmojiHappyIcon className="w-10 mr-2" />
              <span className="truncate">
                Hosted by{" "}
                <a
                  className="text-indigo-800 truncate hover:underline"
                  href={`${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}address/${eventOwner}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {eventOwner}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Get the event ID from the page url
  const { id } = context.params;

  // Fetch details for the event
  const { data } = await client.query({
    query: GET_EVENTS,
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
