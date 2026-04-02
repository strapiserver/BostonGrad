import {
  Box,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";

import {
  curToSymbol,
  R,
  addSpaces,
  localFormat,
} from "../../../../redux/amountsHelper";
import { useAppDispatch } from "../../../../redux/hooks";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { IMassRate, IMassDirTextId } from "../../../../types/mass";
import { IPm } from "../../../../types/selector";
import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";
import { useIsMobile } from "../../../exchange/tv/hooks";
import Rating from "../../../exchange/tv/Rating";
import TopParameter from "../../../exchange/tv/TopParameter";
import CustomImage from "../../../shared/CustomImage";
import MassFiat from "../MassFiat";
import SmartGrid from "../SmartGrid";
import { redirect } from "../../../../redux/thunks";
import MassRateAmount from "./MassRateAmount";

const MassRate = ({
  rate,
  fiatPms,
  massDirTextId,
  massAmount,
}: {
  rate: IMassRate;
  fiatPms: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
  massAmount: { code?: string; value: string };
}) => {
  const { name, admin_rating, course, min, max, ref_link, codes, logo } = rate;
  const { code, currency } = massDirTextId;

  const amount =
    massDirTextId.code == massAmount.code
      ? course < 1
        ? (1 / course) * Number(massAmount.value)
        : course * Number(massAmount.value)
      : Number(massAmount.value);

  const side = course > 1 ? "give" : "get";

  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];

  const dispatch = useAppDispatch();

  if (!rate) return <></>;

  const gridCommonProps = {
    key: rate.exchangerId + rate.course,
    w: "100%",
    my: "2" as const,
    bgColor:
      amount && (MIN > amount || MAX < amount) ? "whiteAlpha.100" : "none",
    borderRadius: "lg" as const,
  };

  const handleExchangerClick = () => {
    dispatch(redirect());
    window.open(ref_link, "_blank");
  };

  const renderParametersBig = (suffix: string) => (
    <SmartGrid>
      {rate.parameterCodes.map((code, i) => (
        <TopParameter isExtended={false} code={code} key={code + i + suffix} />
      ))}
    </SmartGrid>
  );

  const renderParametersSmall = (suffix: string) => (
    <HStack>
      {rate.parameterCodes.map((code, i) => (
        <TopParameter
          isExtended={rate.parameterCodes.length < 4}
          code={code}
          key={code + i + suffix}
        />
      ))}
    </HStack>
  );

  const renderRatesSmall = () => (
    <VStack alignItems={"end"} gap="0">
      <MassRateAmount
        massDirTextId={massDirTextId}
        course={course}
        massAmount={massAmount}
      />
      <HStack gap="0.5" flexWrap="wrap" justifyContent={"start"}>
        <ResponsiveText
          size="lg"
          variant={amount && MIN > amount ? "red" : "no_contrast"}
        >
          {`от ${localFormat(MIN, currency.code)}`}
        </ResponsiveText>
        <ResponsiveText size="xs" variant="no_contrast">
          {"—"}
        </ResponsiveText>
        <ResponsiveText
          size="md"
          variant={amount && MAX < amount ? "red" : "no_contrast"}
        >
          {`до ${localFormat(MAX, currency.code)}`}
        </ResponsiveText>
      </HStack>
    </VStack>
  );

  const renderRatesBig = () => (
    <VStack alignItems={"start"} gap="0">
      <MassRateAmount
        massDirTextId={massDirTextId}
        course={course}
        massAmount={massAmount}
      />
      <HStack gap="0.5" flexWrap="wrap" justifyContent={"start"}>
        <ResponsiveText
          size="xs"
          variant={amount && MIN > amount ? "red" : "no_contrast"}
        >
          {`от ${localFormat(MIN, currency.code)}`}
        </ResponsiveText>
        <ResponsiveText size="xs" variant="no_contrast">
          {"—"}
        </ResponsiveText>
        <ResponsiveText
          size="xs"
          variant={amount && MAX < amount ? "red" : "no_contrast"}
        >
          {`до ${localFormat(MAX, currency.code)}`}
        </ResponsiveText>
      </HStack>
    </VStack>
  );

  return (
    <>
      <Grid
        {...gridCommonProps}
        display={{ base: "grid", md: "none" }}
        gridTemplateColumns="1fr"
        rowGap={3}
        px={2}
        py={3}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
          cursor="pointer"
          onClick={handleExchangerClick}
        >
          <HStack alignItems="center" spacing="3">
            <Box borderRadius="xl" overflow="hidden">
              <CustomImage img={logo} w="35px" h="35px" />
            </Box>

            <ResponsiveText
              variant="primary"
              size={name.length > 14 ? "lg" : "xl"}
              fontWeight="bold"
            >
              {capitalize(name)}
            </ResponsiveText>
          </HStack>

          <Rating rating={rate.admin_rating || 4.4} />
        </HStack>
        <HStack justifyContent={"space-between"} px="1">
          <MassFiat codes={rate.codes} fiatPms={fiatPms} ref_link={ref_link} />
          {renderRatesSmall()}
        </HStack>

        <HStack justifyContent={"end"}>
          {renderParametersSmall("mobile-small")}
        </HStack>
      </Grid>

      <Grid
        {...gridCommonProps}
        display={{ base: "none", md: "grid" }}
        gridTemplateColumns="4fr 3rem 100px 10px 4fr 3fr"
        columnGap={["2", "6"]}
        px={2}
        py={1.5}
      >
        <HStack
          alignItems="center"
          justifyContent="space-between"
          cursor="pointer"
          onClick={handleExchangerClick}
        >
          <HStack alignItems="center" spacing="3">
            <Box borderRadius="xl" overflow="hidden">
              <CustomImage img={logo} w="35px" h="35px" />
            </Box>

            <ResponsiveText
              variant="primary"
              size={name.length > 14 ? "sm" : name.length > 10 ? "md" : "lg"}
              fontWeight="bold"
            >
              {capitalize(name)}
            </ResponsiveText>
          </HStack>
        </HStack>

        <Rating rating={rate.admin_rating || 4.4} />

        {renderParametersBig("mobile")}
        <Box />
        {renderRatesBig()}

        <MassFiat codes={rate.codes} fiatPms={fiatPms} ref_link={ref_link} />
      </Grid>
    </>
  );
};

export default MassRate;
