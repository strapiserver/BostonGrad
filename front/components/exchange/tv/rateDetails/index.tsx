import { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Fade,
} from "@chakra-ui/react";
import { addSpaces, R } from "../../../../redux/amountsHelper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { IoInformationCircleOutline } from "react-icons/io5";
import { triggerModal } from "../../../../redux/mainReducer";
import Parameter from "../TopParameter";
import useSWR from "swr";
import { initCMSFetcher } from "../../../../services/fetchers";
import { exchangerQuery } from "../../../../services/queries";
import { IExchanger } from "../../../../types/exchanger";
import { exchangerNameToSlug } from "../../../exchangers/helper";
import Link from "next/link";
import ExchangerName from "../../../shared/ExchangerNameRating";
import { IRate } from "../../../../types/rates";
import ExchangeButton from "../../../exchangers/exchanger/exchangerTopPanel/ExchangeButton";
import TagBadges from "../../../exchangers/exchanger/exchangerTopPanel/TagBadges";
import ReviewStats from "../../../exchangers/exchanger/exchangerStats/ReviewsStats";
import WorkingTimeStats from "../../../exchangers/exchanger/exchangerStats/WorkingTimeStats";
import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";
import FoundError from "../../../articles/pmArticle/FoundError";
import ErrorWrapper from "../../../shared/ErrorWrapper";
import exchanger from "../../../exchangers/exchanger";

const cmsFetcher = initCMSFetcher();

const RateDetails = ({ rate }: { rate: IRate }) => {
  const givePm = useAppSelector((state) => state.main.givePm);
  const getPm = useAppSelector((state) => state.main.getPm);
  const course = rate?.course;
  const amounts = !course ? [0, 0] : course < 1 ? [1, 1 / course] : [course, 1];
  const mainColor = useColorModeValue("violet.700", "violet.600");
  const exchangerName = (rate?.display_name || rate?.name)?.trim();
  const dispatch = useAppDispatch();
  const {
    name: rateName,
    display_name: rateDisplayName,
    admin_rating: rateAdminRating,
    logo: rateLogo,
    ref_link: rateRefLink,
  } = rate;

  const fetchExchanger = async (query: string, name: string) => {
    const timeoutMs = 10000;
    const response = await Promise.race([
      cmsFetcher(query, { name }),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), timeoutMs)
      ),
    ]);
    if (!response) return null;
    if (Array.isArray(response)) {
      return response.length ? (response[0] as IExchanger) : null;
    }
    return response as IExchanger;
  };

  const { data: exchanger, error } = useSWR<IExchanger | null>(
    [exchangerQuery, rate?.name],
    fetchExchanger
  );

  const isLoading = !error && exchanger === undefined;
  const isError = !!error || exchanger === null;

  if (!rate || !givePm || !getPm) {
    return (
      <ErrorWrapper
        isError
        primaryMessage="Missing rate data"
        secondaryMessage="Please refresh and try again"
      />
    );
  }
  const rateProps = [
    {
      name: "Курс:",
      give: amounts[0],
      get: amounts[1],
    },
    {
      name: "Сумма MIN:",
      give: rate.min.give,
      get: rate.min.get,
    },
    {
      name: "Сумма MAX:",
      give: rate.max.give,
      get: rate.max.get,
    },
    {
      name: "Резерв:",
      give: rate.reserve.give,
      get: rate.reserve.get,
    },
  ];

  const baseName = rateDisplayName || rateName || exchangerName || "";
  const baseLogo = rateLogo;
  const baseAdminRating = rateAdminRating;

  const exchangerSlug = exchanger?.name
    ? exchangerNameToSlug(exchanger.name)
    : "";

  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();
  const giveName = givePm.ru_name ?? givePm.en_name ?? "";
  const getName = getPm.ru_name ?? getPm.en_name ?? "";

  // City addon

  // Subgroup
  const giveSubgroup = givePm.subgroup_name ? ` ${givePm.subgroup_name}` : "";
  const getSubgroup = getPm.subgroup_name ? ` ${getPm.subgroup_name}` : "";

  const dirHeader = `${capitalize(
    giveName
  )} ${giveCur} ${giveSubgroup} → ${capitalize(
    getName
  )} ${getCur} ${getSubgroup}`;

  return (
    <Box>
      {exchangerSlug ? (
        <Link
          passHref
          href={`/exchangers/${exchangerSlug}`}
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(triggerModal(undefined));
          }}
        >
          <HStack p="2" gap="2">
            <Box color="violet.600" _hover={{ color: "violet.400" }}>
              <ExchangerName
                name={baseName}
                admin_rating={baseAdminRating}
                logo={baseLogo}
              />
            </Box>

            {!!exchanger?.exchanger_tags?.length && (
              <TagBadges tags={exchanger.exchanger_tags} />
            )}

            <HStack ml="auto" gap="2">
              <Button size="sm" variant="no_contrast" p="2">
                <IoInformationCircleOutline size="1.5rem" />
              </Button>
              <Box display={{ lg: "unset", base: "none" }}>
                <ExchangeButton refLink={rateRefLink} />
              </Box>
            </HStack>
          </HStack>
        </Link>
      ) : (
        <HStack p="2" gap="2">
          <Box color="violet.600">
            <ExchangerName
              name={baseName}
              admin_rating={baseAdminRating}
              logo={baseLogo}
            />
          </Box>

          <HStack ml="auto" gap="2">
            <Button size="sm" variant="no_contrast" p="2">
              <IoInformationCircleOutline size="1.5rem" />
            </Button>
            <Box display={{ lg: "unset", base: "none" }}>
              <ExchangeButton refLink={rateRefLink} />
            </Box>
          </HStack>
        </HStack>
      )}

      {isError && (
        <Box px="2" py="1">
          <Text fontSize="sm" color="bg.700">
            Нет деталей об обменнике
          </Text>
        </Box>
      )}

      <VStack
        alignItems="start"
        gap="2"
        bgColor="bg.1000"
        my="4"
        p="2"
        mx="2"
        borderRadius="lg"
        minH="12"
      >
        {isLoading ? (
          <></>
        ) : (
          <Fade in={true}>
            <ReviewStats reviews={exchanger?.reviews} />
            <WorkingTimeStats
              workingTime={exchanger?.exchanger_card?.working_time}
            />
          </Fade>
        )}
      </VStack>

      <TableContainer my="4" bgColor="bg.1000" borderRadius="md">
        <Table size="sm" colorScheme="bg">
          <Thead>
            <Tr>
              <Th color={mainColor}>{dirHeader}</Th>
              <Th color={mainColor} isNumeric>
                {giveCur}
              </Th>
              <Th color={mainColor} isNumeric>
                {getCur}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rateProps.map((rateProp, index) => (
              <Tr key={index}>
                <Td>{rateProp.name}</Td>
                <Td isNumeric>{addSpaces(R(rateProp.give))}</Td>
                <Td isNumeric>{addSpaces(R(rateProp.get))}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Box display={{ base: "unset", lg: "none" }}>
        <ExchangeButton refLink={rateRefLink} fullWidth />
      </Box>

      <VStack mt="2" p="2" gap="2" alignItems="start">
        {rate.parameterCodes &&
          rate.parameterCodes.map((code, i) => {
            return (
              <>
                <Parameter
                  isExtended
                  code={code}
                  key={rate.exchangerId + code + i}
                  needDescription={true}
                />
                <Divider />
              </>
            );
          })}
      </VStack>
      <FoundError />
    </Box>
  );
};

export default RateDetails;

// onClick={() =>
//   dispatch(
//     sendToast({
//       status: "warning",
//       title: "Пожалуйста свяжитесь с нами t.me/p2pie",
//       timeBeforeClosing: 7000,
//     })
//   )
// }
