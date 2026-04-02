import {
  Box,
  Grid,
  HStack,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { R } from "../../../../redux/amountsHelper";
import { setAmount, setSide } from "../../../../redux/mainReducer";
import SideContext from "../../../shared/contexts/SideContext";
import Fiat from "./Fiat";
import { isOutOfRange } from "./helper";
import { BsFillPinAngleFill } from "react-icons/bs";
import { RxDrawingPinFilled } from "react-icons/rx";

const AmountInput = () => {
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";
  const isActive = useAppSelector((state) => state.main.side == side);
  const textMeasureRef = useRef<HTMLSpanElement | null>(null);
  const [textWidth, setTextWidth] = useState(0);

  const amountOutputs = useAppSelector((state) => state.main.amountOutputs);
  const isEdited = useAppSelector((state) => !!state.main.amountInput);

  const currentRate = useAppSelector(
    (state) => state.main?.dirRates?.[state.main.swiperIdVisible]
  );

  const [min, max] = currentRate
    ? [currentRate.min, currentRate.max]
    : [undefined, undefined];
  const stringValue = amountOutputs[side] || "";
  const rawNumeric =
    useAppSelector((state) =>
      state.main.amountInput?.side === side
        ? state.main.amountInput.num
        : undefined
    ) ?? +stringValue.replaceAll(" ", "");
  const value = Number.isFinite(rawNumeric) ? rawNumeric : 0;
  const outRange = isEdited && isOutOfRange(value, min, max, side);
  const displayValue = stringValue.length > 11 ? "✖" : stringValue || "0";

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!textMeasureRef.current) return;
    setTextWidth(textMeasureRef.current.offsetWidth);
  }, [displayValue]);

  const onAmountChange = (str: string, num: number) => {
    // skip if same or too big
    if (
      (num && value === num && !str.endsWith(".") && !str.endsWith(",")) ||
      str.length > 11
    )
      return;
    dispatch(setAmount({ side, str: str.replace(",", "."), num }));
  };

  const handleSideSelect = () => {
    dispatch(setSide(side));
    if (stringValue.length > 11) return;
    if (!stringValue.trim() && !value) return;
    dispatch(setAmount({ side, num: value, str: String(value) }));
  };

  return (
    <>
      <NumberInput
        mr="2"
        isDisabled={!currentRate}
        step={R(value / 100)}
        //allowMouseWheel
        isValidCharacter={(v) => !!v.match(/^[Ee0-9+\.,]$/)}
        variant="unstyled"
        onChange={onAmountChange}
        onClick={handleSideSelect}
        minW="10"
        zIndex="3"
        value={stringValue.length > 11 ? "✖" : stringValue}
        keepWithinRange={true}
        clampValueOnBlur={true}
        max={100000000}
        min={0} // no negative
        position="relative"
      >
        {isEdited && !!value && (
          <Box
            position="absolute"
            top="50%"
            transform="translateY(-50%) scaleX(-1)"
            right={`${8 + textWidth}px`}
            zIndex="3"
            display={isActive ? "block" : "none"}
            color="bg.800"
          >
            <RxDrawingPinFilled size="0.8rem" />
          </Box>
        )}

        <NumberInputField
          p="0"
          float="right"
          textAlign="end"
          placeholder="0.00"
          fontFamily="'Mozilla Text', monospace"
          fontSize={["2xl", "3xl"]}
          color={
            outRange
              ? "bg.500"
              : isActive
              ? useColorModeValue("violet.800", "violet.600")
              : useColorModeValue("bg.700", "bg.200")
          }
          onClick={(e: any) => {
            e.target.select();
          }}
          _placeholder={{ color: "bg.800" }}
        />

        <Box
          as="span"
          ref={textMeasureRef}
          position="absolute"
          visibility="hidden"
          whiteSpace="pre"
          fontFamily="'Mozilla Text', monospace"
          fontSize={["2xl", "3xl"]}
        >
          {displayValue}
        </Box>

        {/* <Text color="teal.400">{`step: ${step} / fiatStep: ${fiatStep}`}</Text> */}
      </NumberInput>

      <Fiat value={value} min={min} max={max} />
    </>
  );
};

export default AmountInput;
