// Function responsible for displaying the navbar on a webpage.
$.get("../pages/nav.html", function(data) {
    $("#navbar").html(data);
});