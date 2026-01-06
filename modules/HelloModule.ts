import { NativeModules } from "react-native";

const { HelloModule } = NativeModules;

if (!HelloModule) {
  throw new Error("HelloModule not linked");
}

export async function sayHello(): Promise<string> {
  return HelloModule.sayHello();
}
