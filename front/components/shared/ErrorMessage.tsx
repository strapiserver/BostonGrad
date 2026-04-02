import { Box, Center, Text } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";

const ErrorMessage = ({
  errorMessage,
  feedback = false,
}: {
  errorMessage: string;
  feedback?: boolean;
}) => {
  return (
    <Center p="2">
      <Box p="2">
        <ResponsiveText size="sm"> {errorMessage} </ResponsiveText>
        {feedback && "feedback"}
      </Box>
    </Center>
  );
};

export default ErrorMessage;
