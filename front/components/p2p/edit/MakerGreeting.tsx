import { VStack } from "@chakra-ui/react";
import Image from "next/image";
import greetings from "../../../public/greetings.png";
import CustomTitle from "../../shared/CustomTitle";

const MakerGreeting = () => {
  return (
    <VStack
      gap={{ base: "4", lg: "-20" }}
      my={{ base: "4", lg: "10" }}
      zIndex="1"
    >
      <Image
        alt={`${process.env.NEXT_PUBLIC_NAME} greetings`}
        src={greetings}
        width={250}
        loading="eager"
      />
      <CustomTitle
        as="h1"
        mt="-20"
        mb="0"
        title={"Прокачай свой p2p обмен"}
        subtitle={
          "Настрой личную p2p витрину. Накапливай уровань доверия за каждую сделку."
        }
        subtitle2={"Даем трафик клиентов. Берем безопасность сделок на себя."}
      />
    </VStack>
  );
};

export default MakerGreeting;
