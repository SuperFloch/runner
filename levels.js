var templates = [];

function populateTemplates(width, height) {
    var t1 = new PlatformGroupTemplate();
    t1.addPlatform(getPercentToPixels(0, width), getPercentToPixels(80, height), getPercentToPixels(50, width), getPercentToPixels(20, height));
    t1.platforms.push(new BouncyPlatform(getPercentToPixels(50, width), getPercentToPixels(80, height), getPercentToPixels(50, width), getPercentToPixels(20, height)));
    templates.push(t1);

    t1 = new PlatformGroupTemplate();
    t1.addPlatform(getPercentToPixels(0, width), getPercentToPixels(80, height), getPercentToPixels(20, width), getPercentToPixels(20, height));
    t1.addPlatform(getPercentToPixels(20, width), getPercentToPixels(75, height), getPercentToPixels(20, width), getPercentToPixels(15, height));
    t1.addPlatform(getPercentToPixels(40, width), getPercentToPixels(60, height), getPercentToPixels(20, width), getPercentToPixels(15, height));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(60, width), getPercentToPixels(45, height), getPercentToPixels(20, width), getPercentToPixels(15, height)));
    templates.push(t1);

    t1 = new PlatformGroupTemplate();
    t1.platforms.push(new FallingPlatform(getPercentToPixels(0, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(5, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(10, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(15, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(20, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(25, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(30, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(35, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(40, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(45, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(50, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(55, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(60, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(65, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(70, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(75, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(80, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(85, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(90, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    t1.platforms.push(new FallingPlatform(getPercentToPixels(95, width), getPercentToPixels(75, height), getPercentToPixels(5, width), getPercentToPixels(5, height), 400));
    templates.push(t1);

}

function getPercentToPixels(per, widthOrHeigth) {
    return Math.floor(per / 100 * widthOrHeigth);
}