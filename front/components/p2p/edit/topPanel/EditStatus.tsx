import React, { useEffect } from "react";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setMakerStatus } from "../../../../redux/mainReducer";
import Dot from "../../../exchangers/Dot";
import { statusToColor } from "../../../shared/helper";
import { useMakerEditContext } from "../MakerEditContext";

const statusLabels: Record<"active" | "paused" | "disabled", string> = {
  active: "Активен",
  paused: "Пауза",
  disabled: "Отключен",
};

export default function EditStatus() {
  const maker = useMakerEditContext();
  const dispatch = useAppDispatch();
  const reduxStatus = useAppSelector((state) => state.main.maker?.status);

  useEffect(() => {
    if (reduxStatus !== undefined) return;
    if (maker.status === undefined) return;
    dispatch(setMakerStatus(maker.status ?? undefined));
  }, [dispatch, maker.status, reduxStatus]);

  const effectiveStatus = reduxStatus ?? "paused";

  const updateStatus = (next: "active" | "paused" | "disabled") => {
    dispatch(setMakerStatus(next));
  };

  return (
    <Menu placement="bottom-end" isLazy>
      <MenuButton
        as={Button}
        variant="no_contrast"
        rightIcon={<Dot color={statusToColor(effectiveStatus)} />}
      >
        {statusLabels[effectiveStatus]}
      </MenuButton>
      <MenuList bgColor="bg.800" minW="200px" borderRadius="lg">
        {(["active", "paused", "disabled"] as const).map((status) => (
          <MenuItem
            key={status}
            bgColor="bg.800"
            _hover={{ bgColor: "bg.700" }}
            onClick={() => updateStatus(status)}
          >
            <HStack
              spacing="3"
              w="100%"
              justifyContent="space-between"
              fontWeight="bold"
              color="bg.600"
            >
              <Text>{statusLabels[status]}</Text>
              <Dot color={statusToColor(status)} />
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
