/*
show error div when error occurs and hide it after 4 seconds
 */

let timer;
function showError(message) {
    if (timer !== null) {
        // Clear previous timeout:
        clearTimeout(timer);
        timer = null;
    }
    let errorElement = document.getElementById("error");
    errorElement.innerHTML = message;
    errorElement.style.visibility = 'visible';
    timer = setTimeout(function(){ errorElement.style.visibility = 'hidden'; }, 4000);
}

/*
submit name for prediction
user enters name in textbox and clicks on the submit button
by clicking the button, the name (if valid) is passed to the genderize api
the response should be processed and the predicted gender and its precision should be reported
 */
async function assignGender() {
    let name_element = document.getElementById('name'); //access input box as an element
    let name = name_element.value; //gets the value aka the user input
    if(!checkName(name)){
        showError("Name is not valid, make sure the field is not empty and has only letters and spaces")
        return
    }
    let entry = {name: '', gender: '', precision: 0};

    let flag;
    await fetch('https://api.genderize.io/?name=' + name) //sending GET request
        .then(response => response.json()) //extract the json from the response
        .then(response => {
            // save the needed information in an object
            entry.name = response['name'];
            entry.gender = response['gender'];
            entry.precision = response['probability'];
        }).catch((error) => {
            showError("There was a problem! (details: " + error.toString() + ")");
            flag = 1
        });
    if (flag === 1){
        return
    }
    if (! entry.gender){
        showError("Server was unable to predict the gender of this name!")
        return
    }
    document.getElementById('g').innerHTML = entry.gender; //show the predicted gender in html
    document.getElementById('p').innerHTML = entry.precision; // show the precision of prediction in html

    if(localStorage.getItem(name) != null){
        document.getElementById('saved').innerHTML = localStorage.getItem(name) //if there is a saved suggestion, show it
    }else {
        document.getElementById('saved').innerHTML = "---"
    }

    return entry.gender
}

/*
save predicted answer or save user's suggestion in local storage
 */
async function saveGender(){
    let option_element = document.getElementsByName('gender'); //get the radio options
    let name = document.getElementById('name').value; //access input box value
    if(!checkName(name)){
        document.getElementById('saved').innerHTML = "---"
        showError("Name is not valid, make sure the field is not empty and has only letters and spaces")
        return
    }
    let option_value;
    for(let i = 0; i < option_element.length; i++){ //get the value of the radio button that is checked
        if(option_element[i].checked){
            option_value = option_element[i].value;
            break
        }
    }
    if(option_value === 'P'){
        let pred = await assignGender()
        if (! pred){
            return
        } else {
            localStorage.setItem(name, pred) //save user's suggestion in local storage
        }
    } else{
        localStorage.setItem(name, option_value) //save user's suggestion in local storage
    }
    document.getElementById('saved').innerHTML = localStorage.getItem(name)
}

/*
clear the saved gender for a name from local storage
 */
function removeData(){
    let name = document.getElementById('name').value; //access input box value
    localStorage.removeItem(name)
    document.getElementById('saved').innerHTML = "---" //when the saved gender is cleared, then nothing is saved
}

/*
checks whether the user input is valid or not
 */
function checkName(name){
    let regExpression = /^[a-zA-Z\s]*$/; // only letters and space
    return !(name.length <= 0 || name.length > 255 || !regExpression.test(name));
}
