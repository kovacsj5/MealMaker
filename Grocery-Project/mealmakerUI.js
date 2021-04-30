

function validateInitiator(){// decides based on final "toggled state" to show the "lets go" button and change the userPrompt or not
    const clickedOptions = document.getElementsByClassName('option_clicked');
    const unClickedOptions = document.getElementsByClassName('option_unclicked');
    if(clickedOptions[0] == null){
        beginPlanButton.style.display = 'none';
        welcomeMessage.style.display = 'grid';
        userPrompt.textContent = "Where are you shopping from today?";
    }else if(unClickedOptions[0] == null){
        beginPlanButton.style.display = 'grid';
        welcomeMessage.style.display = 'none';
        userPrompt.textContent = "You are shopping from everywhere!";
    }else{
        beginPlanButton.style.display = 'grid';
        welcomeMessage.style.display = 'none';
        userPrompt.textContent = "Anywhere else?";
    }
}


function toggleSelection(button){//toggles on or off the button that was clicked no matter what it's initial state was
    if(button.classList.contains('option_unclicked')){
        button.classList.add('option_clicked');
        button.classList.remove('option_unclicked');
        validateInitiator(); 
    }else{
        button.classList.add('option_unclicked');
        button.classList.remove('option_clicked');
        validateInitiator();
    }
}

console.log("Here is a message");
const meijerButton = document.querySelector('#meijer');
const targetButton = document.querySelector('#target');
const amazonButton = document.querySelector('#amazon');
const beginPlanButton = document.querySelector('#beginPlanButton');
const welcomeMessage = document.querySelector('#Welcome');
const userPrompt = document.querySelector('#userPrompt'); 
const calendarPage = document.querySelector('#calendarContainer');
const homePage = document.querySelector('#homeContainer');
let shoppingOptionButtons = [meijerButton, targetButton, amazonButton];
meijerButton.addEventListener('click',()=>{
    toggleSelection(meijerButton);
});
targetButton.addEventListener('click',()=>{
    toggleSelection(targetButton);
});
amazonButton.addEventListener('click',()=>{
    toggleSelection(amazonButton);
});
beginPlanButton.addEventListener('click',()=>{
    let chosenStores = [];//will be filled with the stores that the app will shop from
    for (store in shoppingOptionButtons){
        if(shoppingOptionButtons[store].classList.contains('option_clicked')){
            chosenStores.push(shoppingOptionButtons[store].id);
        }
    }
    calendarPage.style.display = 'grid';
    homePage.style.display = 'none';
});
