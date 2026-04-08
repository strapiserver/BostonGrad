import { Divider, HStack, List, ListItem, Text } from "@chakra-ui/react";
import React from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { IMainBenefit } from "../../../types/pages";

export default function Benefits({ benefits }: { benefits?: IMainBenefit[] }) {
  if (!benefits?.length) return null;

  return (
    <List spacing="2">
      {benefits
        .filter((item) => !!item?.text)
        .map((item) => (
          <ListItem key={item.id || item.text} listStyleType="none">
            <HStack align="start" spacing="2">
              <RiCheckboxCircleFill
                color="white"
                size={18}
                style={{ marginTop: "4px", flexShrink: 0 }}
              />
              <Text
                color="white"
                fontSize={{ base: "md", md: "lg" }}
                textShadow="0 1px 8px rgba(0,0,0,0.5)"
                textTransform="none"
                letterSpacing="normal"
              >
                {item.text}
              </Text>
            </HStack>
            <Divider mt="2" borderColor="whiteAlpha.400" w="80%" />
          </ListItem>
        ))}
    </List>
  );
}
