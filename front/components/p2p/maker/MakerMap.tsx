import { Box, Center, Divider, useToken } from "@chakra-ui/react";
import { Circle, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { TbMapPinFilled } from "react-icons/tb";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import Loader from "../../shared/Loader";
import { createMapStyles } from "../../map/styles";

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const center = useMemo(
    () => parseCoordinates(coordinates),
    [coordinates],
  );
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

  const [peach200, bg100, bg300, bg500, bg600, bg700, bg800, bg900] = useToken(
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
        peach200,
        bg100,
        bg300,
        bg500,
        bg600,
        bg700,
        bg800,
        bg900,
      }),
    [peach200, bg100, bg300, bg500, bg600, bg700, bg800, bg900],
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

  if (!mounted || !center) return null;

  return (
    <BoxWrapper>
      <CustomHeader text="Примерное место встречи" Icon={TbMapPinFilled} />
      <Divider my="4" />
      <Box borderRadius="lg" overflow="hidden" bg="bg.900">
        {isLoaded ? (
          <GoogleMap
            options={mapOptions}
            zoom={12}
            center={center}
            mapContainerStyle={containerStyle}
          >
            <Circle
              center={center}
              radius={1000}
              options={{
                fillColor: "#f0baa3",
                fillOpacity: 0.35,
                strokeColor: "#f0baa3",
                strokeOpacity: 0.6,
                strokeWeight: 1,
              }}
            />
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
