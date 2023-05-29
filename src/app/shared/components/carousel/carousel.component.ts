import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";

import { trigger, transition, useAnimation } from "@angular/animations";

import {
  AnimationType,
  fadeIn,
  fadeOut
} from "./carousel.animations";
import { Slide } from './carousel.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
  animations: [
    trigger("slideAnimation", [

      /* fade */
      transition("void => fade", [
        useAnimation(fadeIn, { params: { time: "300ms" } })
      ]),
      transition("fade => void", [
        useAnimation(fadeOut, { params: { time: "300ms" } })
      ])

    ])
  ]
})
export class CarouselComponent implements OnInit {

  imgUrl: any;
  subscribe!: Subscription;

  @Input() slides!: Slide[];
  @Input() animationType = AnimationType.Scale;
  @Output() out = new EventEmitter();

  currentSlide = 0;

  constructor(
    public dialogRef: MatDialogRef<CarouselComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }

  ngOnInit(): void {
    this.preloadImages();

  }

  preloadImages() {
    for (const slide of this.slides) {
      new Image().src = this.selectItem(slide);
    }
  }

  replaceUrl(url:string){

      url.replace('obito/', '')
      const newUrl =  url.replace('obito/', '')
      return 'http://servidor-epica.cjc.local/docdigitalizados/' + newUrl

  }

  selectItem(item:any){
    if(item.url !== undefined && item.url.substring(0, 4) === "data") {
      return item.url
    }else{
      this.out.emit(this.replaceUrl(item.path_sys));
      return this.replaceUrl(item.path_sys)
    }
  }

}
