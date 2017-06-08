const JavascriptRoster = {

    foodItemsList: [],

    init: function(formSelector){
        this.loadList();
        document.querySelector(formSelector).foodName.focus();
        document.querySelector(formSelector).addEventListener('submit', this.addItem.bind(this));
        this.getFoodList = this.getFoodList.bind(this);

    },

    getFoodList: function(){
        return this.foodItemsList;
    },

    addItem: function(ev){
        ev.preventDefault();

        const foodName = ev.target.foodName.value;
        if(foodName == "" || foodName==null){
            alert("Please enter a food name!");
            return;
        }

        const food = {
            id: foodName,
            promoted: false,
        }

        const makeItemFunc = this.makeItem.bind(this);
        const foodLI = makeItemFunc(food);

        this.foodItemsList.push(food);
        this.saveList();

        foodLI.querySelector('.btnEdit').addEventListener('click', this.editItem.bind(this));
        foodLI.querySelector('.btnDelete').addEventListener('click', this.deleteItem.bind(this));
        foodLI.querySelector('.btnPromote').addEventListener('click', this.promoteItem.bind(this));
        foodLI.querySelector('.btnUp').addEventListener('click', this.moveItemUp.bind(this));
        foodLI.querySelector('.btnDown').addEventListener('click', this.moveItemDown.bind(this));
        

        ev.target.reset();

    },

    addItem2: function(food){
        const makeItemFunc = this.makeItem.bind(this);
        const foodLI = makeItemFunc(food);

        foodLI.querySelector('.btnEdit').addEventListener('click', this.editItem.bind(this));
        foodLI.querySelector('.btnDelete').addEventListener('click', this.deleteItem.bind(this));
        foodLI.querySelector('.btnPromote').addEventListener('click', this.promoteItem.bind(this));
        foodLI.querySelector('.btnUp').addEventListener('click', this.moveItemUp.bind(this));
        foodLI.querySelector('.btnDown').addEventListener('click', this.moveItemDown.bind(this));

        return foodLI;
    },

    makeItem: function(food){
        const newItem = document.createElement('li');
        newItem.dataset.id = food.id;

        newItem.innerHTML = `
            <div class="foodItem">
                <span class="foodName" contenteditable="false">${food.id}</span>
                <button class="btnEdit">Edit</button>
                <button class="btnDelete">Delete</button>
                <button class="btnPromote">Promote</button>
                <button class="btnUp">Up</button>
                <button class="btnDown">Down</button>
            </div>
        `;

        document.querySelector('#foodList').insertBefore(newItem, document.querySelector('#foodList').firstChild);
        return newItem;
    },

    findItem: function(foodLI){
        for(let i=0; i<this.foodItemsList.length; i++){
            if(this.foodItemsList[i].id == foodLI.dataset.id){
                return [this.foodItemsList[i], i];
            }
        }
    },

    findLI: function(foodID){
        const list = document.querySelector('#foodList');
        const listItems = list.childNodes;
        for(let i=0; i<listItems.length; i++){
            if (listItems[i].dataset.id == foodID)
                return listItems[i];
        }
    },

    promoteItem: function(ev){
        const foodLI = ev.target.parentNode.parentNode;  //.querySelector('.foodName');  
        const food = (this.findItem(foodLI))[0];

        if(ev.target.parentNode.classList.contains('promoted')){
            ev.target.parentNode.classList.remove('promoted');
            food.promoted = false;
        }
        else{
            ev.target.parentNode.classList.add('promoted');
            food.promoted = true;
        }

        this.saveList();

    },

    promoteItem2: function(foodLI){

        const promoteDiv = foodLI.firstElementChild;

        if(promoteDiv.classList.contains('promoted')){
            promoteDiv.classList.remove('promoted');
        }
        else{
            promoteDiv.classList.add('promoted');
        }
    },


    deleteItem: function(ev){
        const targ = ev.target;
        const foodList = document.querySelector('#foodList');
        
        const foodLI = targ.parentNode.parentNode;
        
        const food = this.findItem(foodLI)[0]
        const foodIndex = this.findItem(foodLI)[1];

        if(foodIndex > -1){
            this.foodItemsList.splice(foodIndex, 1); // remove from array
        }

        foodList.removeChild(foodLI);

        this.saveList();
    },

    moveItemUp: function(ev){
        const targ = ev.target;

        const foodList = document.querySelector('#foodList');
        
        const currentItem = targ.parentNode.parentNode;
        const currentFood = this.findItem(currentItem)[0];
        const currentIndex = this.findItem(currentItem)[1];

        if(currentIndex >= this.foodItemsList.length-1)
            return;

        const replaceItem = currentItem.previousElementSibling;
        const replaceFood = this.findItem(replaceItem)[0];
        const replaceIndex = this.findItem(replaceItem)[1];
        
        foodList.insertBefore(currentItem, replaceItem);
        
        this.foodItemsList[currentIndex] = replaceFood;
        this.foodItemsList[replaceIndex] = currentFood;

        this.saveList();

    },

    moveItemDown: function(ev){
        const targ = ev.target;

        const list = document.querySelector('#foodList');

        const currentLI = targ.closest('li')
        const currentFood = this.findItem(currentLI)[0];
        const currentIndex = this.findItem(currentLI)[1];

        if(currentIndex < 1)
            return;

        const replaceLI = currentLI.nextElementSibling
        const replaceFood = this.findItem(replaceLI)[0];
        const replaceIndex = this.findItem(replaceLI)[1];

        list.insertBefore(replaceLI, currentLI);

        this.foodItemsList[replaceIndex] = currentFood;
        this.foodItemsList[currentIndex] = replaceFood;

        this.saveList();

    },

    editItem: function(ev){
        const targ = ev.target;

        const foodLI = targ.closest('li');
        const textField = targ.parentNode.querySelector('.foodName');
        
        if(textField.contentEditable == "false"){
            textField.contentEditable = "true";
            textField.focus();
            targ.textContent = "Done"
        }
        else{
            const newText = textField.textContent;
            textField.contentEditable = "false";
            targ.textContent = "Edit"
            
            // Save new entry
            textField.textContent = newText;

            // update li data-id
            this.findItem(foodLI)[0].id = newText;
            foodLI.dataset.id = newText;

            
            this.saveList();
        }

    },

    saveList: function(){
        // Save current session
        localStorage.setItem('foodRosterList', JSON.stringify(this.foodItemsList));
        
    },

    loadList: function(){
        // Load the previous session

        const foodArray = JSON.parse(localStorage.getItem('foodRosterList'));

        if(!foodArray || foodArray == null)
            return null;

        for(let i=0; i<foodArray.length; i++){
            this.foodItemsList.push(foodArray[i])
            const foodLI = this.addItem2(this.foodItemsList[i])
            if(this.foodItemsList[i].promoted)
                this.promoteItem2(foodLI);
        }
    }
}

JavascriptRoster.init('#addItemForm');