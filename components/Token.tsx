import { Text } from "native-base";

export interface TokenProps {
  token: string;
}

export const TokenInfo = ({ token }: TokenProps) => {
  return (
    <>
      <Text color="white" fontSize="md" textTransform="capitalize">
        token:{" "}
        <Text color="white" fontSize="md" fontWeight="medium">
          {token}
        </Text>
      </Text>
    </>
  );
};
