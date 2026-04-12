import { Box, Center, Divider, HStack, useToken } from "@chakra-ui/react";
import { Circle, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TbMapPinFilled } from "react-icons/tb";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import Loader from "../../shared/Loader";
import { createMapStyles } from "../../map/styles";
import CitySelector from "../../layout/header/city";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMakerCoordinates } from "../../../redux/mainReducer";

const parseCoordinates = (value?: string | null) => {
  if (!value) return null;
  const sanitized = value
    .replace(/SRID=\d+;/i, "")
    .replace(/POINTZ?/gi, "")
    .replace(/[()]/g, " ")
    .trim();

  const parts = sanitized.includes(",")
    ? sanitized.split(",").map((part) => part.trim())
    : sanitized.split(/\s+/).map((part) => part.trim());

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

export default function MakerMap({
  coordinates,
}: {
  coordinates?: string | null;
}) {
  const dispatch = useAppDispatch();
  const cityCoordinates = useAppSelector(
    (state) => state.main.city?.coordinates,
  );
  const makerCoordinates = useAppSelector(
    (state) => state.main.maker?.coordinates,
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const fallbackCenter = useMemo(
    () => parseCoordinates(coordinates),
    [coordinates],
  );

  useEffect(() => {
    if (makerCoordinates !== undefined) return;
    if (!fallbackCenter) return;
    dispatch(setMakerCoordinates([fallbackCenter.lat, fallbackCenter.lng]));
  }, [dispatch, fallbackCenter, makerCoordinates]);
  const cityCenter = useMemo(() => {
    if (
      Array.isArray(cityCoordinates) &&
      cityCoordinates.length === 2 &&
      cityCoordinates.every((value) => Number.isFinite(value))
    ) {
      return {
        lat: cityCoordinates[0],
        lng: cityCoordinates[1],
      } as google.maps.LatLngLiteral;
    }
    return null;
  }, [cityCoordinates]);
  const center = cityCenter || fallbackCenter;
  const circleCenter = useMemo(() => {
    if (!center) return null;
    if (
      Array.isArray(makerCoordinates) &&
      makerCoordinates.length === 2 &&
      makerCoordinates.every((value) => Number.isFinite(value))
    ) {
      return { lat: makerCoordinates[0], lng: makerCoordinates[1] };
    }
    return center;
  }, [center, makerCoordinates]);

  const libraries = useMemo(() => ["places"], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "50vh",
      boxShadow: "5px 5px 15px 5px #222",
      borderRadius: "10px",
    }),
    [],
  );

  const [violet400, bg100, bg300, bg500, bg600, bg700, bg800, bg900] = useToken(
    "colors",
    [
      "violet.600",
      "bg.100",
      "bg.300",
      "bg.500",
      "bg.600",
      "bg.700",
      "bg.800",
      "bg.900",
    ],
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
    [violet400, bg100, bg300, bg500, bg600, bg700, bg800, bg900],
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: "greedy",
      fullscreenControl: true,
      styles: mapStyles,
    }),
    [mapStyles],
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (lat == null || lng == null) return;
      dispatch(setMakerCoordinates([lat, lng]));
    },
    [dispatch],
  );

  if (!mounted || !center) return null;

  return (
    <BoxWrapper>
      <HStack justifyContent="space-between" alignItems="center" w="100%">
        <CustomHeader
          text="Выбери район обслуживания на карте"
          Icon={TbMapPinFilled}
        />
        <CitySelector forceVisible />
      </HStack>
      <Divider my="4" />
      <Box borderRadius="lg" overflow="hidden" bg="bg.900">
        {isLoaded ? (
          <GoogleMap
            options={mapOptions}
            zoom={12}
            center={center}
            mapContainerStyle={containerStyle}
            onClick={handleMapClick}
          >
            {circleCenter ? (
              <Circle
                center={circleCenter}
                radius={1000}
                options={{
                  fillColor: "#f0baa3",
                  fillOpacity: 0.35,
                  strokeColor: "#f0baa3",
                  strokeOpacity: 0.6,
                  strokeWeight: 1,
                }}
              />
            ) : null}
          </GoogleMap>
        ) : (
          <Center h="50vh">
            <Loader size="xl" />
          </Center>
        )}
      </Box>
    </BoxWrapper>
  );
}
