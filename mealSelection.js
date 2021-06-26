//All functions associated with what courses are actually chosen for rendering

//shuffling function found here https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


//takes in a list of available snacks from stores for this shop and returns the ones chosen for this shop
function getSnacks(snackInstances){
    let snackList = [];//to be filled with a snack of every category (veggie, fruit, protein, junk & drink) and then returned
    let fruits = [];
    let veggies = [];
    let proteins = [];
    let junks = [];
    let drinks = [];
    for (snack in snackInstances){
        if(snackInstances[snack].snackingFruit){
            fruits.push(snackInstances[snack])
            snackInstances.splice(snack,1);
        }else if(snackInstances[snack].snackingVeggie){
            veggies.push(snackInstances[snack])
            snackInstances.splice(snack,1);
        }else if(snackInstances[snack].snackingProtein){
            proteins.push(snackInstances[snack])
            snackInstances.splice(snack,1);
        }else if(snackInstances[snack].snackingJunk){
            junks.push(snackInstances[snack])
            snackInstances.splice(snack,1);
        }else if(snackInstances[snack].drink){
            drinks.push(snackInstances[snack])
            snackInstances.splice(snack,1);
        }
    }
    let lists = [fruits, veggies, proteins, junks, drinks];
    for (set in lists){
        let number = Math.floor(Math.random()*1000) % lists[set].length;//picks random number
        let selection = lists[set][number]//picks the snack from each list at index of the random number above
        snackList.push(selection);//adds selection to the list of snacks that will be returned
    }
    let groupedSnackList = [[snackList[0],snackList[1]],[snackList[2],snackList[3]],snackList[4]]//they are grouped like this to match a list of lists as the days are for the calendar view.
    return groupedSnackList;
}

//this is a helper function for CreateMeal. It scannes the list of instances of class course that is passed in and returns 
//a newly generated list of instances of class course that contains only courses that meet the requirements based on the other 
//conditions passed in.
function WiddleDownCourses(time, grainStarchAllowed, processedProteinAllowed, needsRawVeggie, Ocourses, type){
    var Pcourses = [];
    for (course in Ocourses){
        if (Ocourses[course].usedThisWeek){//eliminates any courses that are already in the meal plan for the week
            // do nothing
        }else if (type === "veggie" && (!Ocourses[course].veggie || Ocourses[course].wholeMeal)){
            // do nothing
        }else if (type === "protein" && !Ocourses[course].protein){
            // do nothing
        }else if (!Ocourses[course].times.includes(time)){
            // do nothing
        }else if (!grainStarchAllowed && Ocourses[course].grainStarch){
            // do nothing
        }else if (type === "veggie" && needsRawVeggie && !Ocourses[course].rawVeggie){
            // do nothing
        }else if (type === "protein" && !processedProteinAllowed && Ocourses[course].processedProtein){
            // do nothing
        }else{
            Pcourses.push(Ocourses[course]);
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
    if (time == "Breakfast"){
        return new Meal(protein, smoothieCourse);
        //I am going to ignore the granstarch for now cause we currently aren't really purposeful about including that in our plans right now.
    }else if(protein.wholeMeal){
      return new Meal(protein, fillerCourse);
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
  
  //takes in two instances of class course (being snacks) and sees if snack 2 is a reasonable replacement for snack1 in the meal plan
  function matchingSnackProfile(snack1, snack2){
      if(snack1.snackingFruit !== snack2.snackingFruit){return false;}
      else if(snack1.snackingVeggie !== snack2.snackingVeggie){return false;}
      else if(snack1.snackingProtein !== snack2.snackingProtein){return false;}
      else if(snack1.snackingJunk !== snack2.snackingJunk){return false;}
      else if(snack1.drink !== snack2.drink){return false;}
      return true;//only if it passed the above tests
  }
  
  //takes in two instances of class course and sees if item 2 is a reasonable replacement for item 1 in the meal plan
  function matchingCourseProfile(item1, item2){
      if (item1.breakfast !== item2.breakfast){return false;}
      else if(item1.lunch !== item2.lunch){return false;}
      else if(item1.dinner !== item2.dinner){return false;}
      else if(item1.protein !== item2.protein){return false;}
      else if(item1.veggie !== item2.veggie){return false;}
      else if(item1.grainStarch !== item2.grainStarch){return false;}
      else if(item1.processedProtein !== item2.processedProtein){return false;}
      else if(item1.rawVeggie !== item2.rawVeggie){return false;}
      return true;//only if it passed the above tests
  
  }
  
  //takes in course and list of all possible courses available this shop and finds a valid replacement for the passed in course (works for snacks too)
  function replacementFinder(course, type, availableCourses){

      let exhaustedMenuMessage = null;//will be made into the dummy course for use if all courses have been vetoed by user
      if(type === "snack"){
          for (i in availableCourses){
              if (availableCourses[i].name === "No item will sate your sadistic vetoing"){
                  exhaustedMenuMessage = availableCourses[i];
              }
              if(matchingSnackProfile(course, availableCourses[i]) && availableCourses[i].vetoedThisShop === false && availableCourses[i].usedThisWeek === false){
                availableCourses[i].usedThisWeek = true;
                return availableCourses[i];
              }
          }
          return exhaustedMenuMessage;//if nothing else
      }else{//must be course in calendar
          for (i in availableCourses){
              if (availableCourses[i].name === "No item will sate your sadistic vetoing"){
                  exhaustedMenuMessage = availableCourses[i];
              }
              if(matchingCourseProfile(course, availableCourses[i]) && availableCourses[i].vetoedThisShop === false && availableCourses[i].usedThisWeek === false){
                availableCourses[i].usedThisWeek = true;
                return availableCourses[i];
              }
          }
      }
      return exhaustedMenuMessage; // if nothing else
  }
  
  //this function takes in the selected button, and locates a all identical button and replaces them with buttons representing different items (with the same profile) than before
  function swapCourse(button, availableCourses, currentPlan){
    shuffleArray(availableCourses); //makes the order of the replacement suggestions not show up in the same order every time the program is ran.
    let item = button.item;//gets instance of class course associated with this button.
    if(item.name !== "No item will sate your sadistic vetoing"){//this way, even if the user vetoes the joke item, it will stay for the duration of the user experience, since there would literally be nothing else to replace that spot in the calendar that the user hasn't already vetoed.
        for (i in availableCourses){
            if (item.name === availableCourses[i].name){
                availableCourses[i].vetoedThisShop = true;//this marks the instance of class course that is in available courses as vetoed if it matches the actual item that was vetoed
                availableCourses[i].usedThisWeek = false;
            }
        }
    }
    //let parent = button.parentNode; There is some work to be done here to find all identical buttons on the calendar in order to replace those too.
    let replacementItem = replacementFinder(item, button.kind, availableCourses);
    if(button.kind === "snack"){//there is only one instance of each snack in the entire plan, so there is no need to sift through the entire page to look for more than one instance
        for(i in currentPlan[currentPlan.length-1]){
            if(i<2){//first two rows of the snacklist are lists of length 2 items each
                for(h in currentPlan[currentPlan.length-1][i]){
                    if(currentPlan[currentPlan.length-1][i][h].name === item.name){
                    currentPlan[currentPlan.length-1][i][h] = replacementItem;
                    }
                }
            }
            else{//for the item in the third row
                if(currentPlan[currentPlan.length-1][i].name === item.name){
                    currentPlan[currentPlan.length-1][i] = replacementItem;
                }
            }
            //this will be tricky... Ill have to be mindful of the fact that there could be one or two things in each of the three parts of the last element in currentPlan which is snacks
        }
    }else{
        let j = 0;//starting column
        while (j < currentPlan.length - 2){//while column counter is not the snack column
            if(currentPlan[j].breakfast.proteinCourse.name === item.name){//all of these sift through each column in the calendar and locate where the item to be replaced is located currently in the calendar
                currentPlan[j].breakfast.proteinCourse = replacementItem;
            }else if(currentPlan[j].breakfast.veggieCourse.name === item.name){
                currentPlan[j].breakfast.veggieCourse = replacementItem;
            }else if(currentPlan[j].lunch.proteinCourse.name === item.name){
                currentPlan[j].lunch.proteinCourse = replacementItem;
            }else if(currentPlan[j].lunch.veggieCourse.name === item.name){
                currentPlan[j].lunch.veggieCourse = replacementItem;
            }else if(currentPlan[j].dinner.proteinCourse.name === item.name){
                currentPlan[j].dinner.proteinCourse = replacementItem;
            }else if(currentPlan[j].dinner.veggieCourse.name === item.name){
                currentPlan[j].dinner.veggieCourse = replacementItem;
            }
            j++;
        }
    } 
    renderPlanPage(currentPlan);
    renderListPage(currentPlan);
  }