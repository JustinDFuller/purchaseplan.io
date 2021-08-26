import { useState } from "react";

let colors = [
  "#663260",
  "#AD4D69",
  "#E47863",
  "#FFB45C",
  "#F9F871",
  "#0F406B",
  "#00668E",
  "#008DA7",
  "#F2ECFF",
  "#00C897",
  "#65DABA",
];

function generateColor() {
  const color = colors.shift();
  colors.push(color);
  return color;
}

export function Grid() {
  const [grid] = useState(function () {
    const g = [];
    const color = generateColor();
    let started = false;

    for (let i = 0; i < 8; i++) {
      const row = [];

      for (let j = 0; j < 8; j++) {
        const useColor = Math.random() < 0.6;

        let e = "white";

        if (i === 0 || j === 0 || i === 7 || j === 7) {
          row.push(e);
          continue;
        }

        const previousRow = g[i - 1];
        const previousColumn = previousRow[j];
        const previousDiagColumn = previousRow[j - 1];
        const previousDiagRightColumn = previousRow[j + 1];
        if (
          started &&
          previousColumn === "white" &&
          previousDiagColumn === "white" &&
          previousDiagRightColumn === "white" &&
          row[j - 1] === "white"
        ) {
          row.push(e);
          continue;
        }

        if (useColor) {
          e = color;
          started = true;
        }

        row.push(e);
      }

      g.push(row);
    }

    return g;
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {grid.map((row) => (
        <div style={{ height: "12.5%", width: "100%" }}>
          {row.map((column) => (
            <div
              style={{
                display: "inline-block",
                height: "100%",
                width: "12.5%",
                background: column,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
