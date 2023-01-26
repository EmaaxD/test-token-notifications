import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { NativeBaseProvider, VStack, Text } from "native-base";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import { MainTitle } from "./components/Title";
import { ButtonNotification } from "./components/Button";
import { TokenInfo } from "./components/Token";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Hello",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token || "")
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <LinearGradient
      colors={["#8EC5FC", "#E0C3FC"]}
      style={{
        flex: 1,
        paddingVertical: 80,
        paddingHorizontal: 50,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <NativeBaseProvider>
        <VStack flex={1} justifyContent="space-between" alignItems="center">
          <MainTitle title="test push notifications" />

          <VStack space={3} alignItems="center">
            <ButtonNotification
              title="Press to Send Notification"
              onHandlePress={async () => {
                await sendPushNotification(expoPushToken);
              }}
            />

            <TokenInfo token={expoPushToken} />
          </VStack>

          <Text
            color="white"
            fontSize="lg"
            fontWeight="semibold"
            textTransform="capitalize"
          >
            made ❤️ by emanuel mamani
          </Text>
        </VStack>
      </NativeBaseProvider>
    </LinearGradient>
  );
}
