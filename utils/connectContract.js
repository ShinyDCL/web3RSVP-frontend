import abiJSON from "./Web3RSVP.json";
import { ethers } from "ethers";

function connectContract() {
  // Web3RSVP contract address
  const contractAddress = "0x74224C99690CFC685e315282B8E1D8227feBD6a4";
  const contractABI = abiJSON.abi;
  let rsvpContract;
  try {
    const { ethereum } = window;

    // Checks for eth object in the window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      rsvpContract = new ethers.Contract(contractAddress, contractABI, signer); // Instantiating new connection to the contract
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return rsvpContract;
}

export default connectContract;
