//--> these console were written to see how javasxipt executes code line by line, without waiting for a log process such as fecthing.
console.log("1: starting up");
console.log("2: script keeps running"); 

// --> get the watchlist elements to modify them
const watchlistEl = document.getElementById("watchlist")
// --> get the notification elements to modify them
const notifictaionsEl = document.getElementById("notifications")

//--> An object written to convert the coins name fetched to their ticky symbol for better view on the UI
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

//--> An object converting a plain input written by the user in abbriviation to their actual name to fectch them from the API as intended
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
// --> assigning the get item from local storage or an empty array to watchlist, the local storage will facilitate in retrieving the saved coins from the storage or use an empty arrayr
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

/* --> The fectCoinPrice funtion perform several activities which includes: fetching the API, unrapping it  using .then(reponse => response.json()) when it is ready
    and be able to manpulate and use the data using .then(data => {}). 2. It handle error which includes network issue and invalid coin and display the main problem among 
    the two. Save coins to localStorage.

*/
function fetchCoinPrice(coinId){
    // --> This fecth an API from coingecko using the url, we beagn with bitcoin we later replace a varible with it to use varity of coins
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
    // --> This wait for the API to become ready and then unwrap it.
    .then(response => response.json())
    // --> It is now ready, we thennuse .then(data => {}) to use the API the way we want
    .then(data => {

        // Clear the notification when network recovers
        // --> This revome a network error displayed on the ui after it has been displayed to avoid repitation
        let networkErr = document.getElementById("fetch-error")
        if (networkErr) networkErr.remove() 

        // Error Handling: "coin not found"
        // --> This check if the coin input in not valid.
        if(data[coinId] === undefined){
            // --> Assigned an invalid coin to eixting in order to manipulate it. 
            let existing = document.getElementById("invalid-coin")
            // --> Check if the coin is not valid using the assigned varibles, then get the element using querySelector, and display "the id: coin not found on the screen"
            if(existing){
                existing.querySelector(".error-text").textContent = `${coinId}: coin not found`
            } else{
                // --> Even though this is not clear let me try my best: If the coin in not valid, it should crete a "p" element, gave it class and id, the span is 
                // also not clear, I can tell the reason we wrote the span and what it is meant for. But I can guess it is there to facilitate styling/instead of assigning 
                // it directly to the p tag it gave it a span element as well.
                let errMsg = document.createElement("p")
                errMsg.className = "coin-error"
                errMsg.id = "invalid-coin"
                // errMsg.textContent = `${coinId}: coin not found`
                // Separate span for text so button isn't wiped out.

                let textSpan = document.createElement("span")
                textSpan.className = "error-text"
                textSpan.textContent = `${coinId}: coin not found`


                // The remove button
                // --> Te code below was used in creating button and gave it a calss name then made it displayed "X". Whcih wa sa
                let dismissBtn = document.createElement("button")
                dismissBtn.textContent = "X"
                dismissBtn.className = "dismiss-btn"
                // --> This is an event listener written to remove a coin from the interface
                dismissBtn.addEventListener("click", () => {
                    errMsg.remove() 
                })
                // --> texSpan whcih cointained the "coin not found" is added to the errMsg.
                // --> dismiss button is also added to the container so that someone can manually cancle the error message.
                // --> Then the entire container is added inside a notification div for styling, alignement and other modification
                errMsg.appendChild(textSpan)
                errMsg.appendChild(dismissBtn)
                notifictaionsEl.appendChild(errMsg)
                }
            // --> This mean if one of it run then the program will terminate.
            return


        }
        // --> This  has no unsecase related to the program, it was written for test purpose on the console. 
        console.log(data[coinId].usd)
                

        // Setting up an auto refresh 
        //Begin by checking if the element exist
        // --> this assigned the coin price to a varible named existing for further modification
        let existing = document.getElementById(`price-${coinId}`)
        // --> If the coin's price is there then assigne it a varible named priceEl and make it dispaly the price and the local currency (But m question here how 
        // does it know it is $, or might be euro, Naira, Yuan or Cedi? as it just dispalyed  a $ sign. Or I see that we added to $ ourself, no issue here, solved).
        if(existing){
            // card already exists -- just update the price
            let priceEl = existing.querySelector(".coin-price")
            priceEl.textContent = `$${data[coinId].usd.toLocaleString()}`
            // --> here if the coin's price did'nt exist the else will crete a card, gave it class name and ID, the one assigned to exixsting at the first place.
        } else{
            // first time - bild the full card
            let card = document.createElement("div")
            card.className = "coin-card"
            card.id = `price-${coinId}`
            
            // Name element on te card
            // --> name is also giving to the creted card which will laterb be giving to the card
            // --> Instead of it to display just the name, it either grab the converted named from the object "coinsymbol" above or capitalise the name.
            let nameEl = document.createElement("div")
            nameEl.textContent = coinSymbols[coinId] || coinId.toUpperCase()

            // Price Element on the card
            // --> This create a price element, gaave it a class name, and convert it to local string which will later be added to the coin card as well.
            let priceEl = document.createElement("p")
            priceEl.className = "coin-price"
            priceEl.textContent = `$${data[coinId].usd.toLocaleString()}`
            
            // Remove Button
            // --> this is also a remove button added to the card, which will display "X"
            let removeBtn = document.createElement("button")
            removeBtn.textContent = "X"
            removeBtn.className = "remove-btn"
            // --> This eventlisterner will remove the entire card when clicked, but this .parentElement.remove() is not clear to me, does that mean it will remove the entire card?
            removeBtn.addEventListener("click", () => {
                removeBtn.parentElement.remove()

                // also removing it from localStorage
                // --> this variable syas if a certin id is not equal to the id od the existing coin
                watchlist = watchlist.filter( id => id !== coinId)
                // --> This seems like it setting the coins list to the local storage by converting to string since they cannot be added as objects or arrays.
                localStorage.setItem("watchlist", JSON.stringify(watchlist))
                updateEmptyState()

            })
            // --> Append the name, price and remove button to the card
            card.appendChild(nameEl)
            card.appendChild(priceEl)
            card.appendChild(removeBtn)

            // Local storage 
            // --> I cannot say this is pushed to what, I am in doubt, is it pushing the watchlist to the local storage?
            watchlist.push(coinId)
            // --> This is also setting the watclist to the local storage
            localStorage.setItem("watchlist", JSON.stringify(watchlist))
            // --> We append the entire card to the eatchlist element/lists
            watchlistEl.appendChild(card)
        }
            
    })

    // Error Handling: "network issue/disconnected"
    // --> This is written to control the error related to network issue. 
    .catch(error => {
        // --> This assign the fetch-error id to existing to manipulate it. 
        let existing = document.getElementById("fetch-error")
        // --> If the variable (or whatsoever is there: This needs and explanation), get the element using querySelector .error-text, and gave it "something went wrong"
        if(existing){
            existing.querySelector(".error-text").textContent = `Something went wrong`
        } else{
            //--> Else create an element, give it id and class for styling
            let errMsg2 = document.createElement("p")
            errMsg2.id = `fetch-error`
            errMsg2.className = "coin-error"

            // setting time out for something went wrong message
            // --> This make the error message notification to disappear after 10 secs for the 'Something went wrong'
            setTimeout(() => {
                errMsg2.remove()
            }, 10000)

            // errMsg2.textContent = `Something went wrong`
            // separate span for text so button isn't wipe 
            // --> This create a span and assign the "something went wrong error."
            let textSpan = document.createElement("span")
            textSpan.className = "error-text"
            textSpan.textContent = `Something went wrong`

            // the remove button for "somthing went wrong"
            // --> This create a button to cancel the error message.
            let dismissBtn = document.createElement("button")
            dismissBtn.className = "dismiss-btn"
            dismissBtn.textContent = "X"
            // --> when the button is created then the click will remove it from the interface
            dismissBtn.addEventListener("click", () => {
                errMsg2.remove()

            })
            // --> Append the text from the textspan to the errMS card, then append the button to the message card as well, then assign the message to the notifiction
            errMsg2.appendChild(textSpan)
            errMsg2.appendChild(dismissBtn)
            notifictaionsEl.appendChild(errMsg2)
        }
    })

    
}

// Calling hardcoded function before e.g fetchCoinPrice("bitcoin")
// --> This call the function fetchCoinPrice(coinId), but I am not that sure.
watchlist.forEach(coinId => fetchCoinPrice(coinId))

updateEmptyState()

// --> I cannot recall what this is all about. 
setInterval( () => {
    watchlist.forEach(coinId => fetchCoinPrice(coinId))
}, 30000 )



// Input nd button side
// --> this assigne an add button to a variable named addButton.
let addButton = document.getElementById("add-btn")
// --> Tis event listener add a coin to the list when clicked.
addButton.addEventListener("click", () => {
    /*--> This get the input and the value, convert it to lower case in order to fecth it properly as it cannot be fetch using uppercase or a word begining with upper case
        Then trim the coin insertedso that the space added eiher intentionally or by mistake cannot affect the normal process. 
    */
    let coinId = document.getElementById("coin-input").value.toLowerCase().trim()
    // --> this convert the input to be gotte=n from input to it's actual name in the API to fetch it incase you use a wrong convention. for intacne BTC will become bitcoin
    coinId = coinIds[coinId] || coinId

    // If coinId is empty, stop here
    // --> I cannot remeber what this do.
    if (coinId === "") return 
    
    // to avoid adding a single coin twice
    // --> tis check if a coin inserted in alredy added, it won't work. Which means we should consider dispaying, "Coin is already added" message in v2 or something similar. What do you think?
    if(watchlist.includes(coinId)) return


    // fetch the coin price
    // --> If the coin is valid, and not alredy been added, this will add the coin to the interface. 
    fetchCoinPrice(coinId)
    updateEmptyState()


    // Clear the input 
    // --> This clear the input after the coin is added, inorer to add some. 
    document.getElementById("coin-input").value = ""

})

// Empty state function to notify new user
// --> this function will be dispalyed if there is no cin added on the list, to allow user to know tjat he need to add a coin first. I am not that sure.
function updateEmptyState(){
    // --> get the element from the html filen by Id. 
    let emptyState = document.getElementById("empty-state")
    // --> If there are coins on the list, don't display the message or don't run the function.
    if(!emptyState) return 
    // --> else go ahaedand run the function when the watchlist is empty, display the message
    if(watchlist.length === 0){
        emptyState.style.display = "block"
        // --> esle, don't display the message.  
    } else{
        emptyState.style.display = "none"
    }
}

