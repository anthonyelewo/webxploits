// Budget Controller
var budgetController = (function() {

// Income function 
var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};

var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};

var appData = {
    items: {
        exp: [],
        inc: []
    },
    totals: {
        exp: 0,
        inc: 0
    }
};
    
return {
    addItem: function(typ, desc, val) {
        var newItem;
        var id;
        var itemType = appData.items[typ];
        if (itemType.length > 0) {
          id = itemType[itemType.length - 1].id + 1;
        } else {
          id = 0;
        }
        
        if (typ === 'inc') {
            newItem = new Income(id, desc, val);
        } else if (typ === 'exp') {
            newItem = new Expense(id, desc, val);
        }
        appData.items[typ].push(newItem);
        return newItem;
    },
    testing: function() {
        return appData;
    }
}


})();




// UI Controller
var UIController = (function() {
    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      addButton: '.add__btn',
      incomeContainer: '.income__list',
      expenseContainer: '.expenses__list'
    };

    return {
        getInputValues: function() {
          return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
          };
        },
        getDomStrings: function() {
            return DOMstrings;
        },
        addListItem: function(obj, type) {
            var html;
            var newHtml;
            var htmlElement;

            if (type === 'inc') {
              htmlElement = DOMstrings.incomeContainer;
              html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
              htmlElement = DOMstrings.expenseContainer;
              html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with actual values
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert into DOM
            document.querySelector(htmlElement).insertAdjacentHTML('beforeend', newHtml);
        }
    }


})();




// App Controller
var appController = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
      var DOMstrings = UICtrl.getDomStrings();
      document.querySelector(DOMstrings.addButton).addEventListener('click', ctrlAdditem);
    };

    var ctrlAdditem = function() {
        // 1. Get field input data
        var inputData = UICtrl.getInputValues();

        // 2. Add item to the budget controller
        var newItem = budgetCtrl.addItem(inputData.type, inputData.description, inputData.value);

        // 3. Add the item to UI
        UICtrl.addListItem(newItem, inputData.type);

        // 4. Calculate the budget

        // 5. Display the budget on the UI

    };

    return {
        init: function() {
            console.log('Wagwam bros, App don start Ō');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

appController.init();

