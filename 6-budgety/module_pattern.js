var investmentProfit = (function() {
  var percent = 0.2;

  var calcProfit = function(amount) {
      return amount * percent;
  }

  return {
      profit: function(value) {
          return calcProfit(value);
      }
  }
})();

var investmentType = (function() {
     var access;
    return {
        membershipType: function(type) {
            if (type === 'platinum') {
                return access = 'gold, bond and shares';
            } else if (type === 'bronze') {
                return access = 'bond and shares';
            } else if (type === 'silver') {
                return access = 'gold and bond';
            }
        }
    }

})();


var appController = (function(profit, type) {
    var membersPortfolio = {
        membership: type.membershipType('platinum'),
        profit: profit.profit(2000)
    };

    return {
        portfolio: function() {
            console.log('As a member, you have access to ' + membersPortfolio.membership);
            console.log('You profit on £2000 is £' + membersPortfolio.profit);
        }
    }

})(investmentProfit, investmentType);