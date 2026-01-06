import { View, Text, Pressable } from "react-native";
import { sayHello } from "../modules/HelloModule";

export default function Home() {
  const testNative = async () => {
    const msg = await sayHello();
    alert(msg);
  };

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Pressable
        onPress={testNative}
        className="bg-white px-6 py-3 rounded-xl"
      >
        <Text className="text-black font-semibold">
          Test Native Module
        </Text>
      </Pressable>
    </View>
  );
}
