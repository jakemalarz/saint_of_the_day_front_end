const SAINTS_WEBSERVICE = "http://localhost:3000";
const SAINTS_WEBSERVICE_GET_DAY_INFO = "get-day-info";

document.addEventListener('DOMContentLoaded', () => {
  // Get today's date in MM-DD-YYYY format
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  const formattedDate = `${mm}-${dd}-${yyyy}`;
  const restEndpoint = SAINTS_WEBSERVICE;
  fetch(`${restEndpoint}/${SAINTS_WEBSERVICE_GET_DAY_INFO}?date=${formattedDate}`)
    .then(response => response.json())
    .then(data => {
      const subHeader = document.getElementById('sub-header');
      if (subHeader && data.day_title && data.date) {
        subHeader.textContent = `${data.day_title} – ${data.date}`;
      }
      const bioDiv = document.getElementById('bio');
      if (bioDiv && data.day_description) {
        bioDiv.textContent = data.day_description;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
