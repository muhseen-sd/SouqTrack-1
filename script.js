console.log("1: starting up");
console.log("2: script keeps running"); 

const watchlistEl = document.getElementById("watchlist")
const notifictaionsEl = document.getElementById("notifications")

const coinSymbols = {
    bitcoin: "BTC",
    ethereum: "ETH",
    solana: "SOL",
    binancecoin: "BNB",
    ripple: "XRP",
    cardano: "ADA",
    dogecoin: "DOGE",
    polkadot: "DOT",
    "matic-network": "MATIC",
    near: "NEAR"
}

const coinIds = {
    btc: "bitcoin",
    eth: "ethereum",
    bnb: "binancecoin",
    xrp: "ripple",
    ada: "cardano",
    sol: "solana",
    doge: "dogecoin",
    dot: "polkadot",
    matic: "matic-network",
    near: "near"
}

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      

// converting it to async
async function fetchCoinPrice(coinId){
    try{
        let response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`)
        let data = await response.json() 


          // Clear the notification when network recovers
        let networkErr = document.getElementById("fetch-error")
        if (networkErr) networkErr.remove() 

        // Error Handling: "coin not found"
        if(data[coinId] === undefined){

            let existing = document.getElementById("invalid-coin")

            if(existing){
                existing.querySelector(".error-text").textContent = `${coinId}: coin not found`
            } else{
                let errMsg = document.createElement("p")
                errMsg.className = "coin-error"
                errMsg.id = "invalid-coin"
                // errMsg.textContent = `${coinId}: coin not found`
                // Separate span for text so button isn't wiped out.

                let textSpan = document.createElement("span")
                textSpan.className = "error-text"
                textSpan.textContent = `${coinId}: coin not found`


                // The remove button

                let dismissBtn = document.createElement("button")
                dismissBtn.textContent = "X"
                dismissBtn.className = "dismiss-btn"

                dismissBtn.addEventListener("click", () => {
                    errMsg.remove() 
                })

                errMsg.appendChild(textSpan)
                errMsg.appendChild(dismissBtn)
                notifictaionsEl.appendChild(errMsg)
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
            // For the percentage 

            let change = data[coinId].usd_24h_change.toFixed(2)
            let changeText = change >= 0 ? `+${change}%` : `${change}%`

            let changeEl = existing.querySelector(".coin-change")
            changeEl.textContent = changeText
            changeEl.className = change >= 0 ? "coin-change positive" : "coin-change negative"

        } else{
            // first time - bild the full card
            let card = document.createElement("div")
            card.className = "coin-card"
            card.id = `price-${coinId}`
            
            // Name element on te card

            let nameEl = document.createElement("div")
            nameEl.textContent = coinSymbols[coinId] || coinId.toUpperCase()

            // Price Element on the card

            let priceEl = document.createElement("p")
            priceEl.className = "coin-price"
            priceEl.textContent = `$${data[coinId].usd.toLocaleString()}`

            // Percentage display 
            let change = data[coinId].usd_24h_change.toFixed(2)
            let changeText = change >= 0 ? `+${change}%` : `${change}%`

            let changeEl = document.createElement("p")
            changeEl.className = change >= 0 ? "coin-change positive" : "coin-change negative"
            changeEl.textContent = changeText
            
            // Remove Button

            let removeBtn = document.createElement("button")
            removeBtn.textContent = "X"
            removeBtn.className = "remove-btn"

            removeBtn.addEventListener("click", () => {
                removeBtn.parentElement.remove()

                // also removing it from localStorage
                watchlist = watchlist.filter( id => id !== coinId)
                localStorage.setItem("watchlist", JSON.stringify(watchlist))
                updateEmptyState()

            })

            card.appendChild(nameEl)
            card.appendChild(priceEl)
            card.appendChild(changeEl)
            card.appendChild(removeBtn)

            // Local storage 
            watchlist.push(coinId)
            localStorage.setItem("watchlist", JSON.stringify(watchlist))

            watchlistEl.appendChild(card)
        }
    } catch (error){
          let existing = document.getElementById("fetch-error")

        if(existing){
            existing.querySelector(".error-text").textContent = `Something went wrong`
        } else{
            let errMsg2 = document.createElement("p")
            errMsg2.id = `fetch-error`
            errMsg2.className = "coin-error"

            // setting time out for something went wrong message
            setTimeout(() => {
                errMsg2.remove()
            }, 10000)

            // errMsg2.textContent = `Something went wrong`
            // separate span for text so button isn't wipe 

            let textSpan = document.createElement("span")
            textSpan.className = "error-text"
            textSpan.textContent = `Something went wrong`

            // the remove button for "somthing went wrong"
            let dismissBtn = document.createElement("button")
            dismissBtn.className = "dismiss-btn"
            dismissBtn.textContent = "X"

            dismissBtn.addEventListener("click", () => {
                errMsg2.remove()

            })

            errMsg2.appendChild(textSpan)
            errMsg2.appendChild(dismissBtn)
            notifictaionsEl.appendChild(errMsg2)
        }
    }
}


// Calling hardcoded function before e.g fetchCoinPrice("bitcoin")
// Doubting wether I should inclue this or not. 
watchlist.forEach(coinId => fetchCoinPrice(coinId))
updateEmptyState()


setInterval( () => {
    watchlist.forEach(coinId => fetchCoinPrice(coinId))
}, 30000 )



// Input nd button side

let addButton = document.getElementById("add-btn")

addButton.addEventListener("click", () => {
    let coinId = document.getElementById("coin-input").value.toLowerCase().trim()
    coinId = coinIds[coinId] || coinId

    // If coinId is empty, stop here
    if (coinId === "") return 
    
    // to avoid adding a single coin twice
    if(watchlist.includes(coinId)) return


    // fetch the coin price
    fetchCoinPrice(coinId)
    updateEmptyState()


    // Clear the input 
    document.getElementById("coin-input").value = ""

})

// Empty state function to notify new user

function updateEmptyState(){
    let emptyState = document.getElementById("empty-state")
    if(!emptyState) return 

    if(watchlist.length === 0){
        emptyState.style.display = "block"

    } else{
        emptyState.style.display = "none"
    }
}
