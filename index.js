const JavascriptRoster = {

    foodItemsList: [],
    numFoods: 0,

    init: function(formSelector){
        this.loadList();
        document.querySelector(formSelector).addEventListener('submit', this.addItem.bind(this));
        this.getFoodList = this.getFoodList.bind(this);
    },

    getFoodList: function(){
        return this.foodItemsList;
    },

    addItem: function(ev){
        ev.preventDefault();

        const foodName = addItemForm.foodName.value;
        if(foodName == "" || foodName==null){
            alert("Please enter a food name!");
            return;
        }
        const makeItemFunc = this.makeItem.bind(this);
        const food = makeItemFunc(foodName);

        this.foodItemsList.push(food.dataset.key);
        
        this.saveList();

        food.querySelector('.btnDelete').addEventListener('click', this.deleteItem.bind(this));
        food.querySelector('.btnPromote').addEventListener('click', this.promoteItem.bind(this));
        food.querySelector('.btnUp').addEventListener('click', this.moveItemUp.bind(this));
        food.querySelector('.btnDown').addEventListener('click', this.moveItemDown.bind(this));

    },

    addItem2: function(foodName){
        const makeItemFunc = this.makeItem.bind(this);
        const food = makeItemFunc(foodName);

        this.foodItemsList.push(food.dataset.key);

        food.querySelector('.btnDelete').addEventListener('click', this.deleteItem.bind(this));
        food.querySelector('.btnPromote').addEventListener('click', this.promoteItem.bind(this));
        food.querySelector('.btnUp').addEventListener('click', this.moveItemUp.bind(this));
        food.querySelector('.btnDown').addEventListener('click', this.moveItemDown.bind(this));

        return food;
    },

    makeItem: function(foodName){
        const newItem = document.createElement('li');
        newItem.dataset.key = foodName; //this.numFoods.toString();
        this.numFoods++;

        newItem.innerHTML = `
            <div class="foodItem">
                <p class="foodName">${foodName}</p>
                <button class="btnDelete">Delete</button>
                <button class="btnPromote">Promote</button>
                <button class="btnUp">Up</button>
                <button class="btnDown">Down</button>
            </div>
        `;

        foodList.prepend(newItem);
        return newItem;
    },

    promoteItem: function(ev){
        const foodItem = ev.target.parentNode;  //.querySelector('.foodName');

        if(foodItem.classList.contains('promoted')){
            foodItem.classList.remove('promoted');
            foodItem.parentNode.dataset.key = foodItem.parentNode.dataset.key - "_0ea7034b";
        }
        else{
            foodItem.classList.add('promoted');
            foodItem.parentNode.dataset.key = foodItem.parentNode.dataset.key + "_0ea7034b";
        }
        
        console.log(this);
        this.saveList();

    },

    deleteItem: function(ev){
        const targ = ev.target;
        const foodList = document.querySelector('#foodList');
        
        const foodItem = targ.parentNode.parentNode;

        const index = this.foodItemsList.indexOf(foodItem.dataset.key);
        if(index > -1){
            this.foodItemsList.splice(index, 1); // remove from array
            this.numFoods--;
        }
        else{
            console.log("Food not found in array!");
        }

        foodList.removeChild(foodItem);

        this.saveList();
    },

    moveItemUp: function(ev){
        const targ = ev.target;

        const foodList = document.querySelector('#foodList');
        
        const currentItem = targ.parentNode.parentNode;
        const currentKey = currentItem.dataset.key;
        const currentIndex = this.foodItemsList.indexOf(currentKey);

        if(currentIndex >= this.foodItemsList.length-1)
            return;

        const replaceKey = this.foodItemsList[currentIndex+1];
        const replaceItem = currentItem.previousElementSibling;
        
        foodList.insertBefore(currentItem, replaceItem);
        
        this.foodItemsList[currentIndex] = replaceKey;
        this.foodItemsList[currentIndex+1] = currentKey;

        this.saveList();

    },

    moveItemDown: function(ev){
        const targ = ev.target;

        const foodList = document.querySelector('#foodList');
        
        const currentItem = targ.parentNode.parentNode;
        const currentKey = currentItem.dataset.key;
        const currentIndex = this.foodItemsList.indexOf(currentKey);

        if(currentIndex <= 0)
            return;

        const replaceKey = this.foodItemsList[currentIndex-1];
        const replaceItem = currentItem.nextElementSibling;
        
        foodList.insertBefore(currentItem, replaceItem.nextElementSibling);
        
        this.foodItemsList[currentIndex] = replaceKey;
        this.foodItemsList[currentIndex-1] = currentKey;

        this.saveList();

    },

    saveList: function(){
        // Save current session
        const foodList = document.querySelector('#foodList');
        const listItems = foodList.children;

        for(let i=0; i<listItems.length; i++){
            this.foodItemsList[i] = listItems[listItems.length-1-i].dataset.key;
        }

        localStorage.setItem('foodRosterList', JSON.stringify(this.foodItemsList));
        
    },

    loadList: function(){
        // Load the previous session

        const rawdata = JSON.parse(localStorage.getItem('foodRosterList'));

        if(rawdata == null)
            return null;

        let key = "";
        let newItem = null;

        for(let i=0; i<rawdata.length; i++){

            key = rawdata[i];

            if(key.endsWith("_0ea7034b")){
                newItem = this.addItem2(key.substr(0, key.length-9));
                newItem.children[0].classList.add('promoted');
            }
            else{
                this.addItem2(key);
            }


        }
    }
}

JavascriptRoster.init('#addItemForm');