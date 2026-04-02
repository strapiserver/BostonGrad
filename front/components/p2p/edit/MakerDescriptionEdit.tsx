import { Divider, Box, Textarea } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMakerDescription } from "../../../redux/mainReducer";

export default function MakerDescriptionEdit({
  description,
}: {
  description?: string | null;
}) {
  const dispatch = useAppDispatch();
  const reduxDescription = useAppSelector(
    (state) => state.main.maker?.description,
  );

  useEffect(() => {
    if (reduxDescription !== undefined) return;
    if (description === undefined) return;
    dispatch(setMakerDescription(description));
  }, [description, dispatch, reduxDescription]);

  const value = reduxDescription ?? "";
  return (
    <BoxWrapper>
      <CustomHeader text="Описание" Icon={IoMdInformationCircle} />
      <Divider my="4" />
      <Box px="2" color="bg.700">
        <Textarea
          size="lg"
          rows={3}
          color={"bg.600"}
          bgColor="blackAlpha.100"
          boxShadow="none !important"
          _focus={{
            borderColor: "violet.800",
          }}
          placeholder={"Ваше описание"}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            dispatch(setMakerDescription(e.target.value))
          }
          //  onKeyDown={(event) => {
          //    if (event.key === "Enter") {
          //      event.preventDefault();
          //      handleBookmarkSave();
          //    }
          //  }}
          _placeholder={{ color: "bg.800" }}
        />
      </Box>
    </BoxWrapper>
  );
}
