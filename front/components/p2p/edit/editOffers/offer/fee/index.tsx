import React from "react";
import { batch } from "react-redux";
import {
  Button,
  ButtonGroup,
  HStack,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { IFullOffer, IMakerOffer } from "../../../../../../types/p2p";
import { useAppDispatch } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import OfferSwitch from "../OfferSwitch";

export default function OfferFee({
  fullOffer,
}: {
  fullOffer: Partial<IFullOffer>;
}) {
  const dispatch = useAppDispatch();
  const offerIndex = fullOffer.index;
  if (offerIndex === undefined) return null;

  const giveCur = fullOffer.givePm?.currency?.code?.toUpperCase();
  const getCur = fullOffer.getPm?.currency?.code?.toUpperCase();
  const feeType = fullOffer.fee_type;
  const feeAmount = fullOffer.fee_amount;
  const isFeeEnabled =
    fullOffer.fee_enabled ??
    (feeAmount !== null && feeAmount !== undefined ? true : Boolean(feeType));
  const [feeKind, setFeeKind] = React.useState<"commission" | "surcharge">(
    "commission",
  );
  const derivedFeeKind =
    typeof feeAmount === "number"
      ? feeAmount < 0
        ? "surcharge"
        : "commission"
      : feeKind;

  const setField = (
    field: keyof Pick<IMakerOffer, "fee_amount" | "fee_type" | "fee_enabled">,
    value: IMakerOffer[keyof IMakerOffer] | null | undefined,
  ) => {
    dispatch(setP2PFullOfferField({ index: offerIndex, field, value }));
  };

  const stepValue = feeType === "percentage" ? 0.01 : 1;

  React.useEffect(() => {
    if (!isFeeEnabled) return;
    if (feeType) return;
    setField("fee_type", "percentage");
  }, [feeType, isFeeEnabled]);

  return (
    <HStack w="100%" spacing="4" mt="2" justifyContent="start">
      <OfferSwitch
        id={`offer-fee-${offerIndex}`}
        isChecked={isFeeEnabled}
        handleSwitch={(checked) => {
          batch(() => {
            setField("fee_enabled", checked);
            if (!checked) {
              setField("fee_amount", null);
              setField("fee_type", null);
            }
          });
        }}
      />
      <HStack
        spacing="4"
        opacity={isFeeEnabled ? 1 : 0.3}
        pointerEvents={isFeeEnabled ? "auto" : "none"}
      >
        <ButtonGroup
          size="xs"
          isAttached
          borderRadius="lg"
          borderWidth="1px"
          borderColor="bg.600"
          sx={{ "> button": { h: "22px", minH: "22px", px: "2" } }}
        >
          <Button
            borderRadius="lg"
            onClick={() => {
              setFeeKind("commission");
              if (typeof feeAmount === "number") {
                setField("fee_amount", Math.abs(feeAmount));
              }
            }}
            bg={derivedFeeKind === "commission" ? "bg.700" : "transparent"}
          >
            Комиссия
          </Button>
          <Button
            borderRadius="lg"
            onClick={() => {
              setFeeKind("surcharge");
              if (typeof feeAmount === "number") {
                setField("fee_amount", -Math.abs(feeAmount));
              }
            }}
            bg={derivedFeeKind === "surcharge" ? "bg.700" : "transparent"}
          >
            Доплата
          </Button>
        </ButtonGroup>
        <NumberInput
          value={feeAmount ?? ""}
          step={stepValue}
          isValidCharacter={(v) => !!v.match(/^[Ee0-9+\-.,]$/)}
          borderWidth="1px"
          borderRadius="lg"
          size="xs"
          focusBorderColor="violet.500"
          position="relative"
          max={100000000}
          w={110}
          min={-100000000}
          onChange={(valueString) => {
            const raw = valueString.replace(",", ".");
            const trimmed = raw.trim();
            if (trimmed === "") {
              setField("fee_amount", null);
              return;
            }
            if (trimmed.endsWith(".") || trimmed.endsWith(",")) {
              return;
            }
            const parsed = Number(trimmed);
            if (!Number.isFinite(parsed)) return;
            const normalizedValue =
              derivedFeeKind === "surcharge"
                ? -Math.abs(parsed)
                : Math.abs(parsed);
            setField("fee_amount", normalizedValue);
          }}
        >
          <NumberInputField
            pr="1"
            py="0"
            float="right"
            textAlign="end"
            placeholder={"0.00"}
            fontFamily="'Mozilla Text', monospace"
            fontSize="lg"
            _placeholder={{ color: "bg.800" }}
            w="100%"
          />
        </NumberInput>
        <ButtonGroup
          size="xs"
          isAttached
          borderRadius="lg"
          borderWidth="1px"
          borderColor="bg.600"
          sx={{ "> button": { h: "22px", minH: "22px", px: "2" } }}
        >
          <Button
            borderRadius="lg"
            onClick={() => setField("fee_type", "percentage")}
            bg={feeType === "percentage" ? "bg.700" : "transparent"}
          >
            %
          </Button>
          <Button
            borderRadius="lg"
            onClick={() => setField("fee_type", "give")}
            bg={feeType === "give" ? "bg.700" : "transparent"}
          >
            {giveCur || "GIVE"}
          </Button>
          <Button
            borderRadius="lg"
            onClick={() => setField("fee_type", "get")}
            bg={feeType === "get" ? "bg.700" : "transparent"}
          >
            {getCur || "GET"}
          </Button>
        </ButtonGroup>
      </HStack>
    </HStack>
  );
}

// лучший курс в обменниках  на Х% выгоднее для клиента, чем твой
// при обмене 100$ клиент получит 107$
