import {
  Flex,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Box3D } from "../../../../../styles/theme/custom";
import SideContext from "../../../../shared/contexts/SideContext";
import TabSide from "./tab-side";

const PopularRates = () => {
  const pink = useColorModeValue("pink.400", "pink.200");
  const green = useColorModeValue("green.400", "green.200");
  return (
    <Tabs isFitted variant="solid-rounded" w="100%">
      <Flex justifyContent="center">
        <Box3D w="calc(100% - 32px)">
          <TabList mb="2" bgColor="transparent" m="0 !important">
            <Tab
              _selected={{ bgColor: green, color: "green.800" }}
              borderRadius="2xl"
            >
              Buy
            </Tab>
            <Tab
              _selected={{ bgColor: pink, color: "pink.800" }}
              borderRadius="2xl"
            >
              Sell
            </Tab>
          </TabList>
        </Box3D>
      </Flex>

      <TabPanels>
        <TabPanel>
          <SideContext.Provider value="buy">
            <TabSide />
          </SideContext.Provider>
        </TabPanel>
        <TabPanel>
          <SideContext.Provider value="sell">
            <TabSide />
          </SideContext.Provider>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default PopularRates;
