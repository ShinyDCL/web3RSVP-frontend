export default function AttendeeTable({
  event,
  confirmAttendee,
  confirmAllAttendees,
}) {
  function checkIfConfirmed(address) {
    return !!event.confirmedAttendees.find(
      ({ attendee }) => attendee.id.toLowerCase() === address.toLowerCase()
    );
  }

  return (
    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
      {event.rsvps?.length ? (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Attendee
                </th>
                <th scope="col" className="text-right py-3.5 pl-3 pr-4 sm:pr-6">
                  <button
                    type="button"
                    className="items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={confirmAllAttendees}
                  >
                    Confirm All
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {event.rsvps.map(({ attendee }) => (
                <tr key={attendee.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {attendee.id}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    {checkIfConfirmed(attendee.id) ? (
                      <p>Confirmed</p>
                    ) : (
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => confirmAttendee(attendee.id)}
                      >
                        Confirm attendee
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No attendees</p>
      )}
    </div>
  );
}
