// Budget Controller
var budgetController = (function() {

		


})();




// UI Controller
var UIController = (function() {





})();




// App Controller
var appController = (function(budgetCtrl, UICtrl) {

	document.querySelector('.add__btn').addEventListener('click', function() {
		console.log('Add button was clicked');
	})

    // document.querySelector('.add__type').value;
    // document.querySelector('.add__description').value;
    // document.querySelector('.add__value').value;

    

})(budgetController, UIController);
