import { Component, AfterViewInit, HostListener, ElementRef, ViewChild, NgZone, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent {

  @ViewChild('container', { static: false }) containerRef!: ElementRef<HTMLElement>;
  private isScrolling = false;
  private scrollEndTimer: any;
  private cardsArray: HTMLElement[] = [];

  constructor(private ngZone: NgZone, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.cardsArray = Array.from(this.containerRef.nativeElement.querySelectorAll('.card')) as HTMLElement[];
  }

  @HostListener('scroll', ['$event'])
  onScroll() {
    if (this.scrollEndTimer) {
      clearTimeout(this.scrollEndTimer);
    }

    this.isScrolling = true;

    this.ngZone.runOutsideAngular(() => {
      this.scrollEndTimer = setTimeout(() => {
        this.isScrolling = false;
        this.ngZone.run(() => {
          this.centerCard();
        });
      }, 150);
    });
  }

  private centerCard() {
    if (this.isScrolling) return;

    const container = this.containerRef.nativeElement;
    const scrollPosition = container.scrollLeft;
    const cardWidth = this.cardsArray[0].offsetWidth;

    const nearestCardIndex = Math.round(scrollPosition / cardWidth);
    const targetScrollPosition = nearestCardIndex * cardWidth;

    container.scrollTo({
      left: targetScrollPosition,
      behavior: 'smooth'
    });
  }
}
