document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '5c4e560622e3fea9b550f65c9585945b';
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const autocompleteItems = document.getElementById('autocomplete-items');

    // Популярные города России с регионами (для лучшего автодополнения)
    const russianCities = [
        "Москва, Россия",
        "Санкт-Петербург, Россия",
        "Новосибирск, Россия",
        "Екатеринбург, Россия",
        "Казань, Россия",
        "Нижний Новгород, Россия",
        "Челябинск, Россия",
        "Самара, Россия",
        "Омск, Россия",
        "Ростов-на-Дону, Россия",
        "Уфа, Россия",
        "Красноярск, Россия",
        "Пермь, Россия",
        "Воронеж, Россия",
        "Волгоград, Россия",
        "Краснодар, Россия",
        "Саратов, Россия",
        "Тюмень, Россия",
        "Тольятти, Россия",
        "Ижевск, Россия"
    ];

    // Инициализация приложения
    init();

    function init() {
        // Запрашиваем геолокацию сразу при загрузке
        getLocationByGeolocation();
        
        // Настройка обработчиков событий
        setupEventListeners();
    }

    function setupEventListeners() {
        searchBtn.addEventListener('click', searchWeather);
        
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchWeather();
            }
        });
        
        cityInput.addEventListener('input', function() {
            const input = cityInput.value.trim().toLowerCase();
            autocompleteItems.innerHTML = '';
            
            if (input.length > 0) {
                const filteredCities = russianCities.filter(city => 
                    city.toLowerCase().includes(input)
                );
                
                // Показываем только 5 наиболее релевантных вариантов
                filteredCities.slice(0, 5).forEach(city => {
                    const item = document.createElement('div');
                    
                    // Выделяем совпадающую часть текста
                    const matchStart = city.toLowerCase().indexOf(input);
                    const matchEnd = matchStart + input.length;
                    
                    item.innerHTML = city.substring(0, matchStart) + 
                                    '<strong>' + city.substring(matchStart, matchEnd) + '</strong>' + 
                                    city.substring(matchEnd);
                    
                    item.addEventListener('click', function() {
                        cityInput.value = city.split(',')[0].trim(); // Берем только название города
                        autocompleteItems.innerHTML = '';
                        searchWeather();
                    });
                    
                    autocompleteItems.appendChild(item);
                });
                
                if (filteredCities.length > 0) {
                    autocompleteItems.style.display = 'block';
                }
            } else {
                autocompleteItems.style.display = 'none';
            }
        });
        
        // Скрываем автодополнение при клике вне поля
        document.addEventListener('click', function(e) {
            if (e.target !== cityInput) {
                autocompleteItems.style.display = 'none';
            }
        });
    }

    function getLocationByGeolocation() {
        if (!navigator.geolocation) {
            setDefaultCity();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Сначала получаем название города по координатам
                fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(locationData => {
                        if (locationData && locationData.length > 0) {
                            const city = locationData[0].name;
                            cityInput.value = city;
                            searchWeather();
                        } else {
                            setDefaultCity();
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка получения города:', error);
                        setDefaultCity();
                    });
            },
            error => {
                console.error('Ошибка геолокации:', error);
                setDefaultCity();
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    function setDefaultCity() {
        cityInput.value = 'Москва';
        searchWeather();
    }

    function searchWeather() {
        const city = cityInput.value.trim();
        if (city === '') return;
        
        // Показываем состояние загрузки
        document.getElementById('city-name').textContent = `Загружаем данные для ${city}...`;
        document.getElementById('weather-description').textContent = 'Пожалуйста, подождите...';
        
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
                document.getElementById('city-name').textContent = 'Ошибка загрузки';
                document.getElementById('weather-description').textContent = error.message;
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
