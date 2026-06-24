console.log("1: starting up");
console.log("2: script keeps running"); 

const watchlist = document.getElementById("watchlist")

function fetchCoinPrice(coinId){
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
    .then(response => response.json())
    .then(data => {

        // Error Handling I
        if(data[coinId] === undefined){
            let errMsg = document.createElement("p")
            errMsg.textContent = `${coinId}: coin not found`
            watchlist.appendChild(errMsg)

            return
        }

        console.log(data[coinId].usd)
                

        // Setting up an auto refresh =================================================================

        // checking if the element exist
        let existing = document.getElementById(`price-${coinId}`)
        
        if(existing){

            existing.textContent = `${coinId} price: ${data[coinId].usd}`
        } else{

            let newEl = document.createElement("p")
            newEl.id = `price-${coinId}`
            newEl.textContent = `${coinId} price: ${data[coinId].usd}`
            watchlist.appendChild(newEl)
        }

    })

    // Error Handling II
    .catch(error => {
        let errMsg2 = document.createElement("p")
        errMsg2.textContent = `Something went wrong`
        watchlist.appendChild(errMsg2)
    })
}

fetchCoinPrice("bitcoin")
fetchCoinPrice("ethereum")
fetchCoinPrice("fakecoin123")

