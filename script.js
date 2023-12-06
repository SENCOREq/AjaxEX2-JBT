let countriesName = [];

async function getAllData() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    displayAllCountries(countries)
}

function displayAllCountries(countries) {

    let allCountriesTableBody = document.getElementById("allCountriesTableBody");
    let allCountriesDiv = document.getElementById("allCountriesDiv");
    let allCountriesStats = document.getElementById("allCountriesStats");
    let searchBarDiv = document.getElementById("searchBarDiv");

    let numberOfCountries = 0;
    let totalCountriesPopulation = 0
    let averageCountriesPopulation = 0;

    let allCountriesRegions = [];
    let countryRegionNum = 1;

    let html = ""

    for (let country of countries) {
        numberOfCountries++;
        totalCountriesPopulation += country.population

        html +=
            `
        <tr>
            <td>${country.name.common}</td>
            <td>${country.population}</td>
        </tr>
        `

        countriesName.push(country.name.common);

        let allCountriesIndex = allCountriesRegions.findIndex(ele => ele.region === country.region)
        if (allCountriesIndex == -1) {
            allCountriesRegions.push({
                region: country.region,
                numOfReg: countryRegionNum
            })
        }
        else {
            allCountriesRegions[allCountriesIndex].numOfReg++;
        }

    }
    averageCountriesPopulation = totalCountriesPopulation / numberOfCountries;

    let allCountriesStatistics =
        `
    Number of Countries: ${numberOfCountries} <br>
    Total Countries Population: ${totalCountriesPopulation} <br>
    Average Countries Population: ${averageCountriesPopulation} <br>

    `

    allCountriesStats.innerHTML = allCountriesStatistics;
    allCountriesTableBody.innerHTML = html;
    searchBarDiv.style.display = "block";
    allCountriesDiv.style.display = "block";

    displayAllCountriesRegions(allCountriesRegions);
}

function displayAllCountriesRegions(allCountriesRegions) {
    let allCountriesRegionsTableBody = document.getElementById("allCountriesRegionsTableBody");

    let html = "";

    for (let countryReg of allCountriesRegions) {
        html +=
            `
        <tr>
            <td>${countryReg.region}</td>
            <td>${countryReg.numOfReg}</td>
        </tr>
        `
    }

    allCountriesRegionsTableBody.innerHTML = html;
}

function searchSpecificCountries() {

    let searchCountries = document.getElementById("searchCountries");

    let countriesSearched = [];

    countriesName.map((ele) => {
        if (ele.toLowerCase().includes(searchCountries.value.toLowerCase()))
            countriesSearched.push(ele);
    })

    getSpecificCountryInfo(countriesSearched);
}

async function getSpecificCountryInfo(countriesSearched) {
    let specificCountriesRegion = [];
    let specificCountriesCurrencies = [];
    let foundCountries = [];
    

    for (let c of countriesSearched) {
        const response = await fetch(`https://restcountries.com/v3.1/name/${c}`)
        const countries = await response.json();

        let numbersOfRegionCountries = 1;
        let numberOfCurrencies = 1;

        for (c of countries) {
            if (!foundCountries.some(value => value.name == c.name.common)) {

                foundCountries.push({
                    name: c.name.common,
                    population: c.population,
                })

                let specRegArrIndex = specificCountriesRegion.findIndex(ele => ele.region == c.region)
                if (specRegArrIndex == -1) {
                    specificCountriesRegion.push({
                        region: c.region,
                        numOfReg: numbersOfRegionCountries,
                    })
                }
                else {
                    specificCountriesRegion[specRegArrIndex].numOfReg++
                }

                let specCurrenciesIndex = specificCountriesCurrencies.findIndex(ele => ele.currency === Object.values(c.currencies)[0].symbol)
                if (specCurrenciesIndex == -1) {

                    specificCountriesCurrencies.push({
                        currency: Object.values(c.currencies)[0].symbol,
                        numOfCurrencies: numberOfCurrencies,
                    })
                }
                else {
                    specificCountriesCurrencies[specCurrenciesIndex].numOfCurrencies++
                }

            }
        }
    }
    displaySpecificCountriesSearchedInfo(foundCountries)
    displaySpecificCountriesSearchedRegion(specificCountriesRegion)
    displaySpecificCountriesSearchedCurrencies(specificCountriesCurrencies)
}

function displaySpecificCountriesSearchedInfo(foundCountries){
    let specificCountriesDiv = document.getElementById("specificCountriesDiv");
    let specificCountriesTableBody = document.getElementById("specificCountriesTableBody");
    let specificCountriesStats = document.getElementById("specificCountriesStats");
    let allCountriesDiv = document.getElementById("allCountriesDiv");

    let totalCountriesFound = 0;
    let totalCountriesPopulation = 0;
    let countriesAvgPopulation = 0;

    let html = ``;

    for(let country of foundCountries){
        totalCountriesFound++;
        totalCountriesPopulation+= country.population
        html +=
        `
        <tr>
            <td>${country.name}</td>
            <td>${country.population}</td>
        </tr>

        `
    }
    countriesAvgPopulation = totalCountriesPopulation / totalCountriesFound;

    specResultStats = 
    `
    <p>Number of countries searched: ${totalCountriesFound}</p>
    <p>Total countries searched Population: ${totalCountriesPopulation}</p>
    <p>Average countries searched population: ${countriesAvgPopulation}</p>
    `

    specificCountriesStats.innerHTML = specResultStats;
    specificCountriesTableBody.innerHTML = html;
    allCountriesDiv.style.display = "none"
    specificCountriesDiv.style.display = "block"
}

function displaySpecificCountriesSearchedRegion(specificCountriesRegion){
    let specRegionTableBody = document.getElementById("specRegionTableBody");

    let html = "";

    for(let reg of specificCountriesRegion){
        html +=
        `
        <tr>
            <td>${reg.region}</td>
            <td>${reg.numOfReg}</td>
        </tr>

        `
    }

    specRegionTableBody.innerHTML = html;
}

function displaySpecificCountriesSearchedCurrencies(specificCountriesCurrencies){
    let specCurrencyTableBody = document.getElementById("specCurrencyTableBody");

    let html = "";

    for(let curr of specificCountriesCurrencies){
        html +=
        `
        <tr>
            <td>${curr.currency}</td>
            <td>${curr.numOfCurrencies}</td>
        </tr>
        `
    }

    specCurrencyTableBody.innerHTML = html;
}
