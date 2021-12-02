/*
submit name for prediction
user enters name in textbox and clicks on the submit button
by clicking the button, the name (if valid) is passed to the genderize api
the response should be processed and the predicted gender and its precision should be reported
 */
async function assigngender() {
    let name_element = document.getElementById('name'); //access input box as an element
    let name = name_element.value; //gets the value aka the user input
    if(localStorage.getItem(name) != null){
        document.getElementById('saved').innerHTML = localStorage.getItem(name) //if there is a saved suggestion, show it
    }else {
        document.getElementById('saved').innerHTML = "---"
    }
    let entry = {name: '', gender: '', precision: 0};
    await fetch('https://api.genderize.io/?name=' + name) //sending GET request
        .then(response => response.json()) //extract the json from the response
        .then(response => {
            // save the needed information in an object
            entry.name = response['name'];
            entry.gender = response['gender'];
            entry.precision = response['probability'];
        });
    document.getElementById('g').innerHTML = entry.gender; //show the predicted gender in html
    document.getElementById('p').innerHTML = entry.precision; // show the precision of prediction in html
    return entry.gender
}

/*
save predicted answer or save user's suggestion in local storage
 */
async function savegender(){
    let option_element = document.getElementsByName('gender'); //get the radio options
    let name = document.getElementById('name').value; //access input box value
    let option_value;
    for(let i = 0; i < option_element.length; i++){ //get the value of the radio button that is checked
        if(option_element[i].checked){
            option_value = option_element[i].value;
            break
        }
    }
    if(option_value === 'P'){
        let pred = await assigngender()
        localStorage.setItem(name, pred) //save user's suggestion in local storage
    } else{
        localStorage.setItem(name, option_value) //save user's suggestion in local storage
    }
    document.getElementById('saved').innerHTML = localStorage.getItem(name)
}

/*
clear the saved gender for a name from local storage
 */
function removedata(){
    let name = document.getElementById('name').value; //access input box value
    localStorage.removeItem(name)
    document.getElementById('saved').innerHTML = "---" //when the saved gender is cleared, then nothing is saved
}
