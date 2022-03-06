import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

export function Error() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#0a0a1a",
      }}
    >
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={60}
        height={60}
        fill="orange"
        className="prefix__bi prefix__bi-cone-striped"
        viewBox="0 0 16 16"
      >
        <Path d="M9.97 4.88l.953 3.811C10.159 8.878 9.14 9 8 9c-1.14 0-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12zm-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4c.618 0 1.2-.036 1.725-.098zm4.396 8.613a.5.5 0 01.037.96l-6 2a.5.5 0 01-.316 0l-6-2a.5.5 0 01.037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257 2.391.598z" />
      </Svg>
      <Text
        style={{
          color: "white",
          textAlign: "center",
          marginTop: 15,
          fontSize: 20,
        }}
      >
        Looks like there's a problem right now.
      </Text>
      <Text
        style={{
          color: "white",
          textAlign: "center",
          marginTop: 5,
          fontSize: 20,
        }}
      >
        Please try again later.
      </Text>
    </View>
  );
}
