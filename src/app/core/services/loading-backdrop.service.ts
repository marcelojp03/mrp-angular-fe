import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingBackdropService {

  constructor() { }

  show() {
    const backdropWrapperElement = this.createLoadingBackdropTemplate();
    const bodyElement = document.querySelector('body');
    bodyElement?.appendChild(backdropWrapperElement);
  }

  hide() {

    setTimeout(() => {
      
      const backdropWrapperElement = document.querySelector('#loadingBackdrop');
      backdropWrapperElement?.remove();
    }, 50);
  }

  private createLoadingBackdropTemplate(): HTMLDivElement {
    const element = document.createElement('div');
    element.setAttribute('id', 'loadingBackdrop');
    element.setAttribute('style', `
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
    `);
    element.innerHTML = `
      <div class="backdrop"></div>
      <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;
    return element;
  }

}
