// MultiSelectMenu.tsx
import React, { useContext } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Checkbox,
  Box,
  VStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { IPm } from "../../../../types/selector";
import PmIcon from "../../../shared/PmIcon";
import { ResponsiveText } from "../../../../styles/theme/custom";
import PmName from "../../../shared/PmName";
import { IoIosArrowDown } from "react-icons/io";
import { useAppDispatch } from "../../../../redux/hooks";
import { setMassPmsFilter } from "../../../../redux/mainReducer";
import MassSideContext from "../../sideContext";

export type Option = { value: string; label: string };

type Props = {
  defaultValue?: string[]; // uncontrolled initial
  fiatPms: Record<string, IPm>;
};

export const MultiSelectMenu: React.FC<Props> = ({
  fiatPms,
  defaultValue = [],
}) => {
  const maxTagToShow =
    useBreakpointValue({
      base: 4,
      md: 8,
    }) ?? 8;
  const [selected, setSelected] = React.useState<string[]>(defaultValue);
  const { isSell } = useContext(MassSideContext);

  const dispatch = useAppDispatch();

  const saveSelection = () => {
    dispatch(setMassPmsFilter(selected));
  };

  const removeAll = () => {
    setSelected([]);
    dispatch(setMassPmsFilter([]));
  };

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    setSelected(next);
  };

  const selectedOptions =
    selected.length === 0
      ? Object.keys(fiatPms)
      : Object.keys(fiatPms).filter((code) => selected.includes(code));

  const buttonContent = (
    <HStack align="center" mt="1">
      {selectedOptions.slice(0, maxTagToShow).map((code) => (
        <Box key={code} mx="-1.5">
          <PmIcon pm={fiatPms[code]} />
        </Box>
      ))}
      {selectedOptions.length > maxTagToShow && (
        <ResponsiveText size="xs" mb="1">
          +{selectedOptions.length - maxTagToShow}
        </ResponsiveText>
      )}
    </HStack>
  );

  return (
    <Menu closeOnSelect={false} autoSelect={false} onClose={saveSelection}>
      <MenuButton
        as={Button}
        rightIcon={
          <Box display={{ base: "none", md: "inline-flex" }}>
            <IoIosArrowDown />
          </Box>
        }
        minW="100"
        width={{ lg: "520px", base: "unset" }}
        textAlign="left"
        h="45px"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Box flex="1" minW="0">
            {buttonContent}
          </Box>
        </Box>
      </MenuButton>

      <MenuList bgColor="bg.800" maxH="400" overflowY="auto">
        {!!selected.length && (
          <Button
            w="100%"
            borderRadius="none"
            onClick={removeAll}
            leftIcon={<IoMdClose size="1.2rem" />}
          >
            Снять выбор
          </Button>
        )}
        <VStack spacing={0} align="stretch" width="200px" p="1">
          {Object.entries(fiatPms).map(([code, pm]) => {
            const isChecked = selected.includes(code);
            return (
              <MenuItem
                bgColor="transparent"
                key={code}
                onClick={(e) => {
                  // clicking the MenuItem toggles selection, but because closeOnSelect=false
                  // the menu stays open. Stop propagation to prevent weird focus issues.
                  e.stopPropagation();
                  toggle(code);
                }}
                closeOnSelect={false}
                cursor="pointer"
                py="2"
              >
                <HStack width="100%" spacing={3}>
                  <Checkbox
                    isChecked={isChecked}
                    pointerEvents="none" // <== makes it a visual indicator only
                    tabIndex={-1} // keeps keyboard focus on Menu
                  />
                  <PmName pm={pm} isFull={false} />
                </HStack>
              </MenuItem>
            );
          })}
        </VStack>
      </MenuList>
    </Menu>
  );
};

export default MultiSelectMenu;
