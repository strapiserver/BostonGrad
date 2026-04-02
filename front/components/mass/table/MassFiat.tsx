import { HStack } from "@chakra-ui/react";
import { IPm } from "../../../types/selector";
import SmartGrid from "./SmartGrid";
import { ResponsiveText } from "../../../styles/theme/custom";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import PmIcon from "../../shared/PmIcon";
import { enrichLink } from "../../../redux/helper";
import { LinkWrapper } from "../../shared/LinkWrapper";
import { useContext } from "react";
import MassSideContext from "../sideContext";

const MassFiat = ({
  codes,
  fiatPms,
  ref_link,
}: {
  codes: string[];
  fiatPms: Record<string, IPm>;
  ref_link: string;
}) => {
  const { isSell, currentCryptoPm, city } = useContext(MassSideContext);

  const enrichedLink = (fiatPm: IPm) =>
    enrichLink({
      refLink: ref_link,
      givePm: isSell ? currentCryptoPm : fiatPm,
      getPm: isSell ? fiatPm : currentCryptoPm,
      cityCode: city?.codes?.[0],
    });

  // return (
  //  </LinkWrapper>
  const fiatItems = codes
    .map((code) => {
      const pm = fiatPms[code];
      if (!pm) return null;

      const url = enrichedLink(pm);
      if (!url?.trim()) return null;

      return { code, pm, url };
    })
    .filter(Boolean) as { code: string; pm: IPm; url: string }[];

  if (!fiatItems.length) return null;

  return (
    <SmartGrid wrapThreshold={6} direction={"end"}>
      {fiatItems.map(({ code, pm, url }) => (
        <LinkWrapper
          key={code}
          url={url}
          exists={!!url}
          _blank
        >
          <HStack borderRadius="lg" mx="0.5" cursor="pointer">
            <PmIcon pm={pm} />

            {fiatItems.length < 2 && (
              <ResponsiveText>{capitalize(pm?.en_name)}</ResponsiveText>
            )}
          </HStack>
        </LinkWrapper>
      ))}
    </SmartGrid>
  );
};

export default MassFiat;
