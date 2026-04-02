import {
  Grid,
  Button,
  Box,
  Text,
  Tooltip,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { HiReply } from "react-icons/hi";
import CustomModal from "../../../shared/CustomModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import {
  resetReplyText,
  selectReplyText,
  setReplyText,
} from "../../../../redux/leaveFeedbackSlice";

export default function ReplyText({
  text,
  canReply,
}: {
  text?: string | null;
  canReply?: boolean;
}) {
  const dispatch = useAppDispatch();
  const replyText = useAppSelector(selectReplyText);

  const handleClose = () => {
    dispatch(resetReplyText());
    dispatch(triggerModal(undefined));
  };

  const handleSend = () => {
    dispatch(resetReplyText());
    dispatch(triggerModal(undefined));
  };

  const handleSubmitClick = () => {
    dispatch(triggerModal("reply"));
  };

  return (
    <Grid gridTemplateColumns="1fr 40px" mt="4">
      <Text whiteSpace="pre-wrap" mt="2">
        {text}
      </Text>
      {canReply && (
        <Tooltip openDelay={500} label={"Ответить"} fontSize="sm">
          <Button size="xs" variant="ghost" onClick={handleSubmitClick}>
            <Box transform="rotate(180deg) scaleX(-1)" color="bg.600">
              <HiReply size="1rem" />
            </Box>
          </Button>

          <CustomModal id={"reply"} header={"Ответить на отзыв"}>
            <Box>
              <Textarea
                placeholder="Ваш комментарий"
                minH="100px"
                borderWidth="2px"
                borderRadius="xl"
                borderColor="violet.800"
                focusBorderColor="violet.500"
                value={replyText}
                onChange={(e) => dispatch(setReplyText(e.target.value))}
              />
              <HStack w="100%" justifyContent={"end"} mt="4">
                <Button
                  alignSelf="flex-end"
                  variant="no_contrast"
                  onClick={handleClose}
                >
                  Отмена
                </Button>
                <Button
                  alignSelf="flex-end"
                  variant="primary"
                  onClick={handleSend}
                >
                  Отправить
                </Button>
              </HStack>
            </Box>
          </CustomModal>
        </Tooltip>
      )}
    </Grid>
  );
}
