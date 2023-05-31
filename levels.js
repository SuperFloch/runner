var templates = [];

function populateTemplates(width, height) {
    var t1 = new PlatformGroupTemplate();
    t1.addPlatform(getPercentToPixels(0, width), getPercentToPixels(80, height), getPercentToPixels(40, width), getPercentToPixels(20, height));
    t1.addPlatform(getPercentToPixels(50, width), getPercentToPixels(80, height), getPercentToPixels(30, width), getPercentToPixels(20, height));
    templates.push(t1);

    t1 = new PlatformGroupTemplate();
    t1.addPlatform(getPercentToPixels(0, width), getPercentToPixels(80, height), getPercentToPixels(20, width), getPercentToPixels(20, height));
    t1.addPlatform(getPercentToPixels(20, width), getPercentToPixels(60, height), getPercentToPixels(20, width), getPercentToPixels(20, height));
    t1.addPlatform(getPercentToPixels(40, width), getPercentToPixels(40, height), getPercentToPixels(20, width), getPercentToPixels(20, height));
    t1.addPlatform(getPercentToPixels(60, width), getPercentToPixels(20, height), getPercentToPixels(20, width), getPercentToPixels(20, height));
    templates.push(t1);
}

function getPercentToPixels(per, widthOrHeigth) {
    return Math.floor(per / 100 * widthOrHeigth);
}