import {
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";
import { batch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import { powerOfTenOrder, R } from "../../../../../../redux/amountsHelper";

const CourseAmountInput = ({
  index,
  side,
}: {
  index: number;
  side: "give" | "get";
}) => {
  const dispatch = useAppDispatch();
  const activeSide = useAppSelector(
    (state) => state.main.p2pFullOffers[index]?.side,
  );
  const isActive = useAppSelector(
    (state) => state.main.p2pFullOffers[index]?.side == side,
  );

  const course = useAppSelector(
    (state) => state.main.p2pFullOffers[index]?.course || 0,
  );

  const formatPlain = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", {
          useGrouping: false,
          maximumFractionDigits: 20,
        })
      : "";

  const getNormalizedValue = (targetSide: "give" | "get") => {
    if (!course) return "";
    if (activeSide === "give") {
      return targetSide === "give" ? course : 1;
    }
    if (activeSide === "get") {
      return targetSide === "give" ? 1 : 1 / course;
    }
    return "";
  };

  const setActive = () => {
    if (isActive) return;
    batch(() => {
      dispatch(
        setP2PFullOfferField({
          index,
          field: "side",
          value: side,
        }),
      );
    });
  };

  //   const course =
  //     fullOfferCourse !== undefined && fullOfferCourse !== null
  //       ? String(fullOfferCourse)
  //       : "";

  const [value, setValue] = useState("");
  const isEditingRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);

  const normalizedValue = getNormalizedValue(side);
  const normalizedDisplay =
    normalizedValue === "" ? "" : formatPlain(R(Number(normalizedValue), 1));
  const editedDisplay =
    value === "" ? normalizedDisplay : formatPlain(R(Number(value), 1));
  const displayValue = isActive
    ? isEditing
      ? value
      : editedDisplay
    : normalizedDisplay;

  useEffect(() => {
    if (!isActive) return;
    if (isEditingRef.current) return;
    const nextValue = getNormalizedValue(side);
    setValue(nextValue === "" ? "" : String(nextValue));
  }, [course, isActive, side, activeSide]);

  const calcWidth = () => {
    const l = String(displayValue).length;
    if (l > 10) return 180;
    if (l > 8) return 150;
    if (l > 6) return 120;
    return 100;
  };
  const stepValue = powerOfTenOrder(Number(displayValue)) / 100;

  return (
    <InputGroup>
      <NumberInput
        onFocus={setActive}
        onClick={setActive}
        value={displayValue}
        isValidCharacter={(v) => !!v.match(/^[Ee0-9+\.,]$/)}
        step={stepValue}
        size="xs"
        position="relative"
        max={100000000}
        borderWidth="2px"
        borderRadius="md"
        borderColor={isActive ? "violet.900" : "bg.600"}
        focusBorderColor="violet.600"
        w={`${calcWidth()}px`}
        isReadOnly={!isActive}
        min={0} // no negative
      >
        {isActive && (
          <NumberInputStepper
            position="absolute"
            left="-0.5"
            right="auto"
            border="none"
            w="5"
            zIndex="10"
          >
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        )}
        <NumberInputField
          pr="1"
          py="0"
          float="right"
          textAlign="end"
          placeholder={"0.00"}
          fontFamily="'Mozilla Text', monospace"
          fontSize="lg"
          value={displayValue} // use raw value for instant update
          _placeholder={{ color: "bg.800" }}
          w="100%"
          border="none"
          onChange={(e) => {
            if (!isActive) return;
            isEditingRef.current = true;
            setIsEditing(true);
            const raw = e.target.value.replace(",", ".");
            setValue(raw);
            const trimmed = raw.trim();
            if (trimmed === "") {
              dispatch(
                setP2PFullOfferField({
                  index,
                  field: "course",
                  value: null,
                }),
              );
              return;
            }
            if (trimmed.endsWith(".") || trimmed.endsWith(",")) {
              return;
            }
            const parsed = Number(trimmed);
            if (!Number.isFinite(parsed)) return;
            const nextCourse =
              side === "get" ? (parsed > 0 ? 1 / parsed : 0) : parsed;
            dispatch(
              setP2PFullOfferField({
                index,
                field: "course",
                value: nextCourse,
              }),
            );
          }}
        />
      </NumberInput>
    </InputGroup>
  );
};

export default CourseAmountInput;
