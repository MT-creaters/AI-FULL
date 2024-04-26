$(function() {
    $(".txt_color").children().addBack().contents().each(function(){
        if (this.nodeType == 3) {
            $(this).replaceWith($(this).text().replace(/(\S)/g, "<span>$&</span>"));
        }
    });
});