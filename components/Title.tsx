import { Text } from "native-base";

export interface TitleProps {
  title: string;
}

export const MainTitle = ({ title }: TitleProps) => {
  return (
    <>
      <Text
        color="white"
        fontSize="lg"
        fontWeight="medium"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </>
  );
};
