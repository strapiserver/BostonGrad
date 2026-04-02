import { Box, HStack } from "@chakra-ui/react";
import Dot from "../../Dot";
import ExchangerName from "../../../shared/ExchangerNameRating";
import { IDotColors, IExchanger } from "../../../../types/exchanger";

const Header = ({ exchanger }: { exchanger: IExchanger }) => {
  const statusColor: IDotColors =
    exchanger.status === "active" ? "green" : "orange";

  const displayName = exchanger.display_name || exchanger.name;

  return (
    <>
      <ExchangerName
        name={displayName}
        logo={exchanger.logo}
        admin_rating={exchanger.admin_rating}
        isH1={true}
        statusColor={statusColor}
      />
    </>
  );
};

export default Header;
