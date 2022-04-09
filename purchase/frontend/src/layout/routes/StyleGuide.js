import * as Layout from "layout";
import { colors, theme, themes } from "styles";

import * as Tracking from "tracking";

function Blocks({ obj, omit = {} }) {
  return (
    <div
      style={{
        display: "flex",
        direction: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {Object.keys(obj)
        .filter((key) => !omit[key])
        .map((color) => (
          <div
            key={color}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 20,
              width: "49%",
            }}
          >
            <h3
              style={{
                color: theme.textColor,
                display: "block",
                width: "!00%",
              }}
            >
              {color}
            </h3>
            <div
              style={{
                display: "block",
                borderColor: theme.borderColor,
                borderWidth: 1,
                borderStyle: "solid",
                background: obj[color],
                width: "100%",
                height: 50,
                borderRadius: 5,
              }}
            />
          </div>
        ))}
    </div>
  );
}

export function StyleGuide() {
  Tracking.hooks.useOnce({ Type: "view", name: "layout_styleguide" });

  return (
    <>
      <Layout.components.Card>
        <div>
          <h2 style={{ color: theme.textColor, marginBottom: 20 }}>Colors</h2>
          <Blocks obj={colors} />
        </div>
      </Layout.components.Card>
      <Layout.components.Card>
        <div>
          <h2 style={{ color: theme.textColor, marginBottom: 20 }}>
            Dark Theme
          </h2>
          <Blocks obj={themes.dark} omit={colors} />
        </div>
      </Layout.components.Card>
      <Layout.components.Card>
        <div>
          <h2 style={{ color: theme.textColor, marginBottom: 20 }}>
            Light Theme
          </h2>
          <Blocks obj={themes.light} omit={colors} />
        </div>
      </Layout.components.Card>
    </>
  );
}

StyleGuide.path = "/app/styleguide";
