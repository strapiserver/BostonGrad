import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface ExchangerSearchProps {
  onSearch: (query: string) => void;
}

const ExchangerSearch: React.FC<ExchangerSearchProps> = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  useEffect(() => {
    onSearch(debouncedValue.trim().toLowerCase());
  }, [debouncedValue, onSearch]);

  return (
    <Input
      placeholder="Поиск по имени..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      borderWidth="2px"
      borderRadius="xl"
      borderColor="bg.500"
      size="md"
      h="45px"
      focusBorderColor="violet.500"
    />
  );
};

export default ExchangerSearch;
