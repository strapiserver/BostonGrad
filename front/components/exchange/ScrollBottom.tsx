import { Button } from "@chakra-ui/react";

const ScrollBottom = () => {
  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <Button variant="default" onClick={handleScrollToBottom} w="100%" mt="5">
      START
    </Button>
  );
};

export default ScrollBottom;
