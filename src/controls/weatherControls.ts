import settingsMenu from "./settingsMenu";
import { WeatherWidget } from "../widgets/widgets";

const defaultWeatherTimeout = 1_000 * 60 * 15;

interface OpenWeatherMapData {
    weather: OpenWeatherMapWeather[];
    main: {
        temp: number;
        pressure: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
    };
    base: string;
    name: string;
}

interface weatherDataSave extends OpenWeatherMapData {
    retrievedAt: number;
}

interface OpenWeatherMapWeather {
    id: string;
    main: string;
    description: string;
}

// Retrieves the past information on weather from the local storage
let knownWeather: {
    [city: string]: weatherDataSave;
} = JSON.parse(window.localStorage.getItem("weatherInfo") || "{}");

// Dictionary of weather type to emoji
let weatherEmoji: {
    [weatherType: string]: string;
} = {
    "Mist": "🌁",
    "Haze": "🌫️",
    "Snow": "⛄",
    "Rain": "☔",
    "Clouds": "⛅",
    "Thunderstorm": "⚡",
    "Clear": "🌞",
    "Moon": "🌜",
    "Windy": "⛵",
    "Drizzle": "🌦",
    "Error": "❌",
    "Fog": "🌫️"
};

let tempFormat = (data: OpenWeatherMapData): string => {
    if(data.weather) {
        let curTemp = (data.main.temp - 273.15).toFixed(2);
        let curWeather = data.weather.reduce((acc, weatherType: OpenWeatherMapWeather) => {
            if(weatherEmoji.hasOwnProperty(weatherType.main)) {
                return acc + weatherEmoji[weatherType.main];
            }
            return acc + weatherEmoji.Error;
        }, "");
        return `${curWeather} ${curTemp}°C`;
    }
    return "invalid key";
};

export function getWeather(id: number, city: string) {
    let weatherOutputElem: HTMLElement = document.getElementById(`${id}-output`)!;
    let weatherTimeout = settingsMenu.getWeatherTimeoutValue() || defaultWeatherTimeout;
    if(
        knownWeather &&
        knownWeather.hasOwnProperty(city) &&
        (new Date().getTime() - knownWeather[city].retrievedAt) < weatherTimeout
    ) {
        weatherOutputElem.innerText = tempFormat(knownWeather[city]);
    } else {
        city = city === "" ? "delft" : city;
        const apiKey = settingsMenu.getWeatherAPIKey();
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
            .then(response =>
                response.json().then(data => ({
                        data: data,
                        status: response.status
                    })
                ).then(res => {
                    knownWeather[city] = res.data;
                    knownWeather[city].retrievedAt = new Date().getTime();
                    window.localStorage.setItem("weatherInfo", JSON.stringify(knownWeather));
                    weatherOutputElem.innerText = tempFormat(res.data);
                }))
            .catch((err) => {
                console.log(err);
                weatherOutputElem.innerText = `${weatherEmoji.Error} no (valid) key`;
            });
    }
}

// Export this function
export function addWeatherListener(widget: WeatherWidget, id: number): void {
    const cityButton = document.getElementById(`${id}-cityInputButton`);
    if(cityButton) {
        cityButton.addEventListener("click", () => {
            const cityNameInput: HTMLElement | null = document.getElementById(`${id}-cityInput`);
            let city = (cityNameInput as HTMLInputElement).value;
            widget.settings.city = city;
            getWeather(id, city);
        });
    } else {
        console.log("Could not find the \"change\" button corresponding to widget", id);
    }
}
