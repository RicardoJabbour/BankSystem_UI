import { Directive, OnInit, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
})
export class NumberOnlyDirective implements OnInit {
  private readonly regex = new RegExp(/^[0-9.]+$/);

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const value = this.elementRef.nativeElement.value;
    if (!this.regex.test(value)) {
      this.elementRef.nativeElement.value = value.replace(/[^0-9.]+/g, '');
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const value = event.target.value;
    if (!this.regex.test(value)) {
      event.target.value = value.replace(/[^0-9.]+/g, '');
    }
  }
}
