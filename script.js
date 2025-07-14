document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '5c4e560622e3fea9b550f65c9585945b';
    const searchBtn = document.getElementById('search-btn');
    const locationBtn = document.getElementById('location-btn');
    const cityInput = document.getElementById('city-input');
    const autocompleteItems = document.getElementById('autocomplete-items');
    
    // Популярные города России
    const russianCities = [
        "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
        "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
        "Уфа", "Красноярск", "Пермь", "Воронеж", "Волгоград",
        "Краснодар", "Саратов", "Тюмень", "Тольятти", "Ижевск"
    ];
    
    // Инициализация
    init();
    
    function init() {
        // Проверяем геолокацию
        if (navigator.geolocation) {
            getLocation();
        } else {
            // Если геолокация недоступна, загружаем Москву по умолчанию
            cityInput.value = 'Москва';
            searchWeather();
        }
        
        // Настройка обработчиков событий
        setupEventListeners();
    }
    
    function setupEventListeners() {
        searchBtn.addEventListener('click', searchWeather);
        locationBtn.addEventListener('click', getLocation);
        
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchWeather();
            }
        });
        
        cityInput.addEventListener('input', function() {
            const input = cityInput.value.trim();
            autocompleteItems.innerHTML = '';
            
            if (input.length > 0) {
                const filteredCities = russianCities.filter(city => 
                    city.toLowerCase().includes(input.toLowerCase())
                );
                
                filteredCities.forEach(city => {
                    const item = document.createElement('div');
                    item.textContent = city;
                    item.addEventListener('click', function() {
                        cityInput.value = city;
                        autocompleteItems.innerHTML = '';
                        searchWeather();
                    });
                    autocompleteItems.appendChild(item);
                });
            }
        });
        
        // Скрываем автодополнение при клике вне поля
        document.addEventListener('click', function(e) {
            if (e.target !== cityInput) {
                autocompleteItems.innerHTML = '';
            }
        });
    }
    
    function getLocation() {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=ru`)
                    .then(response => response.json())
                    .then(data => {
                        cityInput.value = data.name;
                        displayWeather(data);
                    })
                    .catch(error => {
                        console.error('Ошибка получения погоды по геолокации:', error);
                        cityInput.value = 'Москва';
                        searchWeather();
                    });
            },
            error => {
                console.error('Ошибка геолокации:', error);
                cityInput.value = 'Москва';
                searchWeather();
            }
        );
    }
    
    function searchWeather() {
        const city = cityInput.value.trim();
        if (city === '') return;
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=ru`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Город не найден');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                alert(error.message);
                console.error('Ошибка:', error);
            });
    }
    
    function displayWeather(data) {
        const cityName = document.getElementById('city-name');
        const temperature = document.getElementById('temperature');
        const weatherDesc = document.getElementById('weather-description');
        const humidity = document.getElementById('humidity');
        const wind = document.getElementById('wind');
        const pressure = document.getElementById('pressure');
        const weatherIcon = document.getElementById('weather-icon');
        
        cityName.textContent = data.name;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDesc.textContent = data.weather[0].description;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} м/с`;
        pressure.textContent = `${data.main.pressure} hPa`;
        
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
        weatherIcon.style.display = 'block';
    }
});
