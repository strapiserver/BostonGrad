import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { Box3D } from "../../../../../../styles/theme/custom";
import { IPopularRate } from "../../../../../../types/rates";
import {
  Box,
  Button,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import PmFullName from "../../../../../shared/PmFullName";

import {
  codeToSymbol,
  addSpaces,
  R,
} from "../../../../../../redux/amountsHelper";
import { capitalize } from "../../../../side/selector/section/PmGroup/helper";
import { useContext } from "react";
import SideContext from "../../../../../shared/contexts/SideContext";
import CircularIcon from "../../../../../shared/CircularIcon";
import { useRouter } from "next/router";
import { triggerModal } from "../../../../../../redux/mainReducer";

const RateLayer = ({
  code,
  rates,
}: {
  code: string;
  rates: IPopularRate[];
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pms = useAppSelector((state) => state.main.pms);
  const findPmByCode = (c: string) =>
    pms.find((pm) => pm.code.toUpperCase() === c);
  const cryptoPm = findPmByCode(code);
  const side = useContext(SideContext) as "buy" | "sell";
  const mainColor = useColorModeValue("violet.700", "violet.600");

  if (!cryptoPm) return null;
  const normalizedRates = Array.isArray(rates) ? rates : [];

  return (
    <Box3D p={["2", "4"]} mb="4" key={code}>
      <PmFullName pm={cryptoPm} />

      <TableContainer mt="4">
        <Table size="sm" colorScheme="bg">
          <Thead>
            <Tr>
              <Th color={mainColor}>{side === "buy" ? "Pay by" : "Receive"}</Th>
              <Th color={mainColor} isNumeric>
                best offer
              </Th>
              <Th color={mainColor}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {normalizedRates.map((rate) => {
              const pm = findPmByCode(rate.fiat);
              if (!pm) return null;
              const name = capitalize(pm.en_name);
              const course = `~ ${codeToSymbol(pm.currency.code)} ${addSpaces(
                R(rate.course)
              )}`;
              const slug = "";
              return (
                <Tr key={`${rate.exchangerId}-${rate.fiat}`}>
                  <Td>
                    <HStack>
                      <CircularIcon color={pm.color} size="sm" icon={pm.icon} />{" "}
                      <Text>{name}</Text>
                    </HStack>
                  </Td>
                  <Td isNumeric>{course}</Td>
                  <Td isNumeric>
                    <Button
                      colorScheme={side === "buy" ? "green" : "pink"}
                      size="xs"
                      px="1"
                      mt="1"
                      minH="6"
                      borderRadius="lg"
                      onClick={() => {
                        if (slug) {
                          void router.push(slug);
                        }
                        dispatch(triggerModal("popular-rates"));
                      }}
                    >
                      {`${capitalize(
                        side
                      )} ${cryptoPm.currency.code.toUpperCase()}`}
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {/* <Text textAlign="end" mt="2" color="bg.800">
          Total Exchangers: 72
        </Text> */}
      </TableContainer>
    </Box3D>
  );
};

export default RateLayer;
