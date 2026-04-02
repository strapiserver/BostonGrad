import { Heading, HStack, VStack, Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";
import { useEffect, useMemo } from "react";
import { fetchCity, fetchTopParameters } from "../../redux/thunks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import MassTable from "./table";
import MassSideContext from "./sideContext";

import MassTableSelector from "./massTableSelector";

const Mass = ({
  massDirTextId,
  massDirText,
  massRates,
  fiatPms,
  cryptoPms,
  isSell,
  slug,
}: {
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  fiatPms: Record<string, IPm>;
  cryptoPms: IPm[];
  isSell: boolean;
  slug: string;
}) => {
  const { header, subheader, text } = massDirText;
  const selectedCryptoPm = useMemo(
    () =>
      cryptoPms.find(
        (pm) => pm.code.toUpperCase() === massDirTextId.code.toUpperCase()
      ),
    [cryptoPms, massDirTextId.code]
  );
  const city = useAppSelector((state) => state.main.city);
  const router = useRouter();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopParameters());
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady) return;

    const rawCity = Array.isArray(router.query.city)
      ? router.query.city[0]
      : router.query.city;

    if (!rawCity || typeof rawCity !== "string") return;

    const cityParam = rawCity.trim();
    if (!cityParam) return;

    const currentCitySlug = city?.en_name?.toLowerCase();
    if (currentCitySlug === cityParam.toLowerCase()) return;

    dispatch(fetchCity(cityParam));
  }, [router.isReady, router.query.city, city?.en_name, dispatch]);

  return (
    <MassSideContext.Provider
      value={{
        isSell,
        slug,
        currencyCode: massDirTextId.currency.code,
        currentCryptoPm: selectedCryptoPm,
        city,
      }}
    >
      <Box p="4">
        <Heading
          fontSize={{ base: "xl", lg: "4xl" }}
          as="h1"
          fontWeight="bold"
          variant="extra_contrast"
        >
          {header}
        </Heading>
        <ResponsiveText
          fontSize={{ base: "md", lg: "2xl" }}
          as="h2"
          variant="contrast"
          whiteSpace="unset"
        >
          {subheader}
        </ResponsiveText>
        <ResponsiveText
          fontSize={{ base: "sm", lg: "xl" }}
          whiteSpace="unset"
          variant="no_contrast"
        >
          {text}
        </ResponsiveText>
      </Box>

      <VStack gap="5" mt={["2", "8"]}>
        <MassTableSelector cryptoPms={cryptoPms} />

        <MassTable
          massRates={massRates}
          fiatPms={fiatPms}
          massDirTextId={massDirTextId}
        />
      </VStack>
    </MassSideContext.Provider>
  );
};

export default Mass;
