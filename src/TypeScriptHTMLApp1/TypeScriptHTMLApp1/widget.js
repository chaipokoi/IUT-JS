﻿var Widget = (function () {
    function Widget(x, y) {
        this.div = document.createElement("div");
        this.div.classList.add("widget");
        this.style = document.createElement("style");
        this.width = 0;
        this.height = 0;
        this.move(x, y);
        this.onCreate();
    }
    Widget.prototype.setParent = function (node) {
        this.parent = node;
        this.parent.appendChild(this.div);
    };

    Widget.prototype.onCreate = function () {
        this.onUpdate();
    };

    Widget.prototype.getPosition = function () {
        var res = new Array();
        res["x"] = this.x;
        res["y"] = this.y;
        return res;
    };

    Widget.prototype.move = function (x, y) {
        this.x = x;
        this.y = y;
        this.onMoving();
    };

    Widget.prototype.getSize = function () {
        var res = new Array();
        res["w"] = this.width;
        res["h"] = this.height;
        return res;
    };

    Widget.prototype.onCollid = function (other) {
        if (this.x + this.width >= other.x && this.x <= other.x + other.width && this.y + this.height >= other.y && this.y <= other.y + other.height) {
            return true;
        }
        return false;
    };

    Widget.prototype.onDelete = function () {
        this.div.parentElement.removeChild(this.div);
    };

    Widget.prototype.onMoving = function () {
        if (this.x < 0)
            this.x = 0;
        if (this.y < 0)
            this.y = 0;
        if (this.parent == undefined)
            return;
        if (this.x + this.width > this.parent.clientWidth)
            this.x = this.parent.clientWidth - this.width;
        if (this.y + this.height > this.parent.clientHeight)
            this.y = this.parent.clientHeight - this.height;

        this.onUpdate();
    };

    Widget.prototype.onUpdate = function () {
        this.div.style.position = "absolute";
        this.div.style.top = this.y.toString() + "px";
        this.div.style.left = this.x.toString() + "px";
        this.div.style.width = this.width.toString() + "px";
        this.div.style.height = this.height.toString() + "px";
    };
    return Widget;
})();
//# sourceMappingURL=widget.js.map