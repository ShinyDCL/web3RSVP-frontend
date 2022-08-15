import Alert from "./Alert";

export default function Alerts({ loading, success, message }) {
  return (
    <>
      {loading && (
        <Alert
          alertType={"loading"}
          alertBody={"Please wait"}
          triggerAlert={true}
          color={"white"}
        />
      )}
      {success && (
        <Alert
          alertType={"success"}
          alertBody={message}
          triggerAlert={true}
          color={"palegreen"}
        />
      )}
      {success === false && (
        <Alert
          alertType={"failed"}
          alertBody={message}
          triggerAlert={true}
          color={"palevioletred"}
        />
      )}
    </>
  );
}
