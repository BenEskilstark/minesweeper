import StatefulHTML from './StatefulHTML.js';

export default class GameBoard extends StatefulHTML {
  connectedCallback() {
    const width = parseInt(this.getAttribute("width"));
    const height = parseInt(this.getAttribute("height"));
    const numBombs = parseInt(this.getAttribute("numBombs"));

    const div = this.querySelector("#grid");
    if (!div) throw "No div found";
    div.style = `display: grid; grid-template-columns: repeat(${width}, 1fr)`;

    this.dispatch({ width, height, numBombs });
    this.render(this.getState());

    if (!window.getState) {
      window.getState = this.getState;
      window.dispatch = this.dispatch;
    }
  }

  render(state) {
    const { width, height, face } = state;

    const topbar = this.querySelector("#topbar");
    topbar.innerHTML = `
      <button style="position: absolute" 
        onclick="closest('stateful-client').dispatch({type: 'RESET'})"
      >
        Restart
      </button>
      <div style="display: inline-block; text-align: center; flex-grow: 1"
        >${face}</div>
    `;

    const div = this.querySelector("#grid");
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


