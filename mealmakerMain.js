//Holds all buttons and UI event listeners and is the start of the program

function getRowValue(j,row){ //just making the course instantiation more readable, and modifiable if I need to change the type of value to take out of each individual cell
  return row.values[j].formattedValue;
}
function createCourses(response){//takes in the data from the GET request and returns a list of instances of class course
  let rowData = response.sheets[0]?.data[0]?.rowData;//each element in here is the json form of each row in the google sheet.
  let courses = [];//will hold a list of instances of class course
  //let rawCourse = []//used to gather up relevant data per course and then dump into an instance of class course and then emptied and used for the next one.
  for (i in rowData){//for each course (excluding the headers later)
    let row = rowData[i];//let column = 0; //iterator for each column in the spreadsheet 
    courses.push(new Courze(
      getRowValue(0,row),
      getRowValue(1,row),
      getRowValue(2,row),
      getRowValue(3,row),
      getRowValue(4,row),
      getRowValue(5,row),
      getRowValue(6,row),
      getRowValue(7,row),
      getRowValue(8,row),
      getRowValue(9,row),
      getRowValue(10,row),
      getRowValue(11,row),
      getRowValue(12,row),
      getRowValue(13,row),
      getRowValue(14,row),
      getRowValue(15,row),
      getRowValue(16,row),
      getRowValue(17,row),
      getRowValue(18,row),
      getRowValue(19,row),
      getRowValue(20,row),
      getRowValue(21,row),
      getRowValue(22,row),
      getRowValue(23,row),
      getRowValue(24,row),
      getRowValue(25,row),
      getRowValue(26,row)
    ));
    if (courses[i].name === "Omitted because first course is a whole meal"){//scans the list as it is being built for the filler course
        fillerCourse = courses[i];//this is meant to be a global variable that can be used when constructing meals that have one course only
    }else if (courses[i].name.includes("Smoothie")){
        smoothieCourse = courses[i];//global variable for the breakfast smoothie we eat for every breakfast
    }
  }
  return courses;
}
function getData(url){ //GET request that looks at the groceries spreadsheet and returns the data from the only sheet there.
    return new Promise((resolve,reject)=>{
        let request = new XMLHttpRequest();
        request.open("GET", url);
        request.onreadystatechange = () => {
            if (request.readyState === 4){
                if(request.status === 200 || request.status === 201){
                    resolve(JSON.parse(request.response));
                    console.log("resolved");
                }
                else{
                    reject(JSON.parse(request.response));
                    console.log("rejected");
                }
            }
        };
        request.send();
    });
}
function getUserInput(listOfStoreButtons){
  return new Promise((resolve, reject) => {
    let chosenStores = [];//will be filled with the stores that the app will shop from
    for (store in listOfStoreButtons){
        if(shoppingOptionButtons[store].classList.contains('optionClicked')){
            chosenStores.push(shoppingOptionButtons[store].id);
        }
    }
    if(chosenStores.length > 0){
        resolve(chosenStores);
    }else{
      reject(chosenStores);
    }
});
}



async function initiatePlan(listOfStoreButtons,url){ //Weaves user input together with spreadsheet data to create plan and then renders it. Then returns true to start the course interface function
  const chosenStores = await getUserInput(listOfStoreButtons);
  const data = await getData(url);
  let courses = createCourses(data);
  var courseInstances = [];//this will be filled with a list of instances of class course that will be used to make the meal plan based on where the shopper is shopping this time
  var courseInstanceNames = []//this will be filled with a list of names for all instances of class course in the above list
  let snackInstances = [];//will be filled with a list of instances of class course that are considered snacks which will be picked from for the snack menu later
  for (course in courses){
    //the below line looks at the list of instances of class course that was created from the GET request and then looks to see if it can be found where the shopper is shopping today
    let latestCourse = courses[course];
    if(chosenStores.includes("meijer")&& !courseInstanceNames.includes(latestCourse.name) && latestCourse.meijer == true && latestCourse.dressing == false){
        courseInstances.push(latestCourse);//added to the pool of courses that the shoppers meal plan will be chosen from
        courseInstanceNames.push(latestCourse.name);//adds the identifyer for the course that was just added to be tested agains for future courses to avoid duplicates
        if(latestCourse.snackingFruit || latestCourse.snackingVeggie || latestCourse.snackingJunk || latestCourse.snackingProtein || latestCourse.drink){
            snackInstances.push(latestCourse);
        }
    }else if (chosenStores.includes("target") && !courseInstanceNames.includes(latestCourse.name) && latestCourse.target == true && latestCourse.dressing == false){
        courseInstances.push(latestCourse);
        courseInstanceNames.push(latestCourse.name);
        if(latestCourse.snackingFruit || latestCourse.snackingVeggie || latestCourse.snackingJunk || latestCourse.snackingProtein || latestCourse.drink){
            snackInstances.push(latestCourse);
        }
    }else if (chosenStores.includes("amazon") && !courseInstanceNames.includes(latestCourse.name) && latestCourse.amazon == true && latestCourse.dressing == false){
        courseInstances.push(latestCourse);
        courseInstanceNames.push(latestCourse.name);
        if(latestCourse.snackingFruit || latestCourse.snackingVeggie || latestCourse.snackingJunk || latestCourse.snackingProtein || latestCourse.drink){
            snackInstances.push(latestCourse);
        }
    }   
  }
  //for now the number of unique meal days to create and work with is a static thing, but in the future, 
  //the user will be able to indicate the desired time window that they want a plan for. Below this for 
  //loop is where the rendering will occur. Also, the number of days to have inside the calendar is static for now, but will be
  //dynamic in the future.
  coursesThisShop = courseInstances;//global variable for all available courses this shop
  selectedStores = chosenStores;//global variable for specific set of chosen stores for this shop
  
  for (let i = 0; i<3; i++){
    setOfColumnz.push(createDay([],courseInstances,i));//adds all days to the calendar, snacks are added after this loop
  }
  setOfColumnz.push(getSnacks(snackInstances));//getSnacks returns a list that is static and fragile. When users have more flexibility, Ill have to revisit that function
  weeklyBreakdown = [0,0,1,1,2,2,2,3];// means [firstTypeofDay, secondTypeofDay, thirdTypeofDay, snackColmn] this is only hard coded right now because the priority is to get this working, later, the user will determine the number of days they want and the algorithm will figure out the cadence of everything 
  for (i in weeklyBreakdown){
    mealPlan.push(setOfColumnz[weeklyBreakdown[i]]);//pushes class day of each column (including snack column) to the global variable called mealPlan
  }
  //setPortraitGridTemplateAreas(weeklyBreakdown); //this comes later with UI update
  
  renderPlanPage(mealPlan,setOfColumnz);
  renderListPage(mealPlan);
  planPage.style.display = 'flex';
  homePage.style.display = 'none';
  loadingPage.style.display = 'none';
}




function validateInitiator(){// decides based on final "toggled state" to show the "lets go" button and change the userPrompt or not
    const clickedOptions = document.getElementsByClassName('optionClicked');
    const unClickedOptions = document.getElementsByClassName('optionUnclicked');
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
    if(button.classList.contains('optionUnclicked')){
        button.classList.add('optionClicked');
        button.classList.remove('optionUnclicked');
        validateInitiator(); 
    }else{
        button.classList.add('optionUnclicked');
        button.classList.remove('optionClicked');
        validateInitiator();
    }
}

function toggleView(clicked){
    if (clicked.classList.contains('viewOpen')){
        //do nothing
    }else{
        let navMenu = clicked.parentNode;
        let listItems = navMenu.children;
        const arrayItems = Array.from(listItems);
        arrayItems.forEach((item) =>{
            if(item.classList.contains('viewOpen')){//finds the open view and closes it.
                item.classList.remove('viewOpen');
                item.classList.add('viewClosed');
            }
        });
        clicked.classList.add('viewOpen');
    }
    if(clicked.id === 'calendarSelector'){
        document.querySelector('#calendar').style.display = 'grid';
        document.querySelector('#list').style.display = 'none';
    }else{
        document.querySelector('#calendar').style.display = 'none';
        document.querySelector('#list').style.display = 'flex';
    }
}
//the below is the start of the program. The user inputs where they are shopping from and this is used as a filter for building the meal pool later.
url = "https://sheets.googleapis.com/v4/spreadsheets/11aibV_WA-Lq7mQKwM7twxWogzjBBw4K9mRduhP0T_qA/?key=AIzaSyAK643mJ9zPsQcJGi7GMVcXzgPvMJ-O_so&includeGridData=true"
//let courses = getCourses(url);

const meijerButton = document.querySelector('#meijer');
const targetButton = document.querySelector('#target');
const amazonButton = document.querySelector('#amazon');
const beginPlanButton = document.querySelector('#beginPlanButton');
const welcomeMessage = document.querySelector('#Welcome');
const userPrompt = document.querySelector('#userPrompt'); 
const planPage = document.querySelector('#planPage');
const homePage = document.querySelector('#homeContainer');
const loadingPage = document.querySelector('#loadingGif');
const calendarSpace = document.querySelector('#calendar');

var mealPlan = [];//this is a global variable that contains the entire set of courses and snacks that have been chosen,
//stored as a list of columns, each column is a list of days, and each day is a list of instances of class courze. 
//First it gets filled up, then rendered. When any course or snack is selected to be swapped, 
//this variable is selected and then the relevant item is chosen, then the entire page is rerendered based on this now modified global 
//variable. It is importannt that this variable sticks around when teh user is toggling between the views.
let setOfColumnz = [];//this is the meal plan without the ammounts reflected. This variable is just to represent what meals are occurring, not to reflect the number of repeats.
let weeklyBreakdown = [];//will be filled with a list of numbers, encoding which day of meals occurrs on which part of the calendar.
const shoppingOptionButtons = [meijerButton, targetButton, amazonButton];
let selectedStores = [];//will be filled with a list of strings reflecting all selected stores the user chooses before initiating the meal plan.
let coursesThisShop = [];//will be filled with all actual instances of class course (snack or not) that are available at chosen stores. this list will be passed into functions like the swap function and probably others.

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
    loadingPage.style.display = 'grid';
    homePage.style.display = 'none';
    initiatePlan(shoppingOptionButtons,url);//takes in user input, makes all instances of class course, updates global variable mealPlan, and calls renderPlanPage 
});
planPage.addEventListener('click',function(event){
    const clicked = event.target;
    if(clicked.classList.contains('course') || clicked.classList.contains('snack')){
        swapCourse(clicked, coursesThisShop);
        
    }else if(clicked.classList.contains('navButton')){
        toggleView(clicked);
        renderListPage(mealPlan);
        
    }
});

