/**
 * Helper to convert a timestamp or Date into DD-MM-YYYY format
 * @param {number|string|Date} dateInput
 * @returns {string}
 */
const convertDateToString = function (dateInput) {
  if (!dateInput) {
    dateInput = new Date();
  }
  const dateObj = new Date(dateInput);
  if (isNaN(dateObj.getTime())) {
    return String(dateInput);
  }

  const yyyy = dateObj.getFullYear();
  let mm = dateObj.getMonth() + 1;
  let dd = dateObj.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '-' + mm + '-' + yyyy;
};

const checkStringMessage = (message) => {
  if (!message) return "An unexpected error occurred";
  if (message === "jwt malformed" || message.includes("invalid token")) {
    return "Device token expired or invalid";
  }
  return message;
};

module.exports = {
  convertDateToString,
  checkStringMessage
};
