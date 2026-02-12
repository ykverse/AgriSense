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
