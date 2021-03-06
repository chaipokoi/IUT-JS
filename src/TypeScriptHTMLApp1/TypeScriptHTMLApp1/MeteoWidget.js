/// <reference path="widget.ts"/>
/// <reference path="Ajax.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MeteoWidget = (function (_super) {
    __extends(MeteoWidget, _super);
    function MeteoWidget() {
        _super.apply(this, arguments);
    }
    MeteoWidget.prototype.onCreate = function () {
        this.name = "Meteo";
        this.width = 350;
        this.height = 70;
        if (!this.load())
            this.showForm();
        _super.prototype.onCreate.call(this);
    };
    MeteoWidget.prototype.showForm = function () {
        var _this = this;
        this.setSize(350, 70);
        var div = document.createElement("div");
        div.innerHTML = "<input type='text' placeholder='Nom de la ville...'>";
        var sub = document.createElement("button");
        sub.innerHTML = "Rechercher";
        sub.addEventListener("click", function () { _this.formClick(); });
        div.appendChild(sub);
        this.setContent(div);
    };
    MeteoWidget.prototype.formClick = function () {
        var city;
        var input = this.content.getElementsByTagName("input")[0];
        city = input.value;
        if (city == "")
            return;
        this.getData(city);
    };
    MeteoWidget.prototype.load = function () {
        if (localStorage.getItem("MeteoWidget") == null || localStorage.getItem("MeteoWidget") == undefined) {
            return false;
        }
        this.getData(localStorage.getItem("MeteoWidget"));
        return true;
    };
    MeteoWidget.prototype.save = function (query) {
        localStorage.setItem("MeteoWidget", query);
    };
    MeteoWidget.prototype.getData = function (query) {
        var _this = this;
        Ajax.Get("http://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=metric&appid=b19cfe2f2d3dc28a55fb7261fe36827a", undefined, function (res) {
            _this.handleData(res);
        });
    };
    MeteoWidget.prototype.handleData = function (res) {
        var _this = this;
        var data = JSON.parse(res);
        if (data.weather == undefined) {
            alert('Impossible de trouver le lieu demande');
            return;
        }
        this.setSize(350, 250);
        var div = document.createElement("div");
        div.innerHTML = "\
                <center><img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'></center>\
                Lieu: <span class='k'>" + data.name + "</span><br>\
                C°: <span class='k'>" + data.main.temp + "</span><br>\
                Humidité: <span class='k'>" + data.main.humidity + "</span><br>\
                Description: <span class='k'>" + data.weather[0].description + "</span><br><br>\
            ";
        this.save(data.name);
        var back = document.createElement("button");
        back.innerHTML = "Retour";
        back.addEventListener("click", function () { _this.showForm(); });
        back.style.width = "100px";
        back.style.display = "block";
        back.style.marginLeft = "auto";
        back.style.marginRight = "auto";
        div.appendChild(back);
        this.setContent(div);
    };
    return MeteoWidget;
}(Widget));
//# sourceMappingURL=MeteoWidget.js.map