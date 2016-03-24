﻿class App {

    manager: WidgetManager;

    constructor(root:HTMLElement) {
        this.manager = new WidgetManager(root);
        var test: Widget = new SportWidget(300, 0);
        var test1: Widget = new MeteoWidget(401, 0);

        this.manager.registerWidget(test);
        this.manager.registerWidget(test1);

    }

}

window.onload = function () {
    var app : App = new App(document.getElementById("content"));
};