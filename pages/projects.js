// Hide tabs and only show the tab that is clicked on.
$(document).ready(function () {
  $('.sidenav:first').addClass('active');
  $('.tab-content:not(:first)').hide();
  $('.sidenav a').click(function (event) {
      event.preventDefault();
      var content = $(this).attr('href');
      $(this).parent().addClass('active');
      $(this).parent().siblings().removeClass('active');
      $(content).show();
      $(content).siblings('.tab-content').hide();
  });
});

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}