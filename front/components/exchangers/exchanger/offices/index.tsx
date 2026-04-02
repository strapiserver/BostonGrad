import React from "react";
import { IExchangerOffice } from "../../../../types/exchanger";
import { Box, Button, Divider, Flex, HStack, VStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import CustomImage from "../../../shared/CustomImage";
import { LinkWrapper } from "../../../shared/LinkWrapper";
import { TbMapPinFilled } from "react-icons/tb";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

export default function OfficesDescription({
  offices,
}: {
  offices?: IExchangerOffice[];
}) {
  if (!offices || !offices.length) return <></>;
  return (
    <BoxWrapper variant="contrast" w="100%">
      <CustomHeader text={` Адреса офисов`} Icon={TbMapPinFilled} />
      {offices.map((office) => (
        <React.Fragment key={office.id + office.address}>
          <Divider my="4" />

          <Flex
            w="100%"
            flexDir={{ base: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems="center"
            gap="4"
          >
            <Box borderRadius="lg" overflow="hidden" w="180">
              <CustomImage img={office.image} w="auto" h="auto" />
            </Box>
            <Divider
              orientation="vertical"
              h="60px"
              display={{ base: "none", lg: "flex" }}
            />
            <VStack alignItems="start" gap="4" w="100%" alignSelf="start">
              <HStack alignItems="center">
                <ResponsiveText whiteSpace="unset" size="lg" fontWeight="bold">
                  {office.address}
                </ResponsiveText>
              </HStack>

              <ResponsiveText whiteSpace="unset">
                {office.description}
              </ResponsiveText>

              <Flex
                flexDir={{ base: "column" }}
                justifyContent="space-between"
                w="100%"
                gap="4"
              >
                {office.working_time && (
                  <ResponsiveText>
                    Время работы: {office.working_time}
                  </ResponsiveText>
                )}
                <HStack w="100%" justifyContent="end">
                  <LinkWrapper
                    url={`/map/${office.city}`}
                    exists={!!office.city}
                  >
                    <Button
                      size="sm"
                      variant="extra_contrast"
                      rightIcon={
                        <Box mb="0.5" color="red.500">
                          <TbMapPinFilled size="1rem" />
                        </Box>
                      }
                    >
                      Показать на карте
                    </Button>
                  </LinkWrapper>
                </HStack>
              </Flex>
            </VStack>
          </Flex>
        </React.Fragment>
      ))}
    </BoxWrapper>
  );
}
