//All functions associated with rendering

String.prototype.visualLength = function(){
    var ruler = document.querySelector("#ruler");
    ruler.innerHTML = this;
    return ruler.offsetWidth;
}

function longestWordLength(string){
    let words = string.split(" ");
    let longestWord = "";
    for (w in words){
        if (words[w].visualLength() > longestWord.visualLength()){
            longestWord = words[w];
        }
    }
    return longestWord.visualLength;
}

function renderMealHelper(item, button, location, type){//takes in the string value of a name of a course and does all necessary operations on the button for it in the dom
    let name = item.name;
    button.innerHTML = name;
    button.location = location;//this assigns the location to an arbirary property to be used later
    button.item = item; //this assignes an arbitrary property to each button in the plan so that the instance of class course is more easily accessible when swapping the course if necessary
    button.setAttribute("id", name + "_" + location);//note that location comes in as an integer so I am counting on
    button.style.fontSize = Math.sqrt(name.split(" ").length)*.4*100/Math.sqrt(name.visualLength()*(name.split(" ").length)) + "vmin";
    //in the line above I did my best to get the font to change to make the title of the food fit the actual contianer it has
    if (type === "snack"){
        button.kind = "snack";
        button.classList.add("snack");
    }else{
        button.kind = "course";
    }
}
//takes in instance of class day, and a string naming breakfast, lunch or dinner, and returns a div containing buttons with the
//proper names on them (the div is also formatted correctly)
function renderMeal(day,time,location){
    let proteinButton = document.createElement("BUTTON");
    proteinButton.classList.add('course');
    let veggieButton = document.createElement("BUTTON");
    veggieButton.classList.add('course');
    //let starchButton = document.createElement("BUTTON");//this one does not apply yet
    let filler = false;//toggled on if we find a filler course had to be used. We will not render a filler course.
    if (time ==="breakfast"){
        renderMealHelper(day.breakfast.proteinCourse, proteinButton, location, "course");
        renderMealHelper(day.breakfast.veggieCourse, veggieButton, location, "course");
        //starch does not apply yet
    }else if(time === "lunch"){
        renderMealHelper(day.lunch.proteinCourse, proteinButton, location, "course");
        renderMealHelper(day.lunch.veggieCourse, veggieButton, location, "course");
        //starch does not apply yet
        if (day.lunch.veggieCourse.name === "Omitted because first course is a whole meal"){
            filler = true;
        }
    }else{
        renderMealHelper(day.dinner.proteinCourse, proteinButton, location, "course");
        renderMealHelper(day.dinner.veggieCourse, veggieButton, location, "course");
        if (day.dinner.veggieCourse.name === "Omitted because first course is a whole meal"){
            filler = true;
        }
        //starchButton.innerHTML = day.breakfast.starchCourse.name; //this one does not apply yet
    }
    let mealDiv = document.createElement("div");
    mealDiv.appendChild(proteinButton);
    if (!filler){
        mealDiv.appendChild(veggieButton); 
        mealDiv.classList.add('day2');      //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
        return mealDiv;
    }
    //will need to add starch button when I add starches to the meals.
    mealDiv.classList.add('day1'); //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
    return mealDiv;
}

function renderSnack(day,time,location){
    let firstButton = document.createElement("BUTTON");
    firstButton.classList.add('snack');
    let secondButton = document.createElement("BUTTON");
    secondButton.classList.add('snack');
    let filler = false;//toggled on if we find a filler course had to be used. We will not render a filler course.
    if (time ==="breakfast"){//these are just related to what row the snacks will end up in
        renderMealHelper(day[0][0], firstButton, location, "snack");
        renderMealHelper(day[0][1], secondButton, location, "snack");
    }else if(time === "lunch"){
        renderMealHelper(day[1][0], firstButton, location, "snack");
        renderMealHelper(day[1][1], secondButton, location, "snack");
    }else{
        renderMealHelper(day[2], firstButton, location, "snack");
        filler = true;
    }
    let mealDiv = document.createElement("div");
    mealDiv.appendChild(firstButton);
    if (!filler){
        mealDiv.appendChild(secondButton); 
        mealDiv.classList.add('day2');      //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
        mealDiv.style.border = 'none';//no border in snack region
        return mealDiv;
    }
    //will need to add starch button when I add starches to the meals.
    mealDiv.classList.add('day1'); //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
    mealDiv.style.border = 'none';//no border in snack region
    return mealDiv;
}

// takes in an instance of class day and returns an HTML version of the day to be pushed into the dom
// each day will be broken down into 3 sets of names. 
function renderDay(day,location){ //location is an integer which is only passed in to set a unique id on each course button that gets created in the calendar
    let columnDivs = [];
    if(location == 7){
        console.log("went in");
        let breakfastDiv = renderSnack(day,"breakfast",location); 
        let lunchDiv = renderSnack(day,"lunch",location);        
        let dinnerDiv = renderSnack(day,"dinner",location);
        columnDivs = [breakfastDiv,lunchDiv,dinnerDiv];
    }else{
        let breakfastDiv = renderMeal(day,"breakfast",location); 
        let lunchDiv = renderMeal(day,"lunch",location);        
        let dinnerDiv = renderMeal(day,"dinner",location);
        columnDivs = [breakfastDiv,lunchDiv,dinnerDiv];
    }
    return columnDivs;
}


function renderPlanPage(currentPlan){
  const calendarDiv = document.querySelector('#calendar');
  while(calendarDiv.firstChild){//clears out the calendar before rendering a new one.
      calendarDiv.removeChild(calendarDiv.firstChild);
  }
  let initialCalendarStrings = ["","Mon","Tues","Wed","Thurs","Fri","Sat","Sun","Snacks","B"];
  for (i in initialCalendarStrings){
      let newCell = document.createElement("div");
      newCell.innerHTML = initialCalendarStrings[i];
      newCell.classList.add('title');
      if(initialCalendarStrings[i] === "Snacks"){
          newCell.classList.add("SnackTitle");
      }else if (initialCalendarStrings[i] === "B"){
          newCell.classList.add("bLabel");
      }
      calendarDiv.appendChild(newCell);
  }
  //let calendarDayz = 7; //purposefully leaving out the snack column
  let lunchLabelDiv = document.createElement("div");
  let dinnerLabelDiv = document.createElement("div");
  lunchLabelDiv.innerHTML = 'L';
  dinnerLabelDiv.innerHTML = 'D';
  lunchLabelDiv.classList.add('title');
  dinnerLabelDiv.classList.add('title');
  let calendar = [];
  for (a in currentPlan){
      calendar.push(renderDay(currentPlan[a],a));
  }
  let columnCounter = 0; //this is to make sure that the title div is entered after the snack column element from the calendar list above
  let referencer = 0;//being the index holding each div within each day in the calendar. 0=breakfast, 1=lunch, 2=dinner
  while (referencer < 3){//this will create dom elements and put them in the dom
    for(day in calendar){
        calendarDiv.appendChild(calendar[day][referencer]);
        columnCounter++;
        if (columnCounter === 8){
            if(referencer === 0){
            calendarDiv.appendChild(lunchLabelDiv);
            }else if(referencer === 1){
                calendarDiv.appendChild(dinnerLabelDiv);
            }
        referencer++;//because all of the breakfasts (or lunches) would have been added already. 
        columnCounter = 0;   
        }
    }
  }
}