import { Box, Grid, HStack, VStack, Text } from "@chakra-ui/react";
import { BsArrowRightShort } from "react-icons/bs";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import { getOtherMass } from "./helper";
import PmIcon from "../shared/PmIcon";
import SmartGrid from "../mass/table/SmartGrid";
import { IMassDirTextId } from "../../types/mass";
import PmName from "../shared/PmName";
import { LinkWrapper } from "../shared/LinkWrapper";

const renderSimilarMass = ({
  similarPmPairs,
  givePm,
  getPm,
  dirTextIds,
}: {
  similarPmPairs: IPm[][];
  givePm: IPm;
  getPm: IPm;
  dirTextIds: IMassDirTextId[];
}) => {
  const pms = getOtherMass(similarPmPairs, givePm, getPm);
  const [side, cryptoPm, fiatPm] =
    givePm.section == "crypto"
      ? ["sell", givePm, getPm]
      : getPm.section == "crypto"
      ? ["buy", getPm, givePm]
      : [];
  const linkExists = dirTextIds.find(
    (dtid) =>
      dtid.code.toLowerCase() == cryptoPm?.code.toLowerCase() &&
      dtid.currency.code.toLowerCase() == fiatPm?.currency.code.toLowerCase()
  );

  if (!linkExists?.code || !pms || !side || !cryptoPm || !fiatPm) return;

  const pmIconsRender = (
    <SmartGrid
      wrapThreshold={3}
      direction={givePm.section == "crypto" ? "end" : "start"}
    >
      {pms.map((pm) => (
        <HStack
          key={pm.code + pm.subgroup_name || pm.en_name}
          borderRadius="lg"
          mx="0.5"
          cursor="pointer"
        >
          <PmIcon pm={pm} />
        </HStack>
      ))}
    </SmartGrid>
  );

  const cryptoPmRender = (
    <VStack alignItems="start" gap="1">
      <PmName pm={cryptoPm} isFull={false} />
      <Text
        fontSize="sm"
        whiteSpace={"nowrap"}
        variant="no_contrast"
        mt="1"
        textAlign="start"
      >
        {`${
          side == "sell" ? "Продать" : "Купить"
        } ${cryptoPm.currency.code.toUpperCase()} за  ${fiatPm.currency.code.toUpperCase()}`}
      </Text>
    </VStack>
  );

  return (
    <LinkWrapper
      url={`/${side}/${cryptoPm.code.toLowerCase()}-for-${fiatPm.currency.code.toLowerCase()}`}
      exists
      fullWidth
    >
      <Box3D
        px="4"
        py="2"
        cursor="pointer"
        transition="filter 0.2s ease-in"
        display="block"
        alignSelf="stretch"
        _hover={{ filter: "brightness(1.1)" }}
        variant="contrast"
        h="77px"
        w="100%"
      >
        <Grid
          gridTemplateColumns={"1fr 40px  1fr"}
          color="bg.800"
          alignItems="center"
          justifyContent="center"
          h="100%"
          columnGap="2"
        >
          {side == "buy" ? pmIconsRender : cryptoPmRender}
          <Box gridColumn="2" justifySelf="center">
            <BsArrowRightShort size="1.5rem" />
          </Box>
          {side == "buy" ? cryptoPmRender : pmIconsRender}
        </Grid>
      </Box3D>
    </LinkWrapper>
  );
};

export default renderSimilarMass;
