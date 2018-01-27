
//Counters------------------------------------------------------------

$('.counter').each(function() {
  var $this = $(this),
      countTo = $this.attr('data-count');
  
  $({ countNum: $this.text()}).animate({
    countNum: countTo
  },

  {

    duration: 8000,
    easing:'linear',
    step: function() {
      $this.text(commaSeparateNumber(Math.floor(this.countNum)));
    },
    complete: function() {
      $this.text(commaSeparateNumber(this.countNum));

    }

  });  

});  

function commaSeparateNumber(val) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
  }
  return val;
}


var raindrops = 1100; 

function randRange( minNum, maxNum) {
  return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

function createRain() {

  for( i=1;i<raindrops;i++) {
  var dropLeft = randRange(0,1600);
  var dropTop = randRange(-1000,900);


  $('.rain').append('<div class="drop" id="drop'+i+'"></div>');
  $('#drop'+i).css('left',dropLeft);
  $('#drop'+i).css('top',dropTop);
  }

}
createRain();

