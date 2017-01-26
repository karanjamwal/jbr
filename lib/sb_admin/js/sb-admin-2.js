$(function() {
    // [ZK] Removing side-menu from template, and therefore the dependency on MetisMenu 
    // $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        // Sets the min-height of #page-wrapper to window size
        // topOffset = 64;
        // height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        // height = height - topOffset;
        // if (height < 1) height = 1;
        // if (height > topOffset) {
        //     $("#page-wrapper").css("min-height", (height) + "px");
        // }
    });

    // Setting active class to li elements
    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});
