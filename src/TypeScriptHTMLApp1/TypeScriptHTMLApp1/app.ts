﻿class App {

    manager: WidgetManager;

    constructor(root:HTMLElement) {
        this.manager = new WidgetManager(root);
        var test: MeteoWidget = new MeteoWidget(300, 0);
        this.manager.registerWidget(test);
    }

}

window.onload = function () {
    var app : App = new App(document.getElementById("content"));
};