//Item controller
const ItemController = (function () {
    //Item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [
            // { id: 0, name: 'Steak Dinner', calories: 1200 },
            // { id: 1, name: 'Cookie', calories: 400 },
            // { id: 2, name: 'Eggs', calories: 300 }
        ],
        currentItem: null,
        totalCalories: 0
    }

    //public methods
    return {
        getItems: function () {
            return data.items;
        },

        addItem: function (name, calories) {
            // console.log(name, calories)
            //create id
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            calories = parseInt(calories)
            //create new item
            newItem = new Item(ID, name, calories);
            //add to items array
            data.items.push(newItem);
            return newItem;
        },

        getItemById: function (id) {
            let found = null;
            //loop through items
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        setCurrentItem: function (item) {
            data.currentItem = item;
        },

        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;
            data.items.forEach((item) => {
                total += item.calories;
            })

            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();

//UI controller
const UIController = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn:'.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach((item) => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="" class="secondary-content"><i class="edit-item fas fa-pencil"></i></a>
            </li>`
            })

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        addListItem: function (item) {
            //showlist
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="" class="secondary-content"><i class="edit-item fas fa-pencil"></i></a>`
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },

        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function () {
            UIController.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function () {
            UIController.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemController.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemController.getCurrentItem().calories;
            UIController.showEditState();
        },

        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        getSelectors: function () {
            return UISelectors;
        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value

            }
        }
    }
})()

//App controller
const App = (function (ItemController, UIController) {
    const loadEventListeners = function () {
        const UISelectors = UIController.getSelectors();
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
    }

    const itemAddSubmit = function (e) {

        const input = UIController.getItemInput();
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemController.addItem(input.name, input.calories)

            //Add item to UI list
            UIController.addListItem(newItem);
            //clear fields
            //get total calories
            const totalCalories = ItemController.getTotalCalories();
            //add total calories to UI
            UIController.showTotalCalories(totalCalories);
            UIController.clearInput();

            // console.log('Add')
            // console.log(input)
        }
        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {
        e.preventDefault();
        if (e.target.classList.contains('edit-item')) {

            //get list item id
            const listId = e.target.parentNode.parentNode.id;

            //break into array
            const listIdArr = listId.split('-');
            console.log(listIdArr);

            //get actual id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemController.getItemById(id);
            console.log(itemToEdit);

            //set current item
            ItemController.setCurrentItem(itemToEdit);

            //add item to form
            UIController.addItemToForm();
        }
        

    }
    //public methods
    return {
        init: function () {
            UIController.clearEditState();

            console.log('Initializing app...')
            //fetch items from data structure
            const items = ItemController.getItems();
            //check if  any items
            if (items.length === 0) {
                UIController.hideList();
            }
            else {
                UIController.populateItemList(items);
            
            }
            
            loadEventListeners();
        }
    }

})(ItemController, UIController)

App.init();