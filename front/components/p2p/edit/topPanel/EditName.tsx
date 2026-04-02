import React, { ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { MdModeEdit } from "react-icons/md";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  setMakerTelegramName,
  setMakerTelegramUsername,
  triggerModal,
} from "../../../../redux/mainReducer";
import { useMakerEditContext } from "../MakerEditContext";

export default function EditName() {
  const maker = useMakerEditContext();
  const dispatch = useAppDispatch();
  const modalId = `edit_name_${maker.id}`;

  const reduxName = useAppSelector((state) => state.main.maker?.telegram_name);
  const reduxUsername = useAppSelector(
    (state) => state.main.maker?.telegram_username,
  );

  useEffect(() => {
    if (reduxName === undefined && maker.telegram_name !== undefined) {
      dispatch(setMakerTelegramName(maker.telegram_name));
    }
    if (reduxUsername === undefined && maker.telegram_username !== undefined) {
      dispatch(setMakerTelegramUsername(maker.telegram_username));
    }
  }, [
    dispatch,
    maker.telegram_name,
    maker.telegram_username,
    reduxName,
    reduxUsername,
  ]);

  const nameValue = reduxName ?? "";
  const usernameValue = reduxUsername ?? "";

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMakerTelegramName(event.target.value));
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMakerTelegramUsername(event.target.value));
  };

  return (
    <>
      <CustomModal id={modalId} header="Редактировать имя">
        <VStack align="stretch" spacing="4" p="6">
          <FormControl>
            <FormLabel>Имя</FormLabel>
            <Input
              value={nameValue}
              onChange={handleNameChange}
              placeholder="Введите имя"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Telegram username</FormLabel>
            <Input
              value={usernameValue}
              onChange={handleUsernameChange}
              placeholder="@username"
            />
          </FormControl>
          <HStack justifyContent="flex-end">
            <Button
              variant="primary"
              onClick={() => dispatch(triggerModal(undefined))}
            >
              Готово
            </Button>
          </HStack>
        </VStack>
      </CustomModal>

      <Box
        mr="auto"
        cursor="pointer"
        filter=" brightness(0.8)"
        onClick={() => dispatch(triggerModal(modalId))}
        _hover={{ filter: " brightness(1.1)" }}
      >
        <MdModeEdit size="1.2rem" />
      </Box>
    </>
  );
}
