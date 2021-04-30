const csv = require('csv'); 
const csvParse = require('csv-parse/lib/sync');//found this in documentation for the thing in line 1 https://csv.js.org/parse/
const prompt = require('prompt');//I found this here: https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
var prompt2 = require('prompt-sync')();//found this here https://www.codecademy.com/articles/getting-user-input-in-node-js
class Course {// this class takes in a csv containing all data of different courses that can be put together to make meals. Based onthe link above... do I even need to make this class?
    constructor(name,inUpcoming,breakfast,lunch,dinner,protein,veggie,grainStarch,dressing,processedProtein,rawVeggie,wholeMeal,snackingFruit,snackingVeggie,snackingProtein,snackingJunk,drink,chineseStoreRequired,meijer,target,amazon,denseCooking,costLevelAssignment,timeLevelAssignment,eaten,eatenThreshold,soonestNext){
        function boolify(string){//reads a string to know what bool value to assign to the class property.
            if (string === "TRUE"){
                return true;
            }else if (string === "FALSE"){
                return false;
            }else{
                return string;
            }
        }
        
        this.name = name;
        this.inUpcoming = boolify(inUpcoming);
        this.breakfast = boolify(breakfast);
        this.lunch = boolify(lunch);
        this.dinner = boolify(dinner);    
        this.protein = boolify(protein);
        this.veggie = boolify(veggie);
        this.grainStarch = boolify(grainStarch);
        this.dressing = boolify(dressing);
        this.processedProtein = boolify(processedProtein);
        this.rawVeggie = boolify(rawVeggie);
        this.wholeMeal = boolify(wholeMeal);
        this.snackingFruit = boolify(snackingFruit);
        this.snackingVeggie = boolify(snackingVeggie);
        this.snackingProtein = boolify(snackingProtein);
        this.snackingJunk = boolify(snackingJunk);
        this.drink = boolify(drink);
        this.chineseStoreRequired = boolify(chineseStoreRequired);
        this.meijer = boolify(meijer);
        this.target = boolify(target);
        this.amazon = boolify(amazon);
        this.denseCooking = boolify(denseCooking);
        this.costLevelAssignment = parseInt(costLevelAssignment);
        this.timeLevelAssignment = parseInt(timeLevelAssignment);
        this.eaten = parseInt(eaten);
        this.eatenThreshold = parseInt(eatenThreshold);
        this.soonestNext = soonestNext;//I hope this works as a date...
        

        //////The below properties are not passed in, they are auto generated upon instantiation
        this.usedThisWeek = false;//this is a tag that is only changed to true if this meal is used in the meal plan for this week
        this.times = [];//this gets filled below with all of the relevant times this meal could be eaten during.
        if(this.breakfast){//I am not sure if this is actually where this modification should go...
            this.times.push("Breakfast");
        }if(this.lunch){
            this.times.push("Lunch");
        }if(this.dinner){
            this.times.push("Dinner");
        }

        this.filler = false;
        if (this.name ==="Omitted because protein is whole meal"){
            this.filler = true;
        }

        this.stores = "";
        if(this.meijer){
            this.stores += " Meijer ";
        }if(this.target){
            this.stores += " Target ";
        }if(this.amazon){
            this.stores += " Amazon ";
        }
    }
}

class Meal{ //this class outlines any meal of any day
    constructor(protein, veggie){//the two arguements are instances of class course
        this.proteinCourse = protein;
        this.veggieCourse = veggie;
        this.grainStarch = protein.grainStarch || veggie.grainStarch; // for now with the construction only requireing a protein and veggie, we will just check the possibility if there is starchy stuff in either of those two courses for boolean purposes later in the program.
    }
}

class Day{ //the meal plan widays will be made out of meals which will be made out of courses 
    constructor(breakfast, lunch, dinner){
        this.breakfast = breakfast;
        this.lunch = lunch;
        this.dinner = dinner;
    }
}



//this is a helper function for CreateMeal. It scannes the list of instances of class course that is passed in and returns 
//a newly generated list of instances of class course that contains only courses that meet the requirements based on the other 
//conditions passed in.
function WiddleDownCourses(time, grainStarchAllowed, processedProteinAllowed, needsRawVeggie, Ocourses, type){
    var Pcourses = [];
    for (course in Ocourses){
        if (Ocourses[course].usedThisWeek){//eliminates any courses that are already in the meal plan for the week
            //console.log(Ocourses[course].name + "not chosen for " + time);
            // do nothing
        }else if (type === "veggie" && (!Ocourses[course].veggie || Ocourses[course].wholeMeal)){
            // do nothing
            //console.log(Ocourses[course].name + "not chosen for " + time);
        }else if (type === "protein" && !Ocourses[course].protein){
            // do nothing
            //console.log(Ocourses[course].name + "not chosen for " + time);
        }else if (!Ocourses[course].times.includes(time)){
            // do nothing
            //console.log(Ocourses[course].name + "not chosen for " + time);
        }else if (!grainStarchAllowed && Ocourses[course].grainStarch){
            // do nothing
            //console.log(Ocourses[course].name + "not chosen for " + time);
        }else if (type === "veggie" && needsRawVeggie && !Ocourses[course].rawVeggie){
            // do nothing
            //console.log(Ocourses[course].name + "not chosen for " + time);
        }else if (type === "protein" && !processedProteinAllowed && Ocourses[course].processedProtein){
            // do nothing
            //console.log(Ocourses[course].name + "not chosen for " + time);
        }else{
            Pcourses.push(Ocourses[course]);
            //console.log("new course is: " + Ocourses[course].name);
        }
    }
    return Pcourses;
}


//takes in the time of day that the meal occurrs and if grains are allowed, if processed protein is allowed and if the meal requires raw
//veggies based on the make up of the day so far.
function CreateMeal(time, grainStarchAllowed, processedProteinAllowed, needsRawVeggie, courses){//(string,bool,bool,bool,[list of instances of class meal])
    let veggieCoursePool = WiddleDownCourses(time, grainStarchAllowed, processedProteinAllowed, needsRawVeggie, courses, "veggie");//this will find elidgible veggies for this meal
    let proteinCoursePool = WiddleDownCourses(time, grainStarchAllowed, processedProteinAllowed, needsRawVeggie, courses, "protein");//this will find elidgible proteins for this meal
    let proteinPicker = Math.floor(Math.random()*1000) % proteinCoursePool.length;//random # that could choose any element in the list of proteins
    let veggiePicker = Math.floor(Math.random()*1000) % veggieCoursePool.length;//random # that could choose any element in the list of veggies
    
    let protein = proteinCoursePool[proteinPicker];
    protein.usedThisWeek = true;
    var veggie;

    if (protein.wholeMeal || time == "Breakfast"){
        return new Meal(protein, protein);
        //I am going to ignore the granstarch for now cause we currently aren't really purposeful about including that in our plans right now.
    }else{
        veggie = veggieCoursePool[veggiePicker];
        veggie.usedThisWeek = true; 
        return new Meal(protein, veggie);
        // same for grainstarch above
    }
}

function CreateDay(requiredCourses,coursePool){  //coursePool is a list of instances of class course. For now, requiredCourses will always be an empty array. In the future, when I handle leftovers with this app, it will contain some set of meals, likely some of the leftovers or some of the required foods that were requested in the meal plan.
    let grainStarchAllowed = true;  //this variable and the next two are tags on this day to ensure that the combination of breakfast, lunch & dinner created for this day do not violate the 3 rules (no more than one grain or processed protein a day and atleast one raw veggie per day.)
    let processedProteinAllowed = true;
    let needsRawVeggie = false;
    let day = ['Breakfast', 'Lunch', 'Dinner'];  //this is a list where each element will be replaced with instances of class meal that match each time of day that each instance is replacing.
    for (time in day){  //each iteration creates the next meal of the day, updating the three variables above ensuring that the day follows the three daily rules.
        day[time] = CreateMeal(day[time], grainStarchAllowed, processedProteinAllowed, needsRawVeggie, coursePool);
        grainStarchAllowed = grainStarchAllowed && !day[time].grainStarch;
        processedProteinAllowed = processedProteinAllowed && !day[time].proteinCourse.processedProtein;
        if (time == 1 && !day[time].veggieCourse.rawVeggie){  //if the meal just made is lunch AND it has no raw veggie, then put raw veggies in the next one
            needsRawVeggie = true;
        }
    }
    return new Day (day[0],day[1],day[2]);//returns an instance of class day constructed with 3 instances of class meal
}


function PrintDay (day){
    console.log("\nBreakfast: " +day.breakfast.proteinCourse.stores + day.breakfast.proteinCourse.name +" with "+day.breakfast.veggieCourse.stores + day.breakfast.veggieCourse.name + " and smoothie");
    console.log("Lunch: " +day.lunch.proteinCourse.stores + day.lunch.proteinCourse.name + " with " +day.lunch.veggieCourse.stores + day.lunch.veggieCourse.name);
    console.log("Dinner: "+day.dinner.proteinCourse.stores + day.dinner.proteinCourse.name + " with " +day.dinner.veggieCourse.stores + day.dinner.veggieCourse.name);
}


//the below is the start of the program. The user inputs where they are shopping from and this is used as a filter for building the meal pool later.
console.log('Are you shopping from Meijer today? (Please type "yes" or "no" without quotes.)');
var Meijer = prompt2().toLowerCase();
console.log('Are you shopping from Target today? (Please type "yes" or "no" without quotes.)');
var Target = prompt2().toLowerCase();
console.log('Are you shopping from Amazon today? (Please type "yes" or "no" without quotes.)');
var Amazon = prompt2().toLowerCase();


//This block is using a parser that Will helped me with, I think I will try splitting on commas and manually parsing myself later on.
const fs = require('fs');
const { networkInterfaces } = require('os');
var coursesFromCSV = [];//this is the holding place for the parsed CSV file
const data = fs.readFileSync('/Users/johnkovacs/Desktop/Shiftup/Johnny-Kovacs/Web-Dev-Fundamentals/Unit3/Grocery-Project/items.csv');
coursesFromCSV = csvParse(data);//this is an array containing an array of strings from each new line of the CSV
/*coursesFromCSV.forEach(function(course){
    Course(course[0],course[1],course[2],course[3],course[4],course[5],course[6],course[7],course[8],course[9],course[10],course[11],course[12],course[13],course[14],course[15],course[16],course[17],course[18],course[19],course[20],course[21]);
}) //This is the end of the block that Will got working for me.
*/















/*
//This block is an attempt at having this program read from a google sheet I have
const fetchPromise = fetch('https://docs.google.com/spreadsheets/d/1GUuHyLcQBqBwcRuz_E_eec2ntARi4N4jCs34548Of-s/edit#gid=0')
fetchPromise.then(response => { 
    return response.json();
}).then(data => {
    console.log(data);
});

*/




















var courseInstances =[];//this will be filled with a list of instances of class course
var courseInstanceNames =  []//this will be filled with a list of names for all instances of class course in the above list
for (course in coursesFromCSV){
    //the below line initializes an instance of class course and then looks to see if it can be found where the shopper is shopping today
    let latestCourse =  new Course(coursesFromCSV[course][0],coursesFromCSV[course][1],coursesFromCSV[course][2],coursesFromCSV[course][3],coursesFromCSV[course][4],coursesFromCSV[course][5],coursesFromCSV[course][6],coursesFromCSV[course][7],coursesFromCSV[course][8],coursesFromCSV[course][9],coursesFromCSV[course][10],coursesFromCSV[course][11],coursesFromCSV[course][12],coursesFromCSV[course][13],coursesFromCSV[course][14],coursesFromCSV[course][15],coursesFromCSV[course][16],coursesFromCSV[course][17],coursesFromCSV[course][18],coursesFromCSV[course][19],coursesFromCSV[course][20],coursesFromCSV[course][21],coursesFromCSV[course][22],coursesFromCSV[course][23],coursesFromCSV[course][24],coursesFromCSV[course][25],coursesFromCSV[course][26]);
    
    if(Meijer == "yes" && !courseInstanceNames.includes(latestCourse.name) && latestCourse.meijer == true && latestCourse.dressing == false){
        courseInstances.push(latestCourse);//added to the pool of courses that the shoppers meal plan will be chosen from
        courseInstanceNames.push(latestCourse.name);//adds the identifyer for the course that was just added to be tested agains for future courses to avoid duplicates
    }else if (Target == "yes" && !courseInstanceNames.includes(latestCourse.name) && latestCourse.target == true && latestCourse.dressing == false){
        courseInstances.push(latestCourse);
        courseInstanceNames.push(latestCourse.name);
    }else if (Amazon == "yes" && !courseInstanceNames.includes(latestCourse.name) && latestCourse.amazon == true && latestCourse.dressing == false){
        courseInstances.push(latestCourse);
        courseInstanceNames.push(latestCourse.name);
    }   
}


for (var i = 8; i>0;i--){
    let firstHalf = CreateDay([],courseInstances); //first arguement is empty until I expand functionality
    let secondHalf = CreateDay([],courseInstances);
    PrintDay(firstHalf);
    PrintDay(secondHalf);
}