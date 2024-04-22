export var db_data = new Dexie('Calender');
// db.delete();
db_data.version(1).stores({
    notes: "id ,day,name,event",
  });
export const res  = await fetch("./resource/home.png");
export const blob = await res.blob();

export var db_im = new Dexie('Photo');
db_im.version(1).stores({
    photos: "name, id, photoData"
  });

//data input
// $(window, document, undefined).ready(function() {

//   $('input').blur(function() {
//     var $this = $(this);
//     if ($this.val())
//       $this.addClass('used');
//     else
//       $this.removeClass('used');
//   });

//   var $ripples = $('.ripples');

//   $ripples.on('click.Ripples', function(e) {

//     var $this = $(this);
//     var $offset = $this.parent().offset();
//     var $circle = $this.find('.ripplesCircle');

//     var x = e.pageX - $offset.left;
//     var y = e.pageY - $offset.top;

//     $circle.css({
//       top: y + 'px',
//       left: x + 'px'
//     });

//     $this.addClass('is-active');

//   });

//   $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function(e) {
//     $(this).removeClass('is-active');
//   });

// });