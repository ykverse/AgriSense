document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    initWeather();
    initGraph();
    startClock();
});

/* --- Clock --- */
function startClock() {
    const clockEl = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true };
        // Output example: "Friday, 12:00 PM"
        clockEl.textContent = now.toLocaleString('en-US', options).replace(',', '');
    }, 1000);
}

/* --- Calendar --- */
function initCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    let currentDate = new Date();

    function renderCalendar(date) {
        calendarDays.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();

        // Month Names
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        currentMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Headers (M T W T F S S)
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        days.forEach(day => {
            const div = document.createElement('div');
            div.classList.add('calendar-day-header');
            div.textContent = day;
            calendarDays.appendChild(div);
        });

        // First day of month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            calendarDays.appendChild(document.createElement('div'));
        }

        // Days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day');
            div.textContent = i;
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                div.classList.add('active');
            }
            calendarDays.appendChild(div);
        }
    }

    renderCalendar(currentDate);

    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
}

/* --- Weather --- */
function initWeather() {
    const districtSelect = document.getElementById('district-select');
    const districts = [
        "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
        "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
        "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
    ];

    districts.forEach(d => {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = d;
        districtSelect.appendChild(option);
    });

    // Mock weather fetch or Open-Meteo
    districtSelect.addEventListener('change', async (e) => {
        const district = e.target.value;
        await fetchWeather(district);
    });

    // Initial weather for a default location
    fetchWeather("Wayanad");
}

async function fetchWeather(location) {
    // Geocoding to get lat/long (Mocking coordinates for demo simplicity, or using a simple mapping)
    // For a real app, use Geocoding API. Here I'll use a simple map for Kerala districts.
    const coords = {
        "Thiruvananthapuram": { lat: 8.5241, lon: 76.9366 },
        "Kollam": { lat: 8.8932, lon: 76.6141 },
        "Pathanamthitta": { lat: 9.2648, lon: 76.7870 },
        "Alappuzha": { lat: 9.4981, lon: 76.3388 },
        "Kottayam": { lat: 9.5916, lon: 76.5222 },

        // Central Districts
        "Idukki": { lat: 9.8538, lon: 76.9481 }, // Coordinates for Painavu (HQ)
        "Ernakulam": { lat: 9.9816, lon: 76.2999 },
        "Thrissur": { lat: 10.5276, lon: 76.2144 },
        "Palakkad": { lat: 10.7867, lon: 76.6548 },

        // Northern Districts
        "Malappuram": { lat: 11.0510, lon: 76.0711 },
        "Kozhikode": { lat: 11.2588, lon: 75.7804 },
        "Wayanad": { lat: 11.6103, lon: 76.0830 }, // Coordinates for Kalpetta (HQ)
        "Kannur": { lat: 11.8745, lon: 75.3704 },
        "Kasaragod": { lat: 12.5102, lon: 74.9852 },

        // Fallback
        "default": { lat: 10.8505, lon: 76.2711 }
    };

    const coord = coords[location] || coords["default"];

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&current_weather=true`);
        const data = await response.json();

        if (data.current_weather) {
            document.querySelector('.temp-display').textContent = `${Math.round(data.current_weather.temperature)}°C`;
            document.querySelector('.weather-details span:nth-child(1)').innerHTML = `<i class="fa-solid fa-wind"></i> ${data.current_weather.windspeed} km/h`;
            // Open-Meteo basic free doesn't give humidity in current_weather easily without more params, mocking humidity for now or adding hourly param
            document.querySelector('.weather-details span:nth-child(2)').innerHTML = `<i class="fa-solid fa-droplet"></i> 70%`;
        }
    } catch (error) {
        console.error("Weather fetch failed", error);
    }
}

/* --- Graph --- */
async function initGraph() {
    // Parse CSV
    // Since we can't easily read local file system in browser JS without input element, 
    // I will embed the parsed data structure directly here based on the CSV provided by the user content.
    // In a real server app, this would be an API call.

    // Data extracted from user's CSV: Yearly Averages
    const years = [2020, 2021, 2022, 2023, 2024, 2025];

    // Calculated yearly averages from the provided datasets
    const dataBanana = [2205.45, 2150.94, 3644.56, 2970.76, 3228.69, 2980.33];
    const dataCoffee = [10372.35, 9355.00, 11779.37, 16594.23, 20056.89, 23974.34];
    const dataGinger = [3524.70, 1841.93, 1888.48, 7096.81, 7498.07, 2838.70];
    const dataPepper = [31392.29, 40587.85, 49396.31, 53968.44, 61444.30, 65574.78];
    const dataTapioca = [1587.50, 1265.75, 2745.70, 9009.85, 2600.00, 2400.00];


    const ctx = document.getElementById('priceChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Banana (Yellow)',
                    data: dataBanana,
                    borderColor: '#f4d35e',
                    backgroundColor: '#f4d35e',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Ginger (Green)',
                    data: dataGinger,
                    borderColor: '#21b93f',
                    backgroundColor: '#21b93f',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Coffee (orange)',
                    data: dataCoffee,
                    borderColor: '#f69b3a',
                    backgroundColor: '#f69b3a',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Pepper (Violet)', // Mapped from Tapioca
                    data: dataPepper,
                    borderColor: '#8c79ee',
                    backgroundColor: '#8c79ee',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Tapioca (blue)', // Mapped from Tapioca
                    data: dataTapioca,
                    borderColor: '#79eeec',
                    backgroundColor: '#79eeec',
                    tension: 0.4,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#f0f0f0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/* =========================================
   Frontend Prediction Integration
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.querySelector('.btn-run.full-width');
    const modal = document.getElementById('predictionModal');
    const modalLoading = document.getElementById('modalLoading');
    const modalResult = document.getElementById('modalResult');
    const btnClose = document.getElementById('closeModal');
    const btnAcknowledge = document.getElementById('btnAcknowledge');

    // Result DOM Nodes
    const resCropName = document.getElementById('resultCropName');
    const resSuitability = document.getElementById('resultSuitability');
    const resMarketPercent = document.getElementById('resultMarketPercent');
    const trendIndicator = document.getElementById('trendIndicator');
    const trendIcon = document.getElementById('trendIcon');

    // DOM Elements for New Redesign
    const resultCropImage = document.getElementById('resultCropImage');
    const resultDescription = document.getElementById('resultDescription');
    const runnerUpList = document.getElementById('runnerUpList');
    const sortToggle = document.getElementById('sortToggle');
    const labelSoil = document.getElementById('labelSoil');
    const labelMarket = document.getElementById('labelMarket');

    // Input Fields
    const inputNodes = document.querySelectorAll('.input-group input');

    function closeModal() {
        modal.classList.add('hidden');
        setTimeout(() => {
            modalLoading.classList.remove('hidden');
            modalResult.classList.add('hidden');
        }, 300); // Wait for transition
    }

    btnClose.addEventListener('click', closeModal);
    btnAcknowledge.addEventListener('click', closeModal);

    let currentPredictionData = [];

    // Crop Information Dictionary mapping names to images and descriptions
    const CROP_INFO = {
        "pepper": { img: "images/pepper.png", desc: "A perennial climbing vine valued for its spice. Thrives in humid, tropical climates with high annual rainfall." },
        "coffee": { img: "images/coffee.png", desc: "A major plantation crop primarily comprising Robusta and Arabica varieties. Requires elevation between 700m–1200m." },
        "banana": { img: "images/banana.png", desc: "A fast-growing herbaceous plant. Requires deep, well-drained loamy soil and significant water intake." },
        "ginger": { img: "images/ginger.png", desc: "A herbaceous perennial grown for its edible rhizome. Prefers well-drained sandy or lateritic loam." },
        "tapioca": { img: "images/tapioca.png", desc: "A hardy tuberous root crop. Extremely resilient and drought-tolerant; thrives in laterite soils." }
    };

    /**
     * Renders the Results Modal with the current array of data
     * @param {Array} data - The prediction array from the backend
     * @param {Boolean} sortByMarket - If true, sorts by final_score, else suitability
     */
    function renderResults(data, sortByMarket) {
        // 1. Sort Data locally based on toggle state
        const sortedData = [...data].sort((a, b) => {
            if (sortByMarket) {
                return b.final_score - a.final_score;
            } else {
                return b.suitability - a.suitability;
            }
        });

        // 2. Render Primary Component (Rank #1)
        const topCrop = sortedData[0];
        const cropKey = topCrop.crop.toLowerCase();

        resCropName.textContent = topCrop.crop.charAt(0).toUpperCase() + topCrop.crop.slice(1);

        if (sortByMarket) {
            resSuitability.innerHTML = `${topCrop.final_score} <span style="font-size:12px; font-weight:normal;">Score</span>`;
        } else {
            resSuitability.textContent = `${topCrop.suitability}% Match`;
        }

        resMarketPercent.textContent = topCrop.market_percent + '%';

        // Setup Image & Description
        if (CROP_INFO[cropKey]) {
            resultCropImage.src = CROP_INFO[cropKey].img;
            resultDescription.textContent = CROP_INFO[cropKey].desc;
        } else {
            resultCropImage.src = "images/tapioca.png"; // Fallback
            resultDescription.textContent = "Recommended strictly based on machine learning probability distributions.";
        }

        // Setup Trend Indicators for Primary Top Crop
        trendIcon.className = 'fa-solid';
        trendIndicator.className = 'trend-indicator-small'; // Updated CSS clss
        if (topCrop.market_direction === 'UP') {
            trendIcon.classList.add('fa-arrow-up');
            trendIndicator.classList.add('trend-up');
        } else if (topCrop.market_direction === 'DOWN') {
            trendIcon.classList.add('fa-arrow-down');
            trendIndicator.classList.add('trend-down');
        } else {
            trendIcon.classList.add('fa-minus');
            trendIndicator.classList.add('trend-stable');
        }

        // 3. Render Runner-Up List (Rank #2 to #5)
        runnerUpList.innerHTML = ''; // Clear existing
        const runnerUps = sortedData.slice(1, 5); // Take next 4

        runnerUps.forEach(crop => {
            const li = document.createElement('li');
            li.classList.add('runner-item');

            const nameDiv = document.createElement('div');
            nameDiv.className = 'runner-name';
            nameDiv.textContent = crop.crop.charAt(0).toUpperCase() + crop.crop.slice(1);

            const statsDiv = document.createElement('div');
            statsDiv.className = 'runner-stats';

            const suitSpan = document.createElement('span');
            suitSpan.className = 'runner-suitability';

            if (sortByMarket) {
                suitSpan.innerHTML = `<span style="color:#f69b3a; font-weight:bold;">${crop.final_score}</span> <span style="font-size: 11px;">Score</span>`;
            } else {
                suitSpan.textContent = `${crop.suitability}% Match`;
            }

            const trendDiv = document.createElement('div');
            trendDiv.className = 'trend-indicator-small';

            let iconHtml = '';
            if (crop.market_direction === 'UP') {
                trendDiv.classList.add('trend-up');
                iconHtml = '<i class="fa-solid fa-arrow-up"></i>';
            } else if (crop.market_direction === 'DOWN') {
                trendDiv.classList.add('trend-down');
                iconHtml = '<i class="fa-solid fa-arrow-down"></i>';
            } else {
                trendDiv.classList.add('trend-stable');
                iconHtml = '<i class="fa-solid fa-minus"></i>';
            }
            trendDiv.innerHTML = `${iconHtml} <span>${crop.market_percent}%</span>`;

            statsDiv.appendChild(suitSpan);
            statsDiv.appendChild(trendDiv);

            li.appendChild(nameDiv);
            li.appendChild(statsDiv);
            runnerUpList.appendChild(li);
        });
    }

    // Toggle Listener
    sortToggle.addEventListener('change', (e) => {
        const sortByMarket = e.target.checked;

        // Highlight correct label text
        if (sortByMarket) {
            labelMarket.classList.add('active');
            labelSoil.classList.remove('active');
        } else {
            labelSoil.classList.add('active');
            labelMarket.classList.remove('active');
        }

        // Instantly Re-render 
        if (currentPredictionData.length > 0) {
            renderResults(currentPredictionData, sortByMarket);
        }
    });

    runBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Reset toggle to default mode on new run
        sortToggle.checked = false;
        labelSoil.classList.add('active');
        labelMarket.classList.remove('active');

        // 1. Collect Input Data
        const payload = {
            N: inputNodes[0].value || 0,
            P: inputNodes[1].value || 0,
            K: inputNodes[2].value || 0,
            temperature: inputNodes[3].value || 0,
            humidity: inputNodes[4].value || 0,
            ph: inputNodes[5].value || 0,
            rainfall: inputNodes[6].value || 0
        };

        // 2. Show Loading Modal Setup
        modalResult.classList.add('hidden');
        modalLoading.classList.remove('hidden');
        modal.classList.remove('hidden');

        try {
            // Fetch default inference logic from server
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Prediction failed');
            }

            const data = await response.json();

            // Retain globally to allow toggle sorting without re-fetching
            currentPredictionData = data;

            // Execute render state
            renderResults(currentPredictionData, sortToggle.checked);

            // Hide Loading, Show Result
            setTimeout(() => {
                modalLoading.classList.add('hidden');
                modalResult.classList.remove('hidden');
            }, 800);

        } catch (error) {
            console.error('Error in prediction API:', error);

            // Show Error Modal State instead of alert()
            setTimeout(() => {
                modalLoading.classList.add('hidden');
                modalResult.classList.add('hidden');

                // Show Error layout
                const modalError = document.getElementById('modalError');
                const errorDescription = document.getElementById('errorDescription');

                errorDescription.textContent = error.message;
                modalError.classList.remove('hidden');
            }, 500); // Slight delay for smoother transition
        }
    });

    // Handle closing from the new Error state
    const btnCloseError = document.getElementById('closeErrorModal');
    const btnAckError = document.getElementById('btnAcknowledgeError');

    // Ensure nodes exist before binding to prevent errors on older layouts
    if (btnCloseError) {
        btnCloseError.addEventListener('click', () => {
            modal.classList.add('hidden');
            setTimeout(() => {
                document.getElementById('modalError').classList.add('hidden');
                modalLoading.classList.remove('hidden'); // Reset for next run
            }, 300);
        });
    }

    if (btnAckError) {
        btnAckError.addEventListener('click', () => {
            modal.classList.add('hidden');
            setTimeout(() => {
                document.getElementById('modalError').classList.add('hidden');
                modalLoading.classList.remove('hidden'); // Reset for next run
            }, 300);
        });
    }

});
