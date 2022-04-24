// Function responsible for displaying the navbar on a webpage.
$.get("nav.html", function(data) {
    $("#navbar").html(data);
});