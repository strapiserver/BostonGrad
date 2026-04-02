import { Box, Tooltip } from "@chakra-ui/react";
import { resolveColorToken } from "../../../shared/CircularIcon";
import { IExchangerTag } from "../../../../types/exchanger";

const TagBadges = ({ tags }: { tags?: IExchangerTag[] | null }) => {
  if (!tags?.length) return null;

  return (
    <>
      {tags.map((tag) => (
        <Tooltip key={tag.id} openDelay={500} hasArrow label={tag.description}>
          <Box
            borderRadius="md"
            py="0.5"
            px="1"
            my="1"
            bgColor={resolveColorToken(tag.color)}
            color={"bg.900"}
            boxShadow="lg"
            fontSize="xs"
            cursor="pointer"
          >
            {tag.name.toUpperCase()}
          </Box>
        </Tooltip>
      ))}
    </>
  );
};

export default TagBadges;
