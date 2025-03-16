
import StatefulHTML from './StatefulHTML.js';
import {smartGet, smartSet} from '../utils/arraysAndObjects.js';
import {colors} from '../state/rootReducer.js';


export default class MineCell extends StatefulHTML {
  connectedCallback() {
    const x = parseInt(this.getAttribute("x"));
    const y = parseInt(this.getAttribute("y"));

    const {grid} = this.getState();

    const cell = smartGet(grid ?? {}, {x, y});

    if (cell?.visible) {
      const dcell = document.createElement("div");
      dcell.style = `display: inline-block; color: ${colors[cell.value]}`;
      dcell.appendChild(document.createTextNode(cell.value));
      this.appendChild(dcell);
    } else if (cell?.flagged) {
      const dcell = document.createElement("div");
      dcell.style = "display: inline-block";
      dcell.appendChild(document.createTextNode("🚩"));
      this.appendChild(dcell);
    } else {
      const bcell = document.createElement("button");
      bcell.onclick = () => this.dispatch({type: "CLICK_CELL", x, y});
      bcell.oncontextmenu = (ev) => {
        ev.preventDefault();
        this.dispatch({type: "RIGHT_CLICK_CELL", x, y});
      };
      this.appendChild(bcell);
    }
  }
}
