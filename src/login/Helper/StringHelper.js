const checkStringMessage = (message) => {
  if (message === "jwt malformed")
    return "Device token expired"

  return message;
}

const convertDateToString = function (date) {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '-' + mm + '-' + yyyy;
}
module.exports = { convertDateToString, checkStringMessage };