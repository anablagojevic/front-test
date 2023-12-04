let url=window.location.pathname

window.onload=function(){ 
    if(url == '/')
        formValidate()
    if(url == '/users.html')
        fetchAndDisplayData()
}

function fetchAndDisplayData() {
    
    $.ajax({
        url: 'http://localhost:8080/api/users',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            displayData(response)
        },
        error: function(error) {
            console.log(error)
        }
      });
  }
  
  function displayData(response){
    let html = ''
    for(let user of response){
        html += '<tr>'
        html += `<td>${user.id}</td>
                 <td>${user.firstName} ${user.lastName}</td>
                 <td>${user.street}</td>
                 <td>${user.city}</td>
                 <td>${user.country}</td>`
        html += `</tr>`
    }
    document.querySelector('#users').innerHTML = html
  }
  

function printMessage(response){
    let html = `<p>${response.message}</p>`
    document.querySelector('.success-message').innerHTML = html
}


function formValidate(){
    const firstName = document.querySelector('#firstName')
    const lastName = document.querySelector('#lastName')
    const address = document.querySelector('#address')
    const city = document.querySelector('#city')
    const country = document.querySelector('#country')
    

    

    const firstNameRegex = /^[A-Z]{1}[a-z]{2,14}$/
    const lastNameRegex = /^[A-Z]{1}[a-z]{4,29}$/
    const addressRegex =/^([A-ZČĆŽŠĐ]|[1-9]{1,5})[A-ZČĆŽŠĐa-zčćžšđ\d\-\.\s]+$/
    const cityAndCountryRegex = /\b[A-Z][a-zA-Z]{2,50}(?: [A-Z][a-zA-Z]*)*\b/; 

    document.querySelector('#btnSubmit').addEventListener('click',function (){

        
        if(
            checkField(firstName, 'First name', firstNameRegex) &&
            checkField(lastName, 'Last name', lastNameRegex) &&
            checkField(city, 'City', cityAndCountryRegex) &&
            checkField(country, 'Country', cityAndCountryRegex) &&
            checkField(address, 'Address', addressRegex) 
        ){
            $.ajax({
                url: 'http://localhost:8080/api/users',
                method: 'POST',
                data: {
                    'firstName' : firstName.value,
                    'lastName' : lastName.value,
                    'street' : address.value,
                    'country' : country.value,
                    'city' : city.value,
                },
                dataType: 'json',
                success: function(response) {
                    printMessage(response)
                },
                error: function(error) {
                    console.log(error)
                }
              });
        }
        
    })

    addListenerForField(firstName, 'Name', firstNameRegex, 'blur')
    addListenerForField(lastName, 'Surname', lastNameRegex, 'blur')
    addListenerForField(address, 'Address', addressRegex, 'blur')
    addListenerForField(city, 'City', cityAndCountryRegex, 'blur')
    addListenerForField(country, 'Country', cityAndCountryRegex, 'blur')

}

function fieldValid(field){
    field.parentNode.classList.remove('is-invalid')
    field.previousElementSibling.innerHTML = `<p></p>`
}
 
 function fieldInvalid(field,text){
    field.parentNode.classList.add('is-invalid')
    field.previousElementSibling.innerHTML = `${text}`
}
 
 function checkField(field,fieldName,expression){
    let fieldValue = field.value
    return checkRegex(expression,fieldName,fieldValue,field)
}
 
 function checkRegex(expression,fieldName,fieldValue,field){
 
    if(expression.test(fieldValue)) {
        fieldValid(field)
        return 1
    } else {
        fieldInvalid(field, `<p>${fieldName} isn't as expected!</p>`)
        return 0
    }
 }

function addListenerForField(field, fieldName, expression, event) {
    field.addEventListener(`${event}`,function (){
        checkField(field,fieldName,expression)
    })
}




