import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import { IFullOffer, IMakerOffer } from "../../../../../../types/p2p";
import { InputGroup, NumberInput, NumberInputField } from "@chakra-ui/react";
import {
  codeToSymbol,
  powerOfTenOrder,
} from "../../../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../../../styles/theme/custom";

export default function OfferLimit({
  index,
  field,
  suggested,
  fullOffer,
}: {
  index: number;
  field: "min" | "max";
  suggested?: number;
  fullOffer: Partial<IFullOffer>;
}) {
  const dispatch = useAppDispatch();

  const setField = (
    value: IMakerOffer[keyof IMakerOffer] | null | undefined,
  ) => {
    dispatch(setP2PFullOfferField({ index, field, value }));
  };

  const formatPlain = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", {
          useGrouping: false,
          maximumFractionDigits: 20,
        })
      : "";

  const [value, setValue] = useState("");
  const isEditingRef = useRef(false);
  const [isEditing, setIsEditing] = useState(false);

  const fieldValue = fullOffer?.[field];
  const side = fullOffer.side;

  const pm =
    side === "give" || side === "get" ? fullOffer[`${side}Pm`] : undefined;
  const cur = pm?.currency?.code?.toUpperCase();

  const normalizedValue = fieldValue == null ? "" : fieldValue;
  const normalizedDisplay =
    normalizedValue === "" ? "" : formatPlain(Number(normalizedValue));
  const editedDisplay =
    value === "" ? normalizedDisplay : formatPlain(Number(value));
  const displayValue = isEditing ? value : editedDisplay;

  useEffect(() => {
    if (isEditingRef.current) return;
    setValue(normalizedValue === "" ? "" : String(normalizedValue));
  }, [normalizedValue]);

  // const calcWidth = () => {
  //   const l = String(displayValue).length;
  //   if (l > 10) return 180;
  //   if (l > 8) return 150;
  //   if (l > 6) return 120;
  //   return 100;
  // };
  const stepValue = powerOfTenOrder(Number(displayValue)) / 100;

  const ruName = field == "min" ? "Мин: " : "Макс: ";

  return (
    <InputGroup>
      <ResponsiveText mr="2">{ruName}</ResponsiveText>
      <NumberInput
        value={displayValue || suggested}
        isValidCharacter={(v) => !!v.match(/^[Ee0-9+\.,]$/)}
        step={stepValue}
        borderWidth="2px"
        borderRadius="md"
        borderColor={"bg.600"}
        focusBorderColor="violet.600"
        size="xs"
        position="relative"
        max={100000000}
        w={110}
        min={0} // no negative
      >
        <NumberInputField
          pr="1"
          py="0"
          float="right"
          border="none"
          textAlign="end"
          placeholder={"0.00"}
          fontFamily="'Mozilla Text', monospace"
          fontSize="lg"
          value={displayValue} // use raw value for instant update
          _placeholder={{ color: "bg.800" }}
          w="100%"
          onChange={(e) => {
            isEditingRef.current = true;
            setIsEditing(true);
            const raw = e.target.value.replace(",", ".");
            setValue(raw);
            const trimmed = raw.trim();
            if (trimmed === "") {
              setField(null);
              return;
            }
            if (trimmed.endsWith(".") || trimmed.endsWith(",")) {
              return;
            }
            const parsed = Number(trimmed);
            if (!Number.isFinite(parsed)) return;
            setField(parsed);
          }}
        />
      </NumberInput>
      <ResponsiveText ml="2">{codeToSymbol(cur)}</ResponsiveText>
    </InputGroup>
  );
}
