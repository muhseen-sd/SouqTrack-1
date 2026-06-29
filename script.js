console.log("1: starting up");
console.log("2: script keeps running"); 

const watchlist = document.getElementById("watchlist")

const coinSymbols = {
    bitcoin: "BTC",
    ethereum: "ETH",
    solana: "SOL"

}


function fetchCoinPrice(coinId){
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
    .then(response => response.json())
    .then(data => {

        // Error Handling: "coin not found"
        if(data[coinId] === undefined){

            let existing = document.getElementById("invalid-coin")

            if(existing){
                existing.textContent = `${coinId}: coin not found`
            } else{
                let errMsg = document.createElement("p")
                errMsg.className = "coin-error"
                errMsg.id = "invalid-coin"
                errMsg.textContent = `${coinId}: coin not found`
                watchlist.appendChild(errMsg)
            }

            return
        }

        console.log(data[coinId].usd)
                

        // Setting up an auto refresh 
        //Begin by checking if the element exist
        let existing = document.getElementById(`price-${coinId}`)
        
        if(existing){
            // card already exists -- just update the price
            let priceEl = existing.querySelector(".coin-price")
            priceEl.textContent = `$${data[coinId].usd.toLocaleString()}`

        } else{
            // first time - bild the full card
            let card = document.createElement("div")
            card.className = "coin-card"
            card.id = `price-${coinId}`
            
            let nameEl = document.createElement("div")
            nameEl.textContent = coinSymbols[coinId] || coinId.toUpperCase()

            let priceEl = document.createElement("p")
            priceEl.className = "coin-price"
            priceEl.textContent = `$${data[coinId].usd.toLocaleString()}`

            card.appendChild(nameEl)
            card.appendChild(priceEl)
            watchlist.appendChild(card)
        }
            
    })

    // Error Handling: "network issue/disconnected"
    .catch(error => {

        let existing = document.getElementById("fetch-error")

        if(existing){
            existing.textContent = `Something went wrong`
        } else{
            let errMsg2 = document.createElement("p")
            errMsg2.id = `fetch-error`
            errMsg2.textContent = `Something went wrong`
            watchlist.appendChild(errMsg2)
        }
    })
}

fetchCoinPrice("bitcoin")
fetchCoinPrice("ethereum")
fetchCoinPrice("fakecoin123")
fetchCoinPrice("rain")
fetchCoinPrice("dai")

setInterval( () => {
    fetchCoinPrice("bitcoin")
    fetchCoinPrice("ethereum")
}, 30000 )