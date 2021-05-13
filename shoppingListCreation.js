//This file contains all shopping list constructing functions


function GetItemOrigin(item,listOfLists){//takes in instance of class course and returns a string representing the store it comes from. In the case of multiple stores, it will try to return Target first, then Meijer, then Amazon.
    if (item.target && selectedStores.includes("target")){
        listOfLists[0].push(item);
    }else if(item.meijer && selectedStores.includes("meijer")){
        listOfLists[1].push(item);
    }else if(item.amazon && selectedStores.includes("amazon")){
        listOfLists[2].push(item);
    }
    return listOfLists;
}

function getLists(mealPlan){
    let targetList = [];
    let meijerList = [];
    let amazonList = [];
    let listOfLists = [targetList,meijerList,amazonList];
    for (let i = 0; i<mealPlan.length - 1; i++){   //looks at each day (not the snack column) and gets all courses form the whole day added to the listOfLists
        listOfLists = GetItemOrigin(mealPlan[i].breakfast.proteinCourse, listOfLists);
        listOfLists = GetItemOrigin(mealPlan[i].breakfast.veggieCourse, listOfLists);
        listOfLists = GetItemOrigin(mealPlan[i].lunch.proteinCourse, listOfLists);
        listOfLists = GetItemOrigin(mealPlan[i].lunch.veggieCourse, listOfLists);
        listOfLists = GetItemOrigin(mealPlan[i].dinner.proteinCourse, listOfLists);
        listOfLists = GetItemOrigin(mealPlan[i].dinner.veggieCourse, listOfLists);
    }
    listOfLists = GetItemOrigin(mealPlan[mealPlan.length -1][0][0], listOfLists);//really think this is yucky, but this is what I get for not making the snacklist conform to the structure of class day...
    listOfLists = GetItemOrigin(mealPlan[mealPlan.length -1][0][1], listOfLists);//these are adding all the chosen snacks to the list
    listOfLists = GetItemOrigin(mealPlan[mealPlan.length -1][1][0], listOfLists);
    listOfLists = GetItemOrigin(mealPlan[mealPlan.length -1][1][1], listOfLists);
    listOfLists = GetItemOrigin(mealPlan[mealPlan.length -1][2], listOfLists);
    return listOfLists;
}