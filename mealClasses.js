//All class definitions

class Courze {// this class takes in a csv containing all data of different courses that can be put together to make meals. Based onthe link above... do I even need to make this class?
    constructor(name,inUpcoming,breakfast,lunch,dinner,protein,veggie,grainStarch,dressing,processedProtein,rawVeggie,wholeMeal,snackingFruit,snackingVeggie,snackingProtein,snackingJunk,drink,chineseStoreRequired,meijer,target,amazon,effortLevelAssignment,costLevelAssignment,timeLevelAssignment,eaten,eatenThreshold,soonestNext){
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
        this.effortLevelAssignment = parseInt(effortLevelAssignment);
        this.costLevelAssignment = parseInt(costLevelAssignment);
        this.timeLevelAssignment = parseInt(timeLevelAssignment);
        this.eaten = parseInt(eaten);
        this.eatenThreshold = parseInt(eatenThreshold);
        this.soonestNext = soonestNext;//I hope this works as a date...
        this.vetoedThisShop = false;//this will become true if user votoes this item. This will help with the swap function.
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
        this.end = false;
        if(this.name === "No item will sate your sadistic vetoing"){//to catch the case the user has exhausted all possible replacement options for an item.
            this.end = true;
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
  
  class Day{ //the meal plan will be made out of days which will be made out of meals which will be made out of courses 
    constructor(breakfast, lunch, dinner){
        this.breakfast = breakfast;
        this.lunch = lunch;
        this.dinner = dinner;
    }
  }