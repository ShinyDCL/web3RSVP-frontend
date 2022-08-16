import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LinkIcon } from "@heroicons/react/outline";

export default function RSVP({ event, createNewRSVP }) {
  const [currentTimestamp, setEventTimestamp] = useState(
    new Date().getTime().toString()
  );
  const [mounted, setMounted] = useState(false);
  const { data: account } = useAccount();

  const { eventTimestamp, link, deposit, rsvps } = event;

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkIfAlreadyRSVPed = () => {
    if (!account) return false;

    const thisAccount = account.address.toLowerCase();
    console.log(rsvps);
    return !!rsvps.find(
      ({ attendee }) => attendee.id.toLowerCase() === thisAccount
    );
  };

  if (!mounted) return null;

  return eventTimestamp > currentTimestamp ? (
    account ? (
      checkIfAlreadyRSVPed() ? (
        <>
          <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full text-teal-800 bg-teal-100">
            You have RSVPed! 🙌
          </span>
          <div className="flex item-center">
            <LinkIcon className="w-6 mr-2 text-indigo-800" />
            <a className="text-indigo-800 truncate hover:underline" href={link}>
              {link}
            </a>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="w-full items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={createNewRSVP}
        >
          RSVP for {ethers.utils.formatEther(deposit)} MATIC
        </button>
      )
    ) : (
      <ConnectButton />
    )
  ) : (
    <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full border-2 border-gray-200">
      Event has ended
    </span>
  );
}
