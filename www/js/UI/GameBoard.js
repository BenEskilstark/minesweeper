import StatefulHTML from './StatefulHTML.js';
import {smartGet, smartSet} from '../utils/arraysAndObjects.js';

export default class GameBoard extends StatefulHTML {
  connectedCallback() {
    const width = parseInt(this.getAttribute("width"));
    const height = parseInt(this.getAttribute("height"));
    const numBombs = parseInt(this.getAttribute("numBombs"));


    const div = this.querySelector("div");
    if (!div) throw "No div found";
    div.style = `display: grid; grid-template-columns: repeat(${width}, 1fr)`;

    this.dispatch({width, height, numBombs});
    this.render(this.getState());

    if (!window.getState) {
      window.getState = this.getState;
      window.dispatch = this.dispatch;
    }
  }

  render(state) {
    const {width, height, grid} = state;
    const div = this.querySelector("div");
    if (!div) throw "No div found";
    div.innerHTML = "";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        div.insertAdjacentHTML("beforeEnd", `
          <mine-cell x=${x} y=${y} />
        `);
      }
    }
  }

  onChange(state) {
    this.render(state);
  }
}


