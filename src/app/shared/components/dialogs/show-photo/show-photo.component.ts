import { Subscription } from 'rxjs';
import { FileService } from './../../../services/file.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimationType } from '../../carousel/carousel.animations';
import printJS from "print-js";


@Component({
  selector: 'app-show-photo',
  templateUrl: './show-photo.component.html',
  styleUrls: ['./show-photo.component.scss']
})
export class ShowPhotoComponent implements OnInit, OnDestroy {

  imgUrl: any;
  backgroundPosX!: string;
  backgroundPosY!: string;


  base64Image!: string;
  subscribe!: Subscription;
  imgsDataLength: any;
  animationType = AnimationType.Fade;
  currentImgCarrousel: any;
  myThumbnail ='https://epicasys.jardimdacolina.com.br/assets/images/logo-cemiterio-particular-jardim-da-colina-color.png'
  constructor(
    public dialogRef: MatDialogRef<ShowPhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.imgsDataLength = this.data.list.length;
    let arr = this.data.list;

  }
  print(){
    console.log('print');

    printJS({
      printable: this.data.file,
      type: "image",
      style: "img { width: 800px;height: 900px;}"
    });
  }

  printCarrousel(){
    printJS({
      printable: this.currentImgCarrousel,
      type: "image",
      style: "img { width: 800px;height: 900px;}"
    });
  }

  currentUrl(item:any){
    this.currentImgCarrousel = item;
  }

  onMouseMove(event:any) {

      // Obtém a imagem e a posição do mouse
      const img = event.target;
      const pos = this.getCursorPos(event);

      // Define a posição da lente e exibe a lente
      this.backgroundPosX = '-' + (pos.x * 2) + 'px';
      this.backgroundPosY = '-' + (pos.y * 2) + 'px';
      this.imgUrl = img.src;
      img.style.cursor = 'none';
      img.parentElement.style.overflow = 'hidden';
      const lens = document.getElementsByClassName('lens')[0] as HTMLElement;
      lens.style.visibility = 'visible';
  }

  onMouseLeave() {
    // Esconde a lente
    const img = document.getElementsByTagName('img')[0] as HTMLElement;
    img.style.cursor = 'auto';
    if (img.parentElement) {
      img.parentElement.style.overflow = 'hidden';
    }
    const lens = document.getElementsByClassName('lens')[0] as HTMLElement;
    lens.style.visibility = 'hidden';
  }

  getCursorPos(event:any) {
    let x = 0;
    let y = 0;
    const a = event.target.getBoundingClientRect();
    x = event.pageX - a.left;
    y = event.pageY - a.top;
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x, y};
  }
  ngOnDestroy(){
    if(this.subscribe){
      this.subscribe.unsubscribe();
    }
  }
}
