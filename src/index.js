document.addEventListener("DOMContentLoaded", () => {
  // VARIABLES
  const quotesLikesURL = "http://localhost:3000/quotes?_embed=likes"
  const quotesURL = "http://localhost:3000/quotes"
  const likesURL = "http://localhost:3000/likes"
  const quoteUl = document.getElementById("quote-list")
  const newQuoteForm = document.getElementById("new-quote-form")

  // FETCH REQUESTS
  function fetchQuotes(){
    quoteUl.innerHTML = ""
    fetch(quotesLikesURL)
    .then(response => response.json())
    .then(quotes => renderQuotes(quotes))
  }

  function postNewQuote(quoteObj){
    fetch(quotesURL, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify(quoteObj),
    })
    .then(response => response.json())
    .then(fetchQuotes)
  }

  function deleteQuote(quoteId){
    fetch(`${quotesURL}/${quoteId}`,{
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(fetchQuotes)
  }

  function addLike(id){
    fetch(likesURL, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify({
        "quoteId": id,
        "createdAt": Date.now()
      }),
    })
    .then(response => response.json())
    .then(fetchQuotes)
  }


  // EVENT HANDLERS
  newQuoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    const quote = e.target[0].value
    const author = e.target[1].value
    const quoteObj = {quote, author}
    postNewQuote(quoteObj)
  })

  // FUNCTIONS
  function renderQuotes(quotes){
    quotes.forEach(quote =>{
      const quoteLi = document.createElement("li")
      quoteLi.className = 'quote-card'
      let quoteid = quoteLi.dataset.id = quote.id
      quoteLi.innerHTML = `
      <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
      </blockquote>
      `
      quoteUl.prepend(quoteLi)

      quoteLi.addEventListener("click", function(e){
        // let id = e.target.parentElement.parentElement.dataset.id
        if (e.target.matches('.btn-danger')){
          deleteQuote(quoteid)
        }
        if (e.target.matches('.btn-success')){
          // let likes = e.target
          addLike(quoteid)
          // console.log(e.target.childNodes[1].textContent)
        }
      })
    })
  }


  // EXECUTIONS
  fetchQuotes()


})