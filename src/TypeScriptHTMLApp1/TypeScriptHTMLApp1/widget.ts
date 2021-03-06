﻿/// <reference path="app.ts"/>
/// <reference path="Ajax.ts"/>



class Widget {

    public parent: HTMLElement;
    public div: HTMLDivElement;
    public content: HTMLDivElement;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public style: HTMLStyleElement;
    public name: string;
    public fixed: boolean;
    public conflicts: Array<Widget>;
    public counter: number;

    constructor(x: number, y: number) {
        this.counter = 0;
        this.conflicts = new Array();
        this.fixed = false;
        this.name = "";
        this.div = document.createElement("div");
        this.div.draggable = true;
        this.div.onmousedown = (e) => {
            e.stopPropagation();
            App.manager.setMoving(this);
        };
        this.content = document.createElement("div");
        this.content.style.position = "relative";
        this.content.classList.add("codehilite");
        this.div.classList.add("widget");
        this.style = document.createElement("style");
        this.width = 0;
        this.height = 0;
        this.move(x, y);
        this.canScroll(false);
        this.onCreate();
    }

    load(): boolean {
        return true;
    }

    intersects(x: number, y: number, w: number,  h: number) : boolean {
        if (this.x + this.width >= x && this.x <= x + w && this.y + this.height >= y && this.y <= y + h) {
            return true;
        }
        return false;
    }

    setSize(w: number, h: number): void {
        this.width = w;
        this.height = h;
        this.onUpdate();
        App.manager.organize(this);

    }

    setParent(node: HTMLElement) {
        this.parent = node;
        this.parent.appendChild(this.div);
    }

    onCreate(): void {
        this.onUpdate();
    }

    getPosition(): any {
        var res: Array<number> = new Array();
        res["x"] = this.x;
        res["y"] = this.y;
        return res;
    }

    move(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.onMoving();
    }

    getSize(): any {
        var res: Array<number> = new Array();
        res["w"] = this.width;
        res["h"] = this.height;
        return res;
    }

    onCollid(other: Widget): boolean {
        if (this.x + this.width >= other.x && this.x <= other.x + other.width && this.y + this.height >= other.y && this.y <= other.y + other.height) {
            return true;
        }
        return false;
    }

    contains(x:number, y: number): boolean {
        if (this.x + this.width >= x && this.x <= x && this.y + this.height >= y && this.y <= y) {
            return true;
        }
        return false;
    }

    public onDelete(): void {
        if(this.div != undefined && this.parent != undefined)
            this.parent.removeChild(this.div);
    }

    setContent(content: HTMLElement): void {
        this.content.innerHTML = "";
        this.content.appendChild(content);
    }

    canScroll(can: boolean): void {
        if (can)
            this.div.style.overflowY = "auto";
        else
            this.div.style.overflowY = "hidden";
    }

    onMoving(): void {
        this.conflicts = new Array();
        App.manager.getWidgets().forEach((other: Widget) => {
            if (other != this &&  this.onCollid(other)) {
                this.conflicts.push(other);
            }
        });



        if (App.manager.moving == this && this.conflicts.length == 0) {

            if (this.x < 0)
                this.x = 0;
            if (this.y < 70)
                this.y = 70;
            if (this.parent == undefined)
                return;
            if (this.x + this.width > this.parent.clientWidth)
                this.x = this.parent.clientWidth - this.width;
            if (this.y + this.height > this.parent.clientHeight)
                this.y = this.parent.clientHeight - this.height;
        }
        else {
            if (this.parent == undefined)
                return;
            if (this.x < 0)
                this.x = this.parent.clientWidth - this.width;
            if (this.y < 70)
                this.y = this.parent.clientHeight - this.height;
            if (this.x + this.width > this.parent.clientWidth)
                this.x = 0;
            if (this.y + this.height > this.parent.clientHeight)
                this.y = 70;
        }
        
        this.onUpdate();
    }

    closeWidget(): void {
        App.manager.unregisterWidget(this);
    }

    onStartMoving() : void
    {


    }

    onStopMoving() : void
    {

        
    }

    onUpdate(): void {
        this.div.innerHTML = "";
        var title: HTMLElement = document.createElement("h1");
        title.innerHTML = this.name;
        if (this.fixed == false) {

            var close: HTMLButtonElement = document.createElement("button");
            close.innerHTML = "X";
            close.classList.add("close");
            close.onclick = () => {
                this.closeWidget();
            };
            title.appendChild(close);
        }
        this.div.appendChild(title);
        if(this.content.dataset["state"] != "no-update")
            this.div.appendChild(this.content);
        this.div.style.position = "absolute";
        this.div.style.top = this.y.toString() + "px";
        this.div.style.left = this.x.toString() + "px";
        this.div.style.width = this.width.toString()+"px";
        this.div.style.height = this.height.toString() + "px";
        
    }

    public getCenter() {
        var res: Array<number> = new Array();
        res["x"] = this.x + this.width /2;
        res["y"] = this.y + this.height/2;
        return res;
    }

}