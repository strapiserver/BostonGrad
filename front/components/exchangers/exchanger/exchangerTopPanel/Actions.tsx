import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  HiBookmark,
  HiHeart,
  HiOutlineBookmark,
  HiOutlineHeart,
} from "react-icons/hi";
import CustomModal from "../../../shared/CustomModal";

import { IExchanger } from "../../../../types/exchanger";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import exchanger from "..";

const storageKeys = {
  bookmark: (id: string) => `exchanger:${id}:bookmark`,
  liked: (id: string) => `exchanger:${id}:liked`,
};

const Actions = ({ id, displayName }: { displayName: string; id: string }) => {
  const dispatch = useAppDispatch();
  const inputColor = useColorModeValue("violet.700", "violet.600");

  const bookmarkStorageKey = useMemo(() => storageKeys.bookmark(id), [id]);
  const likedStorageKey = useMemo(() => storageKeys.liked(id), [id]);

  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState("");
  const [bookmarkLoaded, setBookmarkLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedLiked = localStorage.getItem(likedStorageKey);
    setLiked(storedLiked === "true");
  }, [likedStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBookmarkLoaded(false);
    const storedBookmark = localStorage.getItem(bookmarkStorageKey) ?? "";
    setBookmark(storedBookmark);
    setBookmarkLoaded(true);
  }, [bookmarkStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !bookmarkLoaded) return;

    if (bookmark) {
      localStorage.setItem(bookmarkStorageKey, bookmark);
    } else {
      localStorage.removeItem(bookmarkStorageKey);
    }
  }, [bookmark, bookmarkLoaded, bookmarkStorageKey]);

  const initialLikes = useMemo(
    () => (!(displayName.length % 3) ? 0 : 1) + Number(liked),
    [displayName.length, liked],
  );

  const handleLike = () => {
    setLiked((prev) => {
      const nextValue = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(likedStorageKey, String(nextValue));
      }
      return nextValue;
    });
  };

  const handleBookmarkOpen = () => dispatch(triggerModal("exchangerBookmark"));
  const closeBookmarkModal = () => dispatch(triggerModal(undefined));

  const handleBookmarkSave = () => {
    closeBookmarkModal();
  };

  const handleBookmarkClear = () => {
    setBookmark("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(bookmarkStorageKey);
    }
    closeBookmarkModal();
  };

  return (
    <Flex
      gap="2"
      alignItems="stretch"
      flexWrap={{ base: "wrap", lg: "nowrap" }}
      flexDir="row"
      justifyContent="start"
      ml="auto"
    >
      <Button
        p="0"
        w="4"
        variant="no_contrast"
        onClick={handleBookmarkOpen}
        color={bookmark ? "red.400" : "bg.200"}
      >
        <CustomModal
          id={"exchangerBookmark"}
          header={"Добавьте пометку для себя"}
        >
          <Box p="4">
            <Textarea
              size="lg"
              rows={3}
              color={inputColor}
              boxShadow="none !important"
              placeholder={"Ваш комментарий"}
              value={bookmark}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setBookmark(e.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleBookmarkSave();
                }
              }}
              _placeholder={{ color: "bg.800" }}
            />
            <HStack mt="4" spacing="4" justifyContent="end">
              <Button onClick={handleBookmarkClear}>Отмена</Button>
              <Button variant="primary" onClick={handleBookmarkSave}>
                Сохранить
              </Button>
            </HStack>
          </Box>
        </CustomModal>
        {bookmark ? (
          <HiBookmark size="1.2rem" />
        ) : (
          <HiOutlineBookmark size="1.2rem" />
        )}
      </Button>

      <Button
        variant="no_contrast"
        onClick={handleLike}
        fontWeight="unset"
        px="2"
        color={liked ? "red.400" : "bg.200"}
        rightIcon={
          liked ? <HiHeart size="1rem" /> : <HiOutlineHeart size="1rem" />
        }
      >
        <Text mt="0.5" fontWeight="semi-bold">
          {initialLikes}
        </Text>
      </Button>
    </Flex>
  );
};

export default Actions;
