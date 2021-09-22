var nbOptions = 8;
var angleStart = -360;



// jquery rotate animation
function rotate(li,d) {
    $({d:angleStart}).animate({d:d}, {
        step: function(now) {
            $(li)
               .css({ transform: 'rotate('+now+'deg)' })
               .find('label')
                  .css({ transform: 'rotate('+(-now)+'deg)' });
        }, duration: 0
    });
}

// show / hide the options
function toggleOptions(s) {
    $(s).toggleClass('open');
    var li = $(s).find('li');
    var deg = $(s).hasClass('half') ? 180/(li.length-1) : 360/li.length;
    for(var i=0; i<li.length; i++) {
        var d = $(s).hasClass('half') ? (i*deg)-90 : i*deg;
        $(s).hasClass('open') ? rotate(li[i],d) : rotate(li[i],angleStart);
    }
}


setTimeout(function() { toggleOptions('.selector'); }, 100);


var clock_tick = function clock_tick() {
        setInterval('update_clock();', 1000);
}

var update_clock = function update_clock() {
    document.getElementById('liveclock').innerHTML = moment().format("DD/MM/YYYY HH:mm:ss");
}

// start the clock immediatly
clock_tick();

$("#menu-toggle").click(function(e) {
    e.preventDefault();
  $("#wrapper").toggleClass("toggled");
  });
