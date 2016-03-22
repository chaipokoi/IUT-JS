﻿class Widget {

    public parent: HTMLElement;
    public div: HTMLDivElement;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public style: HTMLStyleElement;

    constructor(x:number, y:number) {
        this.div = document.createElement("div");
        this.div.classList.add("widget");
        this.style = document.createElement("style");
        this.width = 0;
        this.height = 0;
        this.move(x, y);
        this.onCreate();
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

    onDelete(): void {
        this.div.parentElement.removeChild(this.div);
    }

    onMoving(): void {
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
    }

    onUpdate(): void {
        this.div.style.position = "absolute";
        this.div.style.top = this.y.toString() + "px";
        this.div.style.left = this.x.toString() + "px";
        this.div.style.width = this.width.toString()+"px";
        this.div.style.height = this.height.toString() + "px";
        
    }

}