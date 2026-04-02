import React from "react";
import CustomModal from "../../../shared/CustomModal";
import SaveDetails from "./SaveDetails";
import { Button } from "@chakra-ui/react";
import { IoMdSave } from "react-icons/io";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { fetchTelegramConfirmationStatus } from "../../../../services/hooks/telegramConfirmPolling";
import { saveProjectP2P } from "../../../../redux/thunks";
import { useMakerEditContext } from "../MakerEditContext";

export default function SaveMaker({
  isBig = false,
}: {
  isBig?: boolean;
}) {
  const maker = useMakerEditContext();
  const dispatch = useAppDispatch();
  const telegramUsername = maker.telegram_username.replace(/^@/, "");

  const handleSaveProject = async (event: any) => {
    event?.stopPropagation();

    //dispatch(triggerModal(`save_${telegramUsername}`));
    // dispatch(
    //   saveProjectP2P({
    //     makerId: String(maker.id),
    //     makerSlug: telegramUsername,
    //   }),
    // );

    const alreadyConfirmed =
      await fetchTelegramConfirmationStatus(telegramUsername);

    if (alreadyConfirmed) {
      dispatch(
        saveProjectP2P({
          makerId: String(maker.id),
          makerSlug: telegramUsername,
          confirmed: true,
        }),
      );
      return;
    }

    dispatch(triggerModal(`save_${telegramUsername}`));
  };

  return (
    <>
      <CustomModal
        id={`save_${telegramUsername}`}
        header="Публикация предложения обмена "
      >
        <SaveDetails />
      </CustomModal>
      {!isBig ? (
        <Button variant="primary" onClick={(e) => handleSaveProject(e)}>
          <IoMdSave size="1.2rem" />
        </Button>
      ) : (
        <Button
          variant="primary"
          rightIcon={<IoMdSave size="1.2rem" />}
          onClick={(e) => handleSaveProject(e)}
        >
          Опубликовать
        </Button>
      )}
    </>
  );
}
