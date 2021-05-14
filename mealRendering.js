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
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    if(width > 780){
        button.style.fontSize = Math.sqrt(name.split(" ").length)*.4*100/Math.sqrt(name.visualLength()*(name.split(" ").length)) + "vmin";
    }else{
        button.style.fontSize = Math.sqrt(name.split(" ").length)*.4*100/Math.sqrt(name.visualLength()*(name.split(" ").length)) + "vmin";
    }
    //button.style.fontSize = Math.sqrt(name.split(" ").length)*.4*100/Math.sqrt(name.visualLength()*(name.split(" ").length)) + "vmin";
    //in the line above I did my best to get the font to change to make the title of the food fit the actual contianer it has
    if (type === "snack"){
        button.kind = "snack";
        button.classList.add("snack");
    }else{
        button.kind = "course";
    }
}
//takes in instance of class day, and a string naming breakfast, lunch or dinner, and the days location in the global meal plan array and returns a div containing buttons with the
//proper names on them (the div is also formatted correctly)
function renderMeal(day,time,location,weeklyBreakdown){
    //weeklyBreakdown was included in the inputs but is currently not being used. I was mid construction of the new revamped UI when I 
    //moved into cleaning up the project to put it into presentation mode. When I go back to updating the UI, it will be used. The 
    //following 3 lines of code are a part of my workflow for that big UI update, so I kept them here for now aswell.
    // console.log("here is the --portraitTemplateAreas");
    // console.log(document.querySelector(":root").style.getPropertyValue('--portraitTemplateAreas'));
    // console.log(weeklyBreakdown);

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
    //addCssClassForGridAreaTemplate(mealDiv, weeklyBreakdown, time, location); this will be active when the new UI is functional
    
    mealDiv.appendChild(proteinButton);
    if (!filler){
        mealDiv.appendChild(veggieButton); 
        mealDiv.classList.add('mealWith2Courses');      //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
        return mealDiv;
    }
    //will need to add starch button when I add starches to the meals.
    mealDiv.classList.add('mealWith1Courses'); //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
    return mealDiv;
}

function renderSnack(day,time,location,weeklyBreakdown){
    //weeklyBreakdown was included in the inputs but is currently not being used. I was mid construction of the new revamped UI when I 
    //moved into cleaning up the project to put it into presentation mode. When I go back to updating the UI, it will be used.
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
        mealDiv.classList.add('mealWith2Courses');      //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
        mealDiv.style.border = 'none';//no border in snack region
        return mealDiv;
    }
    //will need to add starch button when I add starches to the meals.
    mealDiv.classList.add('mealWith1Courses'); //assigns the proper style so that the number of grid rows inside the day matches the number of courses.
    mealDiv.style.border = 'none';//no border in snack region
    return mealDiv;
}

// takes in an instance of class day and returns an HTML version of the day to be pushed into the dom
// each day will be broken down into 3 sets of names. 
function renderDay(plan,location,weeklyBreakdown){ //location is an integer which is only passed in to set a unique id on each course button that gets created in the calendar
    let day = plan[location];
    let columnDivs = [];
    if(location == 7){
        let breakfastDiv = renderSnack(day,"breakfast",location,weeklyBreakdown); 
        let lunchDiv = renderSnack(day,"lunch",location,weeklyBreakdown);        
        let dinnerDiv = renderSnack(day,"dinner",location,weeklyBreakdown);
        columnDivs = [breakfastDiv,lunchDiv,dinnerDiv];
    }else{
        let breakfastDiv = renderMeal(day,"breakfast",location,weeklyBreakdown); 
        let lunchDiv = renderMeal(day,"lunch",location,weeklyBreakdown);        
        let dinnerDiv = renderMeal(day,"dinner",location,weeklyBreakdown);
        columnDivs = [breakfastDiv,lunchDiv,dinnerDiv];
    }
    return columnDivs;
}


function renderPlanPage(currentPlan,weeklyBreakdown){
  const calendarDiv = document.querySelector('#calendar');
  while(calendarDiv.firstChild){//clears out the calendar before rendering a new one.
      calendarDiv.removeChild(calendarDiv.firstChild);
  }
  let initialCalendarStrings = ["","Mon","Tue","Wed","Thu","Fri","Sat","Sun","Snacks","B"];
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
  let lunchLabelDiv = document.createElement("div");
  let dinnerLabelDiv = document.createElement("div");
  lunchLabelDiv.innerHTML = 'L';
  dinnerLabelDiv.innerHTML = 'D';
  lunchLabelDiv.classList.add('title');
  dinnerLabelDiv.classList.add('title');
  let calendar = [];
  for (a in currentPlan){
      calendar.push(renderDay(currentPlan,a,weeklyBreakdown));
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

function renderStoreList(groceryList,position){
    const listPage = document.querySelector('#list')
    let list = document.createElement('div'); 
    let title = document.createElement('div');
    title.classList.add('listTitle');
    list.appendChild(title);
    list.classList.add('listSection');
    let condencedList = {};//will be filled with keys of unique instances of class course and each key maps to how many meals worth of those courses are needed.
    for (item in groceryList){
        if(groceryList[item].name in condencedList){//if the item is in the list already, then the number needs to be increased
            let nameOfItem = groceryList[item].name;
            condencedList[nameOfItem] ++;
        }else{
            let nameOfItem = groceryList[item].name;
            condencedList[nameOfItem] = 1;//if item is not in the list already, we add it and say there is only 1 so far
        }
    }
    if(position == 0){ // gives appropriate title to list
        title.innerHTML = "Target";
    }else if(position == 1){
        title.innerHTML = "Meijer";
    }else if(position == 2){
        title.innerHTML = "Amazon";
    }
    Object.entries(condencedList).forEach(([key, value]) => {
        let newItem = document.createElement('div');
        newItem.innerHTML = value + " meals worth of " + key;
        newItem.classList.add('listItem');
        list.appendChild(newItem);
    }); 
    listPage.appendChild(list);

}

function renderListPage(incomingPlan){
    let lists = getLists(incomingPlan);//returns a list of lists of instances of class course: [[Target items],[Meijer items],[Amazon items]]
    const listDiv = document.querySelector('#list');
    while(listDiv.firstChild){//clears out the list page before rendering a new one.
        listDiv.removeChild(listDiv.firstChild);
    }
    let numberOfLists = 0;
    for(i in lists){
        if(lists[i].length > 0){
            renderStoreList(lists[i],i);//makes displayable list for this particular store, noting which position it came from (0=target, 1=meijer, 2=amazon)
            numberOfLists ++;
        }
    }
    document.querySelector(':root').style.setProperty('--numberOfLists', numberOfLists);


}


/*





The below is for the UI update that will merge all identical, consecutive days






function getLandscapeGridTemplateAreas(scheduleOrder){
    let landscapeAreas = [];//will be filled with a list of strings [row1 of areas, row2 of areas, row3 areas] in landscape areas, each row is the time of day [breakfast, lunch, dinner]
    let landscapeRow0 = "T0";//will be constructed alongside the first meaningfull row, T_ meaning the top left corner which always has nothing
    let landscapeRowCounter = 0;//this is for the landscape mode knowing which 
    for (i in scheduleOrder){
        if (i === 0){//only here is the first row of each mode needing to be constructed
            for(i in scheduleOrder){
              
                landscapeRow0 += " TD" + dayNumber;//means "TDay#" (Mon, Tues, etc.) numbers distinguish between days
            }
            landscapeAreas.push(landscapeRow0);
            landscapeAreas.push("TB");
            landscapeAreas.push("TL");//these then get added as starters for the rest of the table
            landscapeAreas.push("TS");
        }
        let landscapeRowConstructor = landscapeAreas;
        
    }
}
function setPortraitGridTemplateAreas (scheduleOrder){//takes in the weekly breakdown (which is a list of integers) of which unique meals are occurring when, and returns the strings that the grid template areas for the portrait mode (later, I will do the ones for landscape mode)
    let portraitAreas = '"T0 TB TL TS" ';////S is for supper since D was already being used for day lol
    for (i in scheduleOrder){
        let portraitRowBuilder = '"TD'+ i + ' ';//starts off with a new day every time
        portraitRowBuilder += 'B'+ (scheduleOrder[i]) + ' ' + 'L'+ (scheduleOrder[i]) + ' ' + 'S'+ (scheduleOrder[i] + '" '); 
        portraitAreas+=portraitRowBuilder;
        console.log(portraitRowBuilder);
    }
    console.log("PA: "+ portraitAreas);
    document.querySelector(':root').style.setProperty('--portraitTemplateAreas', portraitAreas);
}

addCssClassForGridAreaTemplate(mealDiv, weeklyBreakdown, time, location){
    if (time === "breakfast"){ // these are to put the right class on the meal so that they can go into all necessary grid areas
        CSSclass = "B" + weeklyBreakdown[location];
        var style = document.createElement('style');
        //style.type = 'text/css';
        style.innerHTML = "."+CSSclass + "  { grid-area: " + CSSclass + ";";
        mealDiv.classList.add(CSSclass);
        console.log("CSSclass: "+ CSSclass);
    }else if (time === "lunch"){
        CSSclass = "L" + weeklyBreakdown[location];
        var style = document.createElement('style');
        //style.type = 'text/css';
        style.innerHTML = "."+CSSclass + "  { grid-area: " + CSSclass + ";";
        mealDiv.classList.add(CSSclass);
        console.log("CSSclass: "+ CSSclass);
    }else if (time === "dinner"){
        CSSclass = "S" + weeklyBreakdown[location];
        var style = document.createElement('style');
        //style.type = 'text/css';
        style.innerHTML = "."+CSSclass + "  { grid-area: " + CSSclass + ";";
        mealDiv.classList.add(CSSclass);
        console.log("CSSclass: "+ CSSclass);
    }
}
*/
