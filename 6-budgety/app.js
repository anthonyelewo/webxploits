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
    this.percentage = -1;
};

Expense.prototype.calculatePercentage = function() {
    if (appData.totals.inc > 0) {
      this.percentage = Math.round((this.value / appData.totals.inc) * 100);
    } else {
        this.percentage = -1;
    }
};

Expense.prototype.getPercentage = function() {
    return this.percentage;
};

var calculateTotal = function(typ) {
    var totalArr = appData.items[typ];
    var total = 0;
    totalArr.forEach(function(current) {
      total += current.value;
    });
    appData.totals[typ] = total;
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
    },
    removeItem: function(typ, itemId) {
        // 1. remove from data structure
        var arr = appData.items[typ];
        var idArr = arr.map(function(current) {
            return current.id;
        });
        var idPosition = idArr.indexOf(itemId);

        if (idPosition !== -1) {
          arr.splice(idPosition, 1);
        }
    },

    calculatePercentages: function() {
        // calculate percentage
        var expenses = appData.items.exp;
        expenses.forEach(function(current) {
          current.calculatePercentage();
        });
    },

    getPercentages: function() {
      // return percentage
      var expenses = appData.items.exp;
      var percentage = expenses.map(function(current) {
        var percentageArr = current.getPercentage();
        return percentageArr;
      });
      return percentage;
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
      totalPercentage: '.budget__expenses--percentage',
      deleteButton: '.item__delete--btn',
      appContainer: '.container.clearfix',
      expensesPercentage: '.item__percentage',
      monthLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
         var formatNum = Math.abs(num);
         formatNum = formatNum.toFixed(2);
         formatNum = formatNum.split('.');

         var int = formatNum[0];
         var dec = formatNum[1];

         if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(1, 3);
         }

         return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

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
          var type = (data.budget < 0) ? 'exp' : 'inc';
          document.querySelector(DOMstrings.totalBudget).textContent = formatNumber(data.budget, type);
          document.querySelector(DOMstrings.totalIncome).textContent = formatNumber(data.income, 'inc');
          document.querySelector(DOMstrings.totalExpenses).textContent = formatNumber(data.expenses, 'exp');

          if (data.percentage > 0) {
            document.querySelector(DOMstrings.totalPercentage).textContent = data.percentage + '%';
          } else {
            document.querySelector(DOMstrings.totalPercentage).textContent = '---';
          }
        },

        displayPercentages: function(percentages) {
            var percentagesNodeList = document.querySelectorAll(DOMstrings.expensesPercentage);
            // option 1: Hack
            /* percentagesNodeList = Array.prototype.slice.call(percentagesNodeList);
            percentagesNodeList.forEach(function(current, index) {
                current.textContent = percentages[index];
            }); */
            // option 2
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(percentagesNodeList, function(current, index) {
              if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
              }
            })
        },

        displayDate: function() {
            var now = new Date();
            var year = now.getFullYear();
            var monthIndex = now.getMonth();
            var month = [];

            month = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector(DOMstrings.monthLabel).textContent =  month[monthIndex] + ' ' + year;
        },

        deleteItemList: function(evt) {
           var idValue = evt.target.parentNode.parentNode.parentNode.parentNode.id;
           var idValueSplit = idValue.split('-');
           var type = idValueSplit[0];
           type = (idValueSplit[0] === 'income') ? 'inc' : 'exp';
           var itemId = parseInt(idValueSplit[1]);
           var item = document.getElementById(idValue);
           item.parentNode.removeChild(item);
           return {
            type: type,
            id: itemId
           };
        }
    }
})();

// App Controller
var appController = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
      var DOMstrings = UICtrl.getDomStrings();
      document.querySelector(DOMstrings.addButton).addEventListener('click', ctrlAdditem);
      document.querySelector(DOMstrings.appContainer).addEventListener('click', function(event) {
          var deleteClass = document.querySelector(DOMstrings.deleteButton);
        if (deleteClass !== null) {
            deleteItem(event);
        }
      });
    };

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Display the budget on the UI
        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
    };

    var updatePercentage = function() {
        // 1. calculate percentage
        budgetCtrl.calculatePercentages();

        // 2. return percentage
        var percentages = budgetCtrl.getPercentages();

        // 3. display percentage
        
        UICtrl.displayPercentages(percentages);
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

          // 6. Update percentages
          if (inputData.type === 'exp') {
            updatePercentage();
          }
        }
    };

    var deleteItem = function(event) {
        // 1. delete item from the user interface
        var deleteData = UICtrl.deleteItemList(event);

        // 2. delete item from data structure
        budgetCtrl.removeItem(deleteData.type, deleteData.id); 

        // 3. re-calculate the budget
         updateBudget();

        // 4. Update percentages
        if (deleteData.type === 'exp') {
            updatePercentage();
          }
    };

    return {
        init: function() {
            UICtrl.displayDate();
            var clearFields = function() {
              UICtrl.displayBudget({
                 budget: 0,
                 income: 0,
                 expenses: 0,
                 percentage: -1 
              });
            };
            console.log('Bros Yee, App don start Ō');
            setupEventListeners();
            clearFields();
        }
    };
})(budgetController, UIController);

appController.init();

