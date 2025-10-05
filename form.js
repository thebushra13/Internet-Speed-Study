const form = document.getElementById('speed-form');
const locationInput = document.getElementById('location');
const timeInput = document.getElementById('time-of-day');
const downloadInput = document.getElementById('download-speed');
const uploadInput = document.getElementById('upload-speed');
const ispInput = document.getElementById('isp');
const notesInput = document.getElementById('notes');

// Speed meter indicators (the two divs under download & upload inputs)
const speedMeters = document.querySelectorAll('.speed-meter');
const downloadSpeedIndicator = speedMeters[0].querySelector('.speed-indicator');
const uploadSpeedIndicator = speedMeters[1].querySelector('.speed-indicator');

function updateSpeedIndicator(speed, indicator) {
  // Assume max speed 100 Mbps for visualization; clamp to 100%
  const cappedSpeed = Math.min(speed, 100);
  const percent = (cappedSpeed / 100) * 100;
  indicator.style.left = `${percent}%`;
}

downloadInput.addEventListener('input', () => {
  const val = parseFloat(downloadInput.value);
  if (!isNaN(val)) {
    updateSpeedIndicator(val, downloadSpeedIndicator);
  } else {
    downloadSpeedIndicator.style.left = '0%';
  }
});

uploadInput.addEventListener('input', () => {
  const val = parseFloat(uploadInput.value);
  if (!isNaN(val)) {
    updateSpeedIndicator(val, uploadSpeedIndicator);
  } else {
    uploadSpeedIndicator.style.left = '0%';
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const entry = {
    id: Date.now(),
    location: locationInput.value,
    timeOfDay: timeInput.value,
    download: parseFloat(downloadInput.value),
    upload: parseFloat(uploadInput.value),
    isp: ispInput.value.trim(),
    notes: notesInput.value.trim(),
  };

  if (
    !entry.location ||
    !entry.timeOfDay ||
    isNaN(entry.download) ||
    isNaN(entry.upload) ||
    !entry.isp
  ) {
    alert('Please fill all required fields correctly.');
    return;
  }

  // Get existing data from localStorage or initialize
  let data = JSON.parse(localStorage.getItem('speedTestData')) || [];
  data.push(entry);
  localStorage.setItem('speedTestData', JSON.stringify(data));

  // Reset form and indicators
  form.reset();
  downloadSpeedIndicator.style.left = '0%';
  uploadSpeedIndicator.style.left = '0%';

  // Trigger UI update events
  window.dispatchEvent(new CustomEvent('dataUpdated'));
});