import { Heading } from "@chakra-ui/react";
import React from "react";
import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../../../types/selector";

export default function OtherHeaders({ text }: { text: string }) {
  return (
    <Heading
      as="h3"
      fontSize="lg"
      bgColor="bg.1000"
      borderTopRadius="lg"
      borderBottomRadius="none"
      boxShadow="lg"
      p="4"
      mt="0"
    >
      {text}
    </Heading>
  );
}

export const H3ForOthers = (mainPm: IPm, section: string) => {
  // Section-level headings to diversify wording from H4ForOthers
  const {
    ru_name,
    en_name,
    section: mainSection,
    currency,
    subgroup_name,
  } = mainPm;
  const fullName = capitalize(
    [ru_name || en_name, subgroup_name, currency?.code]
      .filter(Boolean)
      .join(" ")
  );

  const normalizedMain = (mainSection || "").toLowerCase();
  const normalizedSection = (section || "").toLowerCase();
  const buyVerb = "Купить";
  const sellVerb = "Продать";

  if (normalizedMain === "crypto") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} через банк`,
        sell: `${sellVerb} ${fullName} через банк`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "bank") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "cash") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName}`,
        sell: `${sellVerb} ${fullName}`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "transfer") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через e‑кошельки`,
        sell: `${sellVerb} ${fullName} через e‑кошельки`,
      };
    }
  }

  if (normalizedMain === "digital") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} в другом кошельке`,
        sell: `${sellVerb} ${fullName} в другом кошельке`,
      };
    }
  }

  return {
    sell: "",
    buy: "",
  };
};

export const H4ForOthers = (mainPm: IPm, section: string) => {
  // possible sections: banks, crypto, transfer, digital, cash
  const {
    ru_name,
    en_name,
    section: mainSection,
    currency,
    subgroup_name,
  } = mainPm;
  const fullName = capitalize(
    [ru_name || en_name, subgroup_name].filter(Boolean).join(" ")
  );

  const buyVerb = "Купить";
  const sellVerb = "Продать";

  const fallback = {
    buy: `${buyVerb} ${fullName}`.trim(),
    sell: `${sellVerb} ${fullName}`.trim(),
  };

  const normalizedMain = (mainSection || "").toLowerCase();
  const normalizedSection = (section || "").toLowerCase();

  if (normalizedMain === "crypto") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "bank") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "cash") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName}`,
        sell: `${sellVerb} ${fullName}`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "transfer") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} через электронные кошельки`,
        sell: `${sellVerb} ${fullName} через электронные кошельки`,
      };
    }
  }

  if (normalizedMain === "digital") {
    if (normalizedSection === "bank") {
      return {
        buy: `${buyVerb} ${fullName} по карте`,
        sell: `${sellVerb} ${fullName} по карте`,
      };
    }
    if (normalizedSection === "crypto") {
      return {
        buy: `${buyVerb} ${fullName} за криптовалюту`,
        sell: `${sellVerb} ${fullName} за криптовалюту`,
      };
    }
    if (normalizedSection === "cash") {
      return {
        buy: `${buyVerb} ${fullName} за наличные`,
        sell: `${sellVerb} ${fullName} за наличные`,
      };
    }
    if (normalizedSection === "transfer") {
      return {
        buy: `${buyVerb} ${fullName} переводом`,
        sell: `${sellVerb} ${fullName} переводом`,
      };
    }
    if (normalizedSection === "digital") {
      return {
        buy: `${buyVerb} ${fullName} в другом кошельке`,
        sell: `${sellVerb} ${fullName} в другом кошельке`,
      };
    }
  }

  return fallback;
};
