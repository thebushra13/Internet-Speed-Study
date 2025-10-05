let locationChart, timeChart, ispChart;

function aggregateData(data) {
  // Aggregate average download and upload speeds by location, time, ISP
  const byLocation = {};
  const byTime = {};
  const byISP = {};

  const locationsSet = new Set();

  data.forEach(({ location, timeOfDay, download, upload, isp }) => {
    locationsSet.add(location);

    if (!byLocation[location]) {
      byLocation[location] = { downloadSum: 0, uploadSum: 0, count: 0 };
    }
    byLocation[location].downloadSum += download;
    byLocation[location].uploadSum += upload;
    byLocation[location].count++;

    if (!byTime[timeOfDay]) {
      byTime[timeOfDay] = { downloadSum: 0, uploadSum: 0, count: 0 };
    }
    byTime[timeOfDay].downloadSum += download;
    byTime[timeOfDay].uploadSum += upload;
    byTime[timeOfDay].count++;

    if (!byISP[isp]) {
      byISP[isp] = { downloadSum: 0, uploadSum: 0, count: 0 };
    }
    byISP[isp].downloadSum += download;
    byISP[isp].uploadSum += upload;
    byISP[isp].count++;
  });

  return { byLocation, byTime, byISP, locationsSet };
}

function createBarChart(ctx, labels, datasets, title) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 18, weight: 'bold' },
        },
        legend: { position: 'top' },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Speed (Mbps)' },
        },
      },
    },
  });
}

function updateCharts(data) {
  const { byLocation, byTime, byISP, locationsSet } = aggregateData(data);

  // Destroy existing charts if exist
  if (locationChart) locationChart.destroy();
  if (timeChart) timeChart.destroy();
  if (ispChart) ispChart.destroy();

  // Location Chart
  const locLabels = Object.keys(byLocation);
  const locDownload = locLabels.map((loc) =>
    byLocation[loc].downloadSum / byLocation[loc].count
  );
  const locUpload = locLabels.map((loc) =>
    byLocation[loc].uploadSum / byLocation[loc].count
  );

  const locCtx = document.getElementById('location-chart').getContext('2d');
  locationChart = createBarChart(
    locCtx,
    locLabels,
    [
      {
        label: 'Download',
        data: locDownload,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
      },
      {
        label: 'Upload',
        data: locUpload,
        backgroundColor: 'rgba(147, 51, 234, 0.7)', // purple
      },
    ],
    'Speed by Location'
  );

  // Time of Day Chart
  const timeLabels = Object.keys(byTime);
  const timeDownload = timeLabels.map((time) =>
    byTime[time].downloadSum / byTime[time].count
  );
  const timeUpload = timeLabels.map((time) =>
    byTime[time].uploadSum / byTime[time].count
  );

  const timeCtx = document.getElementById('time-chart').getContext('2d');
  timeChart = createBarChart(
    timeCtx,
    timeLabels,
    [
      {
        label: 'Download',
        data: timeDownload,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
      },
      {
        label: 'Upload',
        data: timeUpload,
        backgroundColor: 'rgba(147, 51, 234, 0.7)', // purple
      },
    ],
    'Speed by Time of Day'
  );

  // ISP Chart
  const ispLabels = Object.keys(byISP);
  const ispDownload = ispLabels.map((isp) =>
    byISP[isp].downloadSum / byISP[isp].count
  );
  const ispUpload = ispLabels.map((isp) =>
    byISP[isp].uploadSum / byISP[isp].count
  );

  const ispCtx = document.getElementById('isp-chart').getContext('2d');
  ispChart = createBarChart(
    ispCtx,
    ispLabels,
    [
      {
        label: 'Download',
        data: ispDownload,
        backgroundColor: 'rgba(59, 130, 246, 0.7)', // blue
      },
      {
        label: 'Upload',
        data: ispUpload,
        backgroundColor: 'rgba(147, 51, 234, 0.7)', // purple
      },
    ],
    'ISP Comparison'
  );

  // Update stats overview
  document.getElementById('total-tests').textContent = data.length;
  const avgDownload =
    data.reduce((sum, d) => sum + d.download, 0) / (data.length || 1);
  const avgUpload = data.reduce((sum, d) => sum + d.upload, 0) / (data.length || 1);
  document.getElementById('avg-download').textContent = `${avgDownload.toFixed(2)} Mbps`;
  document.getElementById('avg-upload').textContent = `${avgUpload.toFixed(2)} Mbps`;
  document.getElementById('locations-count').textContent = locationsSet.size;
}

// Initial update on page load
window.addEventListener('load', () => {
  const data = JSON.parse(localStorage.getItem('speedTestData')) || [];
  updateCharts(data);
});

// Listen for data updates
window.addEventListener('dataUpdated', () => {
  const data = JSON.parse(localStorage.getItem('speedTestData')) || [];
  updateCharts(data);
});
