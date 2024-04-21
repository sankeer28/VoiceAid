window.onload = function() {
    alert("Do not discuss any personal information or upload classified documents. The AI is actively being trained through conversations");
  }
function isChromiumBased() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("chrome") || userAgent.includes("chromium") || userAgent.includes("edge");
}

function showAlertIfNotChromium() {
  if (!isChromiumBased()) {
      alert("This website is optimized for Chromium-based browsers. Not all features may work. Please use a Chromium-based browser for the best experience.");
  }
}

window.addEventListener('DOMContentLoaded', showAlertIfNotChromium);

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleIcon = document.querySelector('#themeToggle i');
  
    body.classList.toggle('dark-theme');
  
    if (body.classList.contains('dark-theme')) {
      themeToggleIcon.className = 'fa fa-sun';
      themeToggle.style.backgroundColor = '#1d1d1d#bcc2c6'; 
    } else {
      themeToggleIcon.className = 'fa fa-moon';
      themeToggle.style.backgroundColor = '1d1d1d'; r
    }
  }