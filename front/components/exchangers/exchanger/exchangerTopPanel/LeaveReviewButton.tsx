import { Button } from "@chakra-ui/react";
import { TbPencilPlus } from "react-icons/tb";

const LeaveReviewButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    w={{ lg: "unset", base: "100%" }}
    variant={{ lg: "no_contrast", base: "extra_contrast" }}
    rightIcon={<TbPencilPlus size="1.2rem" />}
    onClick={onClick}
  >
    Оставить отзыв
  </Button>
);

export default LeaveReviewButton;
