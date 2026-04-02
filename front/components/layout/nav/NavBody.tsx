import { FiHome, FiPlusCircle } from "react-icons/fi";
import { LiaTelegramPlane } from "react-icons/lia";
import { RiTokenSwapLine, RiMapPinLine, RiRobot2Line } from "react-icons/ri";
import LinkButton from "../../shared/LinkButton";
import { HStack, VStack } from "@chakra-ui/react";

import { LiaExchangeAltSolid } from "react-icons/lia";

const NavBody = ({ inline = false }: { inline?: boolean }) => {
  const handleClearStorage = () => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  };

  const Wrapper = inline ? HStack : VStack;

  return (
    <Wrapper
      spacing={inline ? "1" : "0"}
      alignItems={inline ? "center" : "stretch"}
      flexWrap={inline ? "nowrap" : "wrap"}
    >
      <LinkButton
        message="Домой"
        href={"/"}
        CustomIcon={FiHome}
        compact={inline}
      />

      {/* <LinkButton
        message="Suggest Exchange"
        href={"/order"}
        CustomIcon={FiPlusCircle}
      />
      <LinkButton
        message="Create Exchanger"
        href={"/create"}
        CustomIcon={RiTokenSwapLine}
      /> */}
      <LinkButton
        message="Обменники"
        href={"/exchangers"}
        CustomIcon={LiaExchangeAltSolid}
        compact={inline}
      />

      <LinkButton
        message="Телеграм"
        href={`https://t.me/${process.env.NEXT_PUBLIC_NAME}`}
        CustomIcon={LiaTelegramPlane}
        compact={inline}
      />
      {/* <LinkButton
        message={t("main:botPage")}
        href={"https://t.me/p2pie_bot"}
        CustomIcon={RiRobot2Line}
      /> */}
      <LinkButton
        message="Офисы"
        href={"/map"}
        CustomIcon={RiMapPinLine}
        compact={inline}
      />
    </Wrapper>
  );
};

export default NavBody;
