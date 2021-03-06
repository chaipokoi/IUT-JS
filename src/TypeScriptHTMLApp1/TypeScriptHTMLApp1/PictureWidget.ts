/// <reference path="widget.ts"/>

class PictureWidget extends Widget
{
	onCreate() : void
	{
        this.width = 350;
        this.height = 70;
        this.name = "Photo";
        if(!this.load())
            this.showForm();
		super.onCreate();
    }

    showForm(): void {
        this.setSize(350, 70);
        var div: HTMLDivElement = document.createElement("div");
        div.innerHTML = "<input type='text' placeholder='Entrez un mot-clef'>";
        var button: HTMLButtonElement = document.createElement("button");
        button.innerHTML = "Chercher";
        button.addEventListener('click', () => { this.formClick(this); });
        div.appendChild(button);
        this.setContent(div);
    }

	formClick(self : PictureWidget) : void
	{
        var search: string = (<HTMLInputElement>this.content.getElementsByTagName("input")[0]).value;
        if (search == undefined || search == "")
            return;
        this.getData(search);
    }

    getData(query: string): void {
        var headers = {};
        headers["Authorization"] = "Client-ID a6284859047b915";
        Ajax.Get("https://api.imgur.com/3/gallery/search/?q=" + query + "&client", null, (data: string) => {
            this.handleGallery(this, data);
        }, undefined, headers); 
    }

    save(picture : any): void {
        localStorage.setItem("PictureWidget", JSON.stringify(picture));
    }

    load(): boolean {
        if (localStorage.getItem("PictureWidget") == null || localStorage.getItem("PictureWidget") == undefined) {
            return false;
        }
        this.showPicture(JSON.parse(localStorage.getItem("PictureWidget")));
        return true;
    }

    handleGallery(self: PictureWidget, data: string): void {
        var result: any = JSON.parse(data);
        var picture: any = result.data[Math.floor(Math.random() * result.data.length)];
        var counter: number = 0;
        while (picture == undefined || picture.type == undefined || (picture.type.indexOf("image/") == -1 && counter < 15)) {
            picture = result.data[Math.floor(Math.random() * result.data.length)];
            counter++;
        }
        if (picture != undefined) {
            self.showPicture(picture);
        }
        else
            alert("Aucune image n'a ete trouvee.");
    }

    showPicture(picture: any) {
        this.save(picture);
        this.setSize(250, 400);
        this.canScroll(true);
        var div: HTMLDivElement = document.createElement("div");
        div.style.textAlign = "center";
        var img: HTMLImageElement = document.createElement("img");
        img.height = 200;
        img.src = picture.link;
        div.appendChild(img);
        var title: HTMLDivElement = document.createElement("div");
        title.style.textAlign = "left";
        title.innerHTML = "<h2>" + picture.title + "</h2>";
        if (picture.description != null)
            title.innerHTML += picture.description;
        else
            title.innerHTML = "Pas de description";
        div.appendChild(title);
        var button: HTMLButtonElement = document.createElement("button");
        button.innerHTML = "Retour";
        button.addEventListener("click", () => {
            this.showForm();
        });
        div.appendChild(button);
        this.setContent(div);

    }

}