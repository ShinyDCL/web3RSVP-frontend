import { gql } from "@apollo/client";

const GET_EVENT_WITH_ATTENDEES = gql`
  query Event($id: String!) {
    event(id: $id) {
      id
      eventID
      name
      eventOwner
      eventTimestamp
      maxCapacity
      totalRSVPs
      totalConfirmedAttendees
      rsvps {
        id
        attendee {
          id
        }
      }
      confirmedAttendees {
        attendee {
          id
        }
      }
    }
  }
`;

export default GET_EVENT_WITH_ATTENDEES;
