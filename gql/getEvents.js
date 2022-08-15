import { gql } from "@apollo/client";

const GET_EVENTS = gql`
  query Event($id: String!) {
    event(id: $id) {
      id
      eventID
      name
      description
      link
      eventOwner
      eventTimestamp
      maxCapacity
      deposit
      totalRSVPs
      totalConfirmedAttendees
      imageURL
      rsvps {
        id
        attendee {
          id
        }
      }
    }
  }
`;

export default GET_EVENTS;
