function getResizeFn(className, cssHeightName){
    return function() {
        $(className).each(function (index, item) {
            var height = 0;
            $(item).parent().children().not(className + ', script').each(function (index, child) {
                height += $(child).outerHeight(true);
            });
            var newHeight = $(item).parent().height() - height -
                ($(item).outerHeight(true) - $(item).outerHeight());
            $(item).css(cssHeightName, newHeight);
        });
    };
}
