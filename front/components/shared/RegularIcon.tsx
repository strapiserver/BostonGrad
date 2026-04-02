import { Center, Image } from "@chakra-ui/react";
import { cmsLinkPROD, cmsLinkDEV } from "../../services/utils";

const env = process.env.NODE_ENV;
const SRC = env === "production" ? cmsLinkPROD : cmsLinkDEV;

const RegularIcon = ({ url, index }: { url: string; index: number }) => {
  return (
    <Center
      zIndex="4"
      position="relative"
      justifyContent="center"
      filter="sepia(95%) brightness(0.7)"
      _before={{
        content: "''",
        filter: "opacity(0.4) blur(8px)",
        bgColor: "white",
        position: "absolute",
        borderRadius: "50%",
        w: "50%",
        h: "50%",
      }}
    >
      <Image alt={"icon" + index} w="8" h="8" src={SRC + url} />
    </Center>
  );
};

export default RegularIcon;
