// Budget Controller
var budgetController = (function() {

// Income function constructor
var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};

// Expenses function constructor
var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
};

var calculateTotal = function(typ) {
    var totalArr = appData.items[typ];
    var total = 0;
    totalArr.forEach(function(current) {
      total += current.value;
      appData.totals[typ] = total;
    })
};

var appData = {
    items: {
        exp: [],
        inc: []
    },
    totals: {
        exp: 0,
        inc: 0
    },
    budget: 0,
    percentage: -1
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
    getBudget: function() {
        return {
           budget: appData.budget,
           income: appData.totals.inc,
           expenses: appData.totals.exp,
           percentage: appData.percentage 
        };
    },
    calculateBudget: function() {

        // 1. calculate totals
        calculateTotal('exp');
        calculateTotal('inc');

        // 2. calculate budget
        appData.budget = appData.totals.inc - appData.totals.exp;

        // 3. calculate percentage
        if (appData.totals.inc > 0) {
          appData.percentage = Math.round((appData.totals.exp / appData.totals.inc) * 100);
        } else {
          appData.percentage = -1;
        }
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
      expenseContainer: '.expenses__list',
      totalBudget: '.budget__value',
      totalIncome: '.budget__income--value',
      totalExpenses: '.budget__expenses--value',
      totalPercentage: '.budget__expenses--percentage'
    };

    return {
        getInputValues: function() {
          return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
        },
        clearInputField: function() {
            var inputFieldNodeList = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            inputFieldNodeList = Array.prototype.slice.call(inputFieldNodeList);

            inputFieldNodeList.forEach(function(current) {
                current.value = '';
                inputFieldNodeList[0].focus();
            })
        },
        displayBudget: function(data) {
          document.querySelector(DOMstrings.totalBudget).textContent = data.budget;
          document.querySelector(DOMstrings.totalIncome).textContent = data.income;
          document.querySelector(DOMstrings.totalExpenses).textContent = data.expenses;

          if (data.percentage > 0) {
            document.querySelector(DOMstrings.totalPercentage).textContent = data.percentage + '%';
          } else {
            document.querySelector(DOMstrings.totalPercentage).textContent = '---';
          }
          
        }
    }
})();

// App Controller
var appController = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
      var DOMstrings = UICtrl.getDomStrings();
      document.querySelector(DOMstrings.addButton).addEventListener('click', ctrlAdditem);
    };

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Display the budget on the UI
        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
    };

    var ctrlAdditem = function() {
        // 1. Get field input data
        var inputData = UICtrl.getInputValues();

        if (inputData.description !== '' && !isNaN(inputData.value) && inputData.value > 0) {
          // 2. Add item to the budget controller
          var newItem = budgetCtrl.addItem(inputData.type, inputData.description, inputData.value);

          // 3. Add the item to UI
          UICtrl.addListItem(newItem, inputData.type);

          // 4. Clear input field
          UICtrl.clearInputField();

          // 5. Update and display budget
          updateBudget();
        }

    };

    return {
        init: function() {
            console.log('Bros Yee, App don start Ō');
            setupEventListeners();
        }
    };
})(budgetController, UIController);

appController.init();

