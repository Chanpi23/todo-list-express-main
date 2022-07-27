const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
// select all of these

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // add the deleteBtns into add event listener 
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // add all items to add event listener 
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // add all complete into add event listener 
})

async function deleteItem(){ //  ohh we shall delete some ishh
    const itemText = this.parentNode.childNodes[1].innerText // direct  reference - grab parent, then child, second one, then text - do not do this use classes ( ids, datatags) you animal 
    try{
        const response = await fetch('deleteItem', { // this happens back 
            method: 'delete',// labeling is fun mmkay 
            headers: {'Content-Type': 'application/json'}, // JSON SON
            body: JSON.stringify({ // make it a string 
              'itemFromJS': itemText// ties into our server.js delete
            })
          })
        const data = await response.json() // we waited, now we must read it 
        console.log(data) // we got it back bishh 
        location.reload()// refresh it like a lemon 

    }catch(err){ // something failed sans it is okay thouuuuu
        console.log(err)// here is where we failed in life .. kidding 
    }
}

async function markComplete(){ // we updating some thangs
    const itemText = this.parentNode.childNodes[1].innerText // see above things we spoke on  (line 18) they match up from the deleteItem function 
    try{
        const response = await fetch('markComplete', {// things be happening 
            method: 'put', // different methods 
            headers: {'Content-Type': 'application/json'},// make sure it is JSON SON 
            body: JSON.stringify({// makes it a string 
                'itemFromJS': itemText // links us to the server.js
            })
          })
        const data = await response.json()// we waited now for the fresh boba tea now we read it 
        console.log(data)// magic happens 
        location.reload()// refreshing lemon water ! 

    }catch(err){ // sad girl tears 
        console.log(err)// here's what to fix that kink in your hair 
    }
}

async function markUnComplete(){ // same as above  to uncompleted  
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}