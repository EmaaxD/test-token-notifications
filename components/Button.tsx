import { Button } from "native-base";

export interface ButtonNotificationProps {
  title: string;
  onHandlePress: () => void;
}

export const ButtonNotification = ({
  title,
  onHandlePress,
}: ButtonNotificationProps) => {
  return (
    <>
      <Button
        variant="solid"
        backgroundColor="purple.600"
        shadow={2}
        _text={{ color: "white" }}
        onPress={onHandlePress}
      >
        {title}
      </Button>
    </>
  );
};
