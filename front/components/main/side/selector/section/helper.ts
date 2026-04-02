import Transliterator from "../../../../../services/transliterator";
import { IPmGroup, ISection } from "../../../../../types/selector";

const transliterator = new Transliterator();

const _checkPmGroupMatching = (pm_group: IPmGroup, input: string): boolean => {
  const pmGroupNamesToMatch =
    `${pm_group.en_name} ${pm_group.ru_name} ` +
    String(pm_group.options.map((op) => `${op.name} ${op.currency.code}`));
  return transliterator.findMatch(pmGroupNamesToMatch, input);
};

export const filterSections = (
  input: string,
  sections: ISection[]
): ISection[] => {
  if (!input) return sections;
  return sections.map((section) => ({
    ...section,
    pm_groups: section.pm_groups.filter((pm_group) =>
      _checkPmGroupMatching(pm_group, input.toLowerCase())
    ),
  }));
};

export const countryCurrencies = {
  ARMENIA: "AMD",
  AZERBAIJAN: "AZN",
  BELARUS: "BYN",
  CHINA: "JPY",
  KAZAKHSTAN: "KZT",
  KYRGYZSTAN: "KGS",
  TURKEY: "TRY",
  UK: "GBP",
  UKRAINE: "UAH",
  UZBEKISTAN: "UZS",
};
