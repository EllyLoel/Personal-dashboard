///////////////
// Global variables
///////////////
const root = document.querySelector(':root')
const bodyEl = document.body
const weatherEl = document.getElementById("weather")
const timeEl = document.getElementById("time")
const quoteEl = document.getElementById("quote")

///////////////
// Get & display background image from NASA APOD
///////////////
const getBgImg = async () => {
    try {
        const nasaApiUrl = "https://api.nasa.gov/"
        const nasaEndpoint = "planetary/apod"
        const nasaQuery = "?api_key=ZRtaelwOazjCIeYFiyR85hdbSxjFmAfUiB5j9vhg"
        
        const res = await fetch(`${nasaApiUrl}${nasaEndpoint}${nasaQuery}`)
        const data = await res.json()
        if ( data.error || data.media_type === "video" ) { throw Error }
        
        bodyEl.style.backgroundImage = `url(${data.url})`
    } catch(err) {
        bodyEl.style.backgroundImage = `url(https://apod.nasa.gov/apod/image/2107/neptunetriton_voyager_960.jpg)`
    }
}

///////////////
// Get & display current weather
///////////////
navigator.geolocation.getCurrentPosition(async position => {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=de2b68ffd5aecd30b2fa346a13994973`)
        if ( !res.ok ) {
            throw Error("<span>Location data not available.</span><br />Please allow access to your location to see the weather.")
        }
        const data = await res.json()
        
        const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        weatherEl.innerHTML = `
            <img class="weather-img" src=${iconUrl} alt="${data.weather[0].description} icon" />
            <p class="weather-temp">${Math.round(data.main.temp)}º</p>
            <p class="weather-city">${data.name}</p>
        `
    
    } catch(err) {
        weatherEl.style.display = "block"
        weatherEl.innerHTML = `<p class="error">${err}</p>`
    }
})

///////////////
// Get & display current time
///////////////
const getCurrentTime = () => {
    timeEl.textContent = new Date().toLocaleTimeString("en-us", {timeStyle: "short"})
}

///////////////
// Get & display affirmation        !!! Unfortunately this api does not work any longer !!!
///////////////
// const getAffirmation = async () => {
//     try {
//         const res = await fetch("https://cors-anywhere.herokuapp.com/https://www.affirmations.dev")
//         if ( !res.ok ) {
//             throw Error("Something went wrong when fetching the affirmation. Try refreshing your page.")
//         }
//         const data = await res.json()
        
//         root.style.setProperty('--affirmation', `"${data.affirmation}"`)
//     } catch(err) {
//         root.style.setProperty('--affirmation-color', 'red')
//         root.style.setProperty('--affirmation', `"${err}"`)
//     }
// }


///////////////
// Get & display quote
///////////////
const getQuote = async () => {
    try {
        const res = await fetch("https://api.quotable.io/random")
        if ( !res.ok ) {
            throw Error("<span>Something went wrong when fetching the quote.</span><br />Try refreshing your page.")
        }
        const data = await res.json()

        quoteEl.innerHTML += `<q>${data.content}</q><small> - ${data.author}</small>`
    } catch(err) {
        quoteEl.innerHTML = `<p class="error">${err}</p>`
    }
}

///////////////
// Run functions (Weather is an anonymous function so it has already run)
///////////////
getBgImg()
setInterval(getCurrentTime, 1000)
// getAffirmation()
getQuote()