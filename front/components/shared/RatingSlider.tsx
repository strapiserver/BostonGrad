import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  useColorModeValue,
  Text,
  HStack,
} from "@chakra-ui/react";

const RatingSlider = ({
  max,
  review,
  color,
}: {
  max: number;
  review: number;
  color: string;
}) => {
  return (
    <HStack spacing="4">
      <Slider aria-label="test" value={100 * (review / max)}>
        <SliderTrack bgColor="rgba(0,0,0,0.2)">
          <SliderFilledTrack bgColor={color} />
        </SliderTrack>
      </Slider>
      <Text color="bg.800">{review}</Text>
    </HStack>
  );
};

export default RatingSlider;
