
import StatefulHTML from './StatefulHTML.js';
import { smartGet } from '../utils/arraysAndObjects.js';
import { colors } from '../state/rootReducer.js';


export default class MineCell extends StatefulHTML {
  connectedCallback() {
    const x = parseInt(this.getAttribute("x"));
    const y = parseInt(this.getAttribute("y"));

    const { grid } = this.getState();

    const cell = smartGet(grid ?? {}, { x, y });

    if (cell?.visible && !cell?.flagged) {
      const dcell = document.createElement("div");
      let styleStr = `color: ${colors[cell.value]};`
      if (cell.exploded) {
        styleStr += "background-color: pink";
      }
      dcell.style = styleStr;
      dcell.appendChild(document.createTextNode(cell.value));
      this.appendChild(dcell);
    } else if (cell?.flagged) {
      const dcell = document.createElement("div");
      if (cell.visible && cell.value == "💣") {
        dcell.style = "background-color: lightgreen";
      }
      dcell.onclick = () => this.dispatch({ type: "CLICK_CELL", x, y });
      dcell.oncontextmenu = (ev) => {
        ev.preventDefault();
        this.dispatch({ type: "CLICK_CELL", x, y });
      };
      dcell.appendChild(document.createTextNode("🚩"));
      this.appendChild(dcell);
    } else {
      const bcell = document.createElement("button");
      bcell.onclick = () => this.dispatch({ type: "CLICK_CELL", x, y });
      bcell.oncontextmenu = (ev) => {
        ev.preventDefault();
        this.dispatch({ type: "RIGHT_CLICK_CELL", x, y });
      };
      this.appendChild(bcell);
    }
  }
}
