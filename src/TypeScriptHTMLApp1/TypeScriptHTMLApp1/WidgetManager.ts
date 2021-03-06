﻿/// <reference path="DateWidget.ts"/>
/// <reference path="PictureWidget.ts"/>
/// <reference path="SportWidget.ts"/>
/// <reference path="TwitterWidget.ts"/>
/// <reference path="YoutubeWidget.ts"/>
/// <reference path="MapsWidget.ts"/>
/// <reference path="MeteoWidget.ts"/>
/// <reference path="twitter.d.ts" />



class WidgetManager {

        private widgets: Array<Widget>;
        private node: HTMLElement;
        public moving: Widget;
        private loaded: boolean; 

        static Widgets = [
            DateWidget, 
            PictureWidget, 
            SportWidget,
            TwitterWidget, 
            YoutubeWidget,
            MapsWidget, 
            MeteoWidget,
        ];

        constructor(node: HTMLElement) {
            this.loaded = false;
            this.moving = undefined;
            this.widgets = new Array();
            this.node = node;
            this.node.onmousemove = (e) => {
                this.onDragOver(e);
            };
            this.node.onmouseup = () => {
                this.onDragStop();
            };

            setInterval(() => {
                this.update();
            }, 50);
        }

        private save(): void {
            if (this.loaded) {
                console.log("saving " + JSON.stringify(this.widgets));
                localStorage.setItem("WidgetManager", JSON.stringify(this.widgets));
            }
        }

        public load(): void {
            this.loaded = true;
            if (localStorage.getItem("WidgetManager") == null || localStorage.getItem("WidgetManager") == undefined)
                return;
            console.log("Starting loading");
            var model: Array<Widget> = new Array();
            WidgetManager.Widgets.forEach((cl: any) => {
                model.push(new cl(0, 0));
            });
            var data: Array<any> = JSON.parse(localStorage.getItem("WidgetManager"));
            console.log(data);
            data.forEach((e:any) => {
                for (var i = 0; i != model.length; i++) {
                    if (model[i].name == e.name) {
                        var w: Widget = new WidgetManager.Widgets[i](e.x, e.y);
                        this.registerWidget(w);
                        w.x = e.x;
                        w.y = e.y;
                        console.log("new "+w.name);

                        break;
                    }
                }
            });
            twttr.widgets.load();
        }

        public getWidgets(): Array<Widget> {
            return this.widgets;
        }

        public exists(clas: any): boolean {
            for (var i = 0; i != this.widgets.length; i++) {
                if (this.widgets[i] instanceof clas)
                    return true;
            }
            return false;
        }

        public update() {
            this.widgets.forEach((widget: Widget) => {
                if (widget.fixed == false && this.moving != widget) {
                    if (this.organize(widget))
                        widget.counter++;
                    else
                        widget.counter = 0;
                    if (widget.counter >= 3) {
                        var place = this.getRandomZone();
                        widget.move(place.x, place.y);
                        widget.counter = 0;
                    }
                }
            });
            this.save();
        }

        private onDragStop(): void {
            if (this.moving != undefined) {
                this.moving.conflicts.forEach((other: Widget) => {
                    if (other != this.moving && other.fixed == false)
                        this.organize(other);
                });
                this.moving.div.style.transitionProperty = "all";
                this.moving.div.style.zIndex = "0";
                this.moving.onStopMoving();
                this.save();
            }
            this.moving = undefined;
        }

        public getRandomZone(): any {
            var object = { x: null, y: null };
            object.x = Math.floor(Math.random() * this.node.clientWidth);
            object.y = Math.floor(Math.random() * (this.node.clientHeight - 70)) + 70;
            return object;
        }

        private onDragOver(e): void {
            if (this.moving == undefined) {
                return;
            }
            this.moving.div.style.transitionProperty = "none";
            this.moving.onStartMoving();
            this.moving.div.style.zIndex = "100";
  
            this.moving.move(e.pageX, e.pageY);
        }

        public setMoving(moving: Widget) {
            if(moving.fixed == false)
                this.moving = moving;
        }


        public registerWidget(widget: Widget): boolean {
            for (var i: number = 0; i != this.widgets.length; i++) {
                if (this.widgets[i] == widget)
                    return false;
            }
            widget.setParent(this.node);
            this.widgets.push(widget);
            this.organize(widget);
            this.save();
            return true;
        }

        public organize(widget: Widget): boolean {
            
            var moved: boolean = false;
            for (var i: number = 0; i != this.widgets.length; i++) {
                var other: Widget = this.widgets[i];
                if (other == widget)
                    continue;
                if (other.onCollid(widget)) {
                    moved = true;
                    var x: number = other.getCenter()["x"] - widget.getCenter()["x"];
                    var y: number = other.getCenter()["y"] - widget.getCenter()["y"];
                    if (Math.abs(x) > Math.abs(y)) {
                        if (x > 0) {
                            widget.move(other.getPosition()["x"] - widget.getSize()["w"] - 5, widget.getPosition()["y"]);
                        }
                        else {
                            widget.move(other.getPosition()["x"] + other.getSize()["w"] + 5, widget.getPosition()["y"]);

                        }
                    }
                    else {

                        if (y > 0) {
                            widget.move( widget.getPosition()["x"], other.getPosition()["y"] - widget.getSize()["h"] - 5);
                        }
                        else {
                            widget.move(widget.getPosition()["x"], other.getPosition()["y"] + other.getSize()["h"]+ 5);
                        }
                    }
                    break;
                }
            }
            if (moved) {
                widget.conflicts.forEach((other: Widget) => {
                    if(other.fixed == false)
                        this.organize(other);
                });

            }
            return moved;
            
        }

        public unregisterWidget(widget: Widget, del?:boolean): boolean {
            for (var i: number = 0; i != this.widgets.length; i++) {
                if (this.widgets[i] == widget) {
                    if (del == undefined || del == null || del == true) {
                        this.widgets[i].onDelete();
                    }
                    this.widgets.splice(i);

                    return true;
                }
            }
            return false;
        }

    }