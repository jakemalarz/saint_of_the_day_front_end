const SAINTS_WEBSERVICE = "https://api.jakemalarz.com";

document.addEventListener('DOMContentLoaded', () => {
  // Get today's date in MM-DD-YYYY format
  const today = new Date();
  const clientDate = today.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
  const [m, d, yyyy] = clientDate.split("/");
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  const formattedDate = `${mm}-${dd}-${yyyy}`;
  const restEndpoint = SAINTS_WEBSERVICE;
  fetch(`${restEndpoint}?date=${formattedDate}`)
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
