import { Box, Tooltip } from "@chakra-ui/react";
import { BiInfoCircle } from "react-icons/bi";

const InfoTooltip = ({ text }: { text: string }) => {
  return (
    <Tooltip label={text}>
      <Box>
        <BiInfoCircle size="1rem" />
      </Box>
    </Tooltip>
  );
};

export default InfoTooltip;
