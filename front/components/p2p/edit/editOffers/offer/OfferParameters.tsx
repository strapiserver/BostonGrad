import { Box, Wrap } from "@chakra-ui/react";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../redux/mainReducer";
import { fetchTopParameters } from "../../../../../redux/thunks";
import { IParameter } from "../../../../../types/rates";
import { IP2PTopParameter } from "../../../../../types/p2p";
import TopParameter from "../../../../exchange/tv/TopParameter";

const toTopParameter = (param: IParameter): IP2PTopParameter => ({
  id: String(param.id),
  code: param.code,
  en_name: param.en_name,
  ru_name: param.ru_name,
  type: param.type ?? null,
  parameter: param.parameter
    ? {
        id: String(param.parameter.id),
        en_description: param.parameter.en_description,
        ru_description: param.parameter.ru_description,
        icon: param.parameter.icon ?? null,
      }
    : null,
});

export default function OfferParameters({
  offerIndex,
}: {
  offerIndex: number;
}) {
  const dispatch = useAppDispatch();
  const topParameters = useAppSelector((state) => state.main.topParameters);
  const selected = useAppSelector(
    (state) => state.main.p2pFullOffers[offerIndex]?.top_parameters,
  );

  React.useEffect(() => {
    if (topParameters.length) return;
    dispatch(fetchTopParameters("p2p_offer"));
  }, [dispatch, topParameters.length]);

  const offerTopParameters = React.useMemo(() => {
    const typed = topParameters.filter((param) => param?.type === "p2p_offer");
    return typed.length ? typed : topParameters;
  }, [topParameters]);

  const selectedIds = React.useMemo(
    () =>
      new Set(
        (selected || [])
          .map((param) => (param?.id ? String(param.id) : ""))
          .filter(Boolean),
      ),
    [selected],
  );

  const toggle = (param: IParameter) => {
    const targetId = String(param.id);
    const current = Array.isArray(selected) ? selected : [];
    const exists = current.some((item) => String(item?.id) === targetId);
    const next = exists
      ? current.filter((item) => String(item?.id) !== targetId)
      : [...current, toTopParameter(param)];

    dispatch(
      setP2PFullOfferField({
        index: offerIndex,
        field: "top_parameters",
        value: next,
      }),
    );
  };

  return (
    <Wrap spacing="2" p="1">
      {offerTopParameters.map((param) => (
        <Box
          key={`offer-top-parameter-${param.id}`}
          filter={
            selectedIds.has(String(param.id))
              ? "grayscale(0) opacity(1)"
              : "grayscale(1) opacity(0.7)"
          }
          transition="all 0.15s ease"
          cursor="pointer"
          onClick={() => toggle(param)}
        >
          <TopParameter code={param.code} isExtended />
        </Box>
      ))}
    </Wrap>
  );
}
