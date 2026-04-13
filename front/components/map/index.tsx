import { useLoadScript, GoogleMap, OverlayView } from "@react-google-maps/api";
import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Text,
  useBreakpointValue,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ICity } from "../../types/exchange";
import { IExchanger, IExchangerOffice } from "../../types/exchanger";
import { createMapStyles } from "./styles";
import CustomMarker from "./CustomMarker";
import { useAppDispatch } from "../../redux/hooks";
import { setCity } from "../../redux/mainReducer";
import { IDirText } from "../../types/exchange";
import { CityCashSection, MapHeadings } from "./types";
import CityDescription from "./description";
import CashDirections from "./directions";
import { BoxWrapper, CustomHeader } from "../shared/BoxWrapper";
import { IoMdInformationCircle } from "react-icons/io";
import OfficeSearchInput from "./OfficeSearchInput";
import { TbMapPinFilled } from "react-icons/tb";
import ClosestCities from "./closest";
import { ClosestCityMatch, isCloseByCoordinates, getCitySlug } from "./helper";
import Loader from "../shared/Loader";

type CityMapViewProps = {
  city: ICity;
  exchangerList: IExchanger[];
  headings: MapHeadings;
  cashSections: CityCashSection[];
  cityText: IDirText | null;
  closestCities: ClosestCityMatch[];
};

type MapMarkerEntry = {
  id: string;
  exchanger: IExchanger;
  office: IExchangerOffice | null;
  searchIndex: string;
};

type MapMarker = {
  id: string;
  position: google.maps.LatLngLiteral;
  entries: MapMarkerEntry[];
  searchIndex: string;
};

const CityMapView = ({
  city,
  exchangerList,
  headings,
  cashSections,
  cityText,
  closestCities,
}: CityMapViewProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const citySlug = useMemo(() => getCitySlug(city), [city]);

  useEffect(() => {
    dispatch(setCity(city));
  }, [dispatch, city]);

  const libraries = useMemo(() => ["places"], []);
  const mapHeight = useBreakpointValue({ base: "360px", md: "480px", lg: "600px" }) || "600px";

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: mapHeight,
      boxShadow: "5px 5px 15px 5px #222",
      borderRadius: "10px",
    }),
    [mapHeight]
  );

  const mapApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "";

  const [violet400, bg100, bg300, bg500, bg600, bg700, bg800, bg900] = useToken(
    "colors",
    [
      "violet.400",
      "bg.100",
      "bg.300",
      "bg.500",
      "bg.600",
      "bg.700",
      "bg.800",
      "bg.900",
    ]
  );

  const mapStyles = useMemo(
    () =>
      createMapStyles({
        violet400,
        bg100,
        bg300,
        bg500,
        bg600,
        bg700,
        bg800,
        bg900,
      }),
    [violet400, bg100, bg300, bg500, bg600, bg700, bg800, bg900]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      gestureHandling: "greedy",
      fullscreenControl: true,
      styles: mapStyles,
    }),
    [mapStyles]
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: mapApiKey,
    libraries: libraries as any,
  });

  const parseCoordinates = (value?: string | null) => {
    if (!value) return null;
    const sanitized = value
      .replace(/SRID=\d+;/i, "")
      .replace(/POINTZ?/gi, "")
      .replace(/[()]/g, " ")
      .trim();

    const parts = sanitized.includes(",")
      ? sanitized.split(",").map((p) => p.trim())
      : sanitized.split(/\s+/).map((p) => p.trim());

    const numbers = parts
      .map((part) => parseFloat(part.replace(/[^\d.\-]/g, "")))
      .filter((num) => Number.isFinite(num));

    if (numbers.length < 2) return null;

    const [first, second] = numbers;
    const isValidLat = (n: number) => Math.abs(n) <= 90;
    const isValidLng = (n: number) => Math.abs(n) <= 180;

    if (isValidLat(first) && isValidLng(second)) {
      return { lat: first, lng: second } as google.maps.LatLngLiteral;
    }

    if (isValidLat(second) && isValidLng(first)) {
      return { lat: second, lng: first } as google.maps.LatLngLiteral;
    }

    return null;
  };

  const markers = useMemo<MapMarker[]>(() => {
    const preparedEntries: Array<
      MapMarkerEntry & { position: google.maps.LatLngLiteral }
    > = [];

    exchangerList.forEach((exchanger) => {
      const offices = Array.isArray(exchanger.offices) ? exchanger.offices : [];

      offices.forEach((office) => {
        const officeCity = (office.city || "").toLowerCase();
        if (!officeCity || officeCity !== citySlug) return;
        const position = parseCoordinates(office.coordinates);
        if (!position) return;

        const searchIndex = `${
          exchanger.display_name || exchanger.name || ""
        } ${office.address || ""}`.toLowerCase();

        preparedEntries.push({
          id: `${exchanger.id}-${office.id}`,
          exchanger,
          office: office || null,
          searchIndex,
          position,
        });
      });
    });

    const result: MapMarker[] = [];

    preparedEntries.forEach(({ position, ...entry }) => {
      const existing = result.find((marker) =>
        isCloseByCoordinates(marker.position, position)
      );

      if (existing) {
        existing.entries.push(entry);
        existing.searchIndex = `${existing.searchIndex} ${entry.searchIndex}`;
      } else {
        result.push({
          id: `${position.lat.toFixed(6)}|${position.lng.toFixed(6)}|${
            result.length
          }`,
          position,
          entries: [entry],
          searchIndex: entry.searchIndex,
        });
      }
    });

    return result;
  }, [exchangerList, citySlug]);

  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const highlightedIds = useMemo(() => {
    if (!normalizedSearch) return new Set<string>();
    return new Set(
      markers
        .filter((marker) => marker.searchIndex.includes(normalizedSearch))
        .map((marker) => marker.id)
    );
  }, [markers, normalizedSearch]);

  const center = useMemo(() => {
    if (city.coordinates && city.coordinates.length === 2) {
      const [lat, lng] = city.coordinates;
      return { lat, lng } as google.maps.LatLngLiteral;
    }

    return (
      markers[0]?.position ?? ({ lat: 0, lng: 0 } as google.maps.LatLngLiteral)
    );
  }, [city.coordinates, markers]);

  const officesTotal = markers.length ? `(${markers.length})` : "";

  return (
    <Box w="100%">
      <BoxWrapper w="100%">
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="3"
          w="100%"
        >
          <CustomHeader
            text={`${cityText?.header || headings.h1} ${officesTotal}`}
            as="h1"
            Icon={TbMapPinFilled}
          />
          {/* <HStack spacing="3" w={{ base: "100%", lg: "unset" }}>
            <OfficeSearchInput value={searchTerm} onChange={setSearchTerm} />
          </HStack> */}
        </HStack>

        <Divider my="4" />
        <Box borderRadius="lg" overflow="hidden" bg="bg.900">
          {isLoaded ? (
            <GoogleMap
              options={mapOptions}
              zoom={12}
              center={center}
              mapContainerStyle={containerStyle}
              onClick={() => setActiveMarkerId(null)}
              onDragStart={() => setActiveMarkerId(null)}
            >
              {markers.map((marker) => (
                <OverlayView
                  key={marker.id}
                  getPixelPositionOffset={(width, height) => ({
                    x: -(width / 2),
                    y: -(height / 2),
                  })}
                  position={marker.position}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <CustomMarker
                    id={marker.id}
                    entries={marker.entries}
                    highlighted={
                      highlightedIds.size > 0 && highlightedIds.has(marker.id)
                    }
                    activeMarkerId={activeMarkerId}
                    setActiveMarkerId={setActiveMarkerId}
                  />
                </OverlayView>
              ))}
            </GoogleMap>
          ) : (
            <Center h="50vh">
              <Loader size="xl" />
            </Center>
          )}
        </Box>
      </BoxWrapper>
      <CityDescription cityText={cityText} />
      <ClosestCities city={city} closestCities={closestCities} />
      <CashDirections
        sections={cashSections}
        headings={headings}
        cityName={city.en_name}
      />
    </Box>
  );
};

export default CityMapView;
