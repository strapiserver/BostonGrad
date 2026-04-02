import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { RxCross2 } from "react-icons/rx";

import { RiDeleteBin2Fill } from "react-icons/ri";
import { useAppDispatch } from "../../../../../redux/hooks";
import { removeP2PDirection } from "../../../../../redux/mainReducer";

export default function DeleteOffer({
  index,
  isFull,
}: {
  index: number;
  isFull?: boolean;
}) {
  const dispatch = useAppDispatch();

  const handleDelete = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    dispatch(removeP2PDirection(index));
  };

  return (
    <Menu placement="bottom-end" isLazy>
      <MenuButton
        as={Button}
        onClick={(event) => (!isFull ? handleDelete(event) : null)}
        variant={isFull ? "error" : "ghost"}
      >
        <RiDeleteBin2Fill size="1.2rem" />
      </MenuButton>
      <MenuList bgColor="red.800" minW="200px" zIndex="500">
        <MenuItem
          bgColor="red.800"
          _hover={{
            bgColor: "red.700",
          }}
          onClick={handleDelete}
        >
          <HStack spacing="3" color="bg.600">
            <RxCross2 size="1rem" />
            <span>Удалить предложение</span>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
