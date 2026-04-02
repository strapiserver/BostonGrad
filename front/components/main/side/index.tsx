import { useColorModeValue, Box, Text, HStack, VStack } from "@chakra-ui/react";
import { Box3D } from "../../../styles/theme/custom";
import AmountInput from "./amountInput";
import PmModalButton from "./pmModalButton";
import { useContext } from "react";
import SideContext from "../../shared/contexts/SideContext";
import { capitalize } from "./selector/section/PmGroup/helper";
import { useAppSelector } from "../../../redux/hooks";
import { codeToRuName, codeToRuName2 } from "../../../redux/amountsHelper";

const Side = () => {
  const side = useContext(SideContext) as "give" | "get";
  const pm = useAppSelector((state) => state.main?.[`${side}Pm`]);

  const pmCur = pm?.currency.code;
  //const infoColor = useColorModeValue("violet.700", "violet.600");
  const articleHref = pm
    ? `/articles/${pm.en_name.toLowerCase().replace(/\s+/g, "-")}`
    : "";
  return (
    <Box3D>
      {/* <Grid
        gridTemplateRows="1fr 30px 1fr"
        gridTemplateColumns="auto 1fr"
        alignItems="center"
        px={["2", "4"]}
        gridAutoFlow=""
        h="92px"
      > */}

      <VStack position="relative" alignItems="start">
        <Box h={{ base: "10px", lg: "20px" }} />
        {/* <Text color="bg.800" fontSize="sm" position="absolute" top="1" left="3">
  
        </Text> */}
        <HStack
          justifyContent="space-between"
          h="30px"
          px="2"
          gap="8"
          alignItems="center"
        >
          <PmModalButton />
          {/* {pmHasArticle && pm ? (
            <Link href={articleHref} aria-label="Open article">
              <Box color="bg.900" display="flex" alignItems="center">
                <IoInformationCircleOutline size="1.2rem" />
              </Box>
            </Link>
          ) : null} */}

          <AmountInput />
        </HStack>
        <Box h={{ base: "20px", lg: "26px" }} />
        {pmCur && (
          <Text
            color="bg.800"
            fontSize="sm"
            position="absolute"
            bottom={{ base: "1", lg: "2" }}
            left="3"
          >
            {`${side === "give" ? "Отдаете" : "Получаете"}  ${codeToRuName(
              pmCur,
            )}`}
          </Text>
        )}
      </VStack>

      {/*     
      </Grid> */}
    </Box3D>
  );
};

export default Side;
