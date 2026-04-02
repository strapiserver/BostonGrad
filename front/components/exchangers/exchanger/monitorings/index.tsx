import { Box, Divider, Wrap } from "@chakra-ui/react";
import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";
import { IExchangerMonitoring } from "../../../../types/exchanger";
import { Box3D } from "../../../../styles/theme/custom";
import CustomImage from "../../../shared/CustomImage";

export default function Monitorings({
  monitorings,
}: {
  monitorings?: IExchangerMonitoring[] | null;
}) {
  if (!monitorings?.length) return <></>;
  return (
    <BoxWrapper>
      <CustomHeader text={`Мониторинги`} Icon={IoMdCheckmarkCircle} />
      <Divider my="4" />
      <Wrap gap="2">
        {monitorings.map((m) => (
          <Box3D variant="extra_contrast" py="2" key={m.id}>
            <Box filter="invert(1) opacity(0.4)">
              <CustomImage h="auto" img={m.monitoring?.logo} />
            </Box>
          </Box3D>
        ))}
      </Wrap>
    </BoxWrapper>
  );
}
