const BASE_URL = 'http://localhost:3000/quotes?_embed=likes'
const quoteBox = document.querySelector("#quote-list")
const form = document.querySelector("#new-quote-form")
const blocks = document.querySelectorAll('li.quote-card')


function main(){
    fetchQuotes()
    formAction()
    handleAction()
}

main()


function fetchQuotes(){
    fetch(BASE_URL)
    .then(resp => resp.json())
    .then(json => {
        renderQuotes(json)
        editButton()
    })
}

function renderQuotes(quotes){
    quotes.forEach(renderQ)
}

function renderQ(q){
    const li = document.createElement('li')
    li.setAttribute("class", "quote-card")
    li.id = q.id
    li.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${q.quote}</p>
        <footer class="blockquote-footer">${q.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${q.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>`


    quoteBox.appendChild(li)
}

function formAction(){
    form.addEventListener("submit", event => {
        event.preventDefault()

        createQuote(event)
    })
}

function createQuote(event){
    const newQuote = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quote: event.target[0].value,
            author: event.target[1].value,
            likes: []
        })
    }
    
    fetch('http://localhost:3000/quotes', newQuote)
    .then(resp => resp.json())
    .then(json => renderQ(json))

}

function handleAction(){
    quoteBox.addEventListener("click", event => {
        if (event.target.className === "btn-danger"){
            deleteQuote(event)
        } else if (event.target.className === "btn-success") {
            likeQuote(event)
        } else if (event.target.className === "btn-edit") {
            editQuote(event)
        }
    })
}

function deleteQuote(e){
    const del = e.target.parentElement.parentElement.id

    const delQuote = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }
    
    fetch(`http://localhost:3000/quotes/${del}`, delQuote)
    .then(resp => resp.json())
    .then(json => renderDeletion(del))
}

function renderDeletion(id){
    document.getElementById(id).remove()
}


function likeQuote(e){
    const like = parseInt(e.target.parentElement.parentElement.id)

    const likeQuote = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quoteId: like,
            createdAt: Date.now()
        })
    }
    
    fetch(`http://localhost:3000/likes`, likeQuote)
    .then(resp => resp.json())
    .then(json => increaseLikes(json))
}

function increaseLikes(like){
    let likesToIncrease = document.querySelectorAll('li')[like.quoteId-1].querySelector('.btn-success span')

    likesToIncrease.innerText = parseInt(likesToIncrease.innerText)+1

}

function editButton(){     // had to place this AFTER the promise of making all things were finished

    const blocks = document.querySelectorAll('blockquote')

    blocks.forEach(q => {
        const editButton = document.createElement('button')
        editButton.setAttribute("class", "btn-edit")
        editButton.innerText = "Edit me"


        q.appendChild(editButton)
    })
}

function editQuote(e){
    const quoteLine = e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling
    quoteLine.outerHTML = `<textarea placeholder="${quoteLine.innerText}">${quoteLine.innerText}</textarea>`

    e.target.innerText = "Submit Changes"

    e.target.parentElement.addEventListener("click", event => {
        console.log("hi")
    })
}