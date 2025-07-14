document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '5c4e560622e3fea9b550f65c9585945b'; // Замените на ваш API ключ от OpenWeatherMap
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    
    searchBtn.addEventListener('click', searchWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
    
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
        
        // Установка иконки погоды
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
    }
    
    // Загрузка погоды по умолчанию (например, Москва)
    cityInput.value = 'Москва';
    searchWeather();
});