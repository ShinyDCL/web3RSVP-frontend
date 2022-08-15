import { gql } from "@apollo/client";

const UPCOMING_EVENTS = gql`
  query Events($currentTimestamp: String) {
    events(where: { eventTimestamp_gt: $currentTimestamp }) {
      id
      name
      eventTimestamp
      imageURL
    }
  }
`;

export default UPCOMING_EVENTS;
