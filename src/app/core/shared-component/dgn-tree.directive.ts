import { Directive,TemplateRef,ViewContainerRef,Input ,ElementRef } from '@angular/core';

@Directive({
  selector: '[dgnTree]'
})
export class DgnTreeDirective {

  constructor(private templateRef: TemplateRef<any>,
  private viewContainer: ViewContainerRef, private elementRef: ElementRef) { }


@Input() set dgnTree(condition: boolean) {
  if (condition) {
     
  console.log(
    this.elementRef.nativeElement.style.fontSize );
    this.viewContainer.createEmbeddedView(this.templateRef );
  } else {
    this.viewContainer.clear();
  }
}


}
