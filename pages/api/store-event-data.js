import { Web3Storage, File, getFilesFromPath } from "web3.storage";
const { resolve } = require("path");

// Handle the incoming requests
export default async function handler(req, res) {
  if (req.method === "POST") {
    return await storeEventData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

// Gets the event data from the request body and stores the data, returns an error if unsuccessful.
// Upon successful storage, returns the cid that points to an IPFS directory of the file just stored
async function storeEventData(req, res) {
  const body = req.body;
  try {
    // Creates a json file that includes metadata passed from the req.body object
    const files = await makeFileObjects(body);

    // Stores the json file to Web3.storage and returns a content identifier (CID)
    const cid = await storeFiles(files);

    return res.status(200).json({ success: true, cid: cid });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error creating event", success: false });
  }
}

async function makeFileObjects(body) {
  const buffer = Buffer.from(JSON.stringify(body));

  const imageDirectory = resolve(process.cwd(), `public/images/${body.image}`);
  const files = await getFilesFromPath(imageDirectory);

  files.push(new File([buffer], "data.json"));
  return files;
}

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
}

async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  return cid;
}
