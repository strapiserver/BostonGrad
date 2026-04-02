import { Box, Tooltip } from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  TiVendorApple,
  TiVendorAndroid,
  TiVendorMicrosoft,
} from "react-icons/ti";
import { MdDevices } from "react-icons/md";
import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";

type PlatformMeta = {
  keywords: string[];
  icon: IconType;
  color: string;
};

const PLATFORM_META: PlatformMeta[] = [
  {
    keywords: ["windows", "win64", "win32"],
    icon: TiVendorMicrosoft,
    color: "violet.500",
  },
  {
    keywords: ["android"],
    icon: TiVendorAndroid,
    color: "green.500",
  },
  {
    keywords: ["iphone", "ipad", "ios", "mac os", "macos"],
    icon: TiVendorApple,
    color: "gray.200",
  },
];

const getPlatformMeta = (userAgent: string): PlatformMeta | null => {
  const normalized = userAgent.toLowerCase();
  return (
    PLATFORM_META.find((meta) =>
      meta.keywords.some((keyword) => normalized.includes(keyword))
    ) || null
  );
};

const UserAgent = ({ userAgent }: { userAgent?: string | null }) => {
  if (!userAgent) return <></>;

  const platformMeta = getPlatformMeta(userAgent);
  const IconComponent = platformMeta?.icon || MdDevices;
  const color = platformMeta?.color || "bg.700";
  const iconColor = platformMeta?.color === "gray.200" ? "bg.700" : "white";
  const label =
    platformMeta?.keywords?.[0] || userAgent.split(/[\/;\(\)]/)[0].trim();

  return (
    <Tooltip label={capitalize(label)}>
      <Box
        borderRadius="full"
        bg={color}
        color={iconColor}
        p="1"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
      >
        <IconComponent size="1rem" />
      </Box>
    </Tooltip>
  );
};

export default UserAgent;
