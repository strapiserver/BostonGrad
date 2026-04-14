import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  MdCheckCircle,
  MdCancel,
  MdHourglassTop,
  MdNewReleases,
  MdHelpOutline,
} from "react-icons/md";

type LeadQuestion = {
  id: string;
  name: string;
  text: string;
  stage: number | null;
  isBoolean: boolean;
  isOptional: boolean;
  options: string[];
};

type LeadResponse = {
  id: string;
  answer: string;
  question: LeadQuestion | null;
};

type LeadItem = {
  id: string;
  name: string;
  status: string;
  kid_age: number | null;
  country: string;
  userAgent: string;
  createdAt: string;
  responses: LeadResponse[];
};

const statusMeta: Record<
  string,
  {
    label: string;
    colorScheme: string;
    icon: any;
  }
> = {
  not_verified: {
    label: "Not verified",
    colorScheme: "gray",
    icon: MdHelpOutline,
  },
  new: {
    label: "New",
    colorScheme: "blue",
    icon: MdNewReleases,
  },
  awaiting_call: {
    label: "Awaiting call",
    colorScheme: "orange",
    icon: MdHourglassTop,
  },
  interested: {
    label: "Interested",
    colorScheme: "teal",
    icon: MdHourglassTop,
  },
  ready: {
    label: "Ready",
    colorScheme: "cyan",
    icon: MdHourglassTop,
  },
  paid: {
    label: "Paid",
    colorScheme: "green",
    icon: MdCheckCircle,
  },
  visa_done: {
    label: "Visa done",
    colorScheme: "green",
    icon: MdCheckCircle,
  },
  finished: {
    label: "Finished",
    colorScheme: "green",
    icon: MdCheckCircle,
  },
  canceled: {
    label: "Canceled",
    colorScheme: "red",
    icon: MdCancel,
  },
};

const boolFromAnswer = (answer: string) => {
  const normalized = String(answer || "")
    .trim()
    .toLowerCase();
  return ["true", "1", "yes", "да"].includes(normalized);
};

export default function LeadsPage() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<LeadItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads/list");
      if (response.status === 401) {
        setLeads(null);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to load leads");
      }
      const payload = await response.json();
      setLeads(Array.isArray(payload?.leads) ? payload.leads : []);
    } catch {
      setError("Не удалось загрузить лиды");
      setLeads(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || isLoginLoading) return;
    setIsLoginLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError("Неверный пароль");
        return;
      }
      setPassword("");
      await loadLeads();
    } finally {
      setIsLoginLoading(false);
    }
  };

  const onLogout = async () => {
    await fetch("/api/leads/logout", { method: "POST" });
    setLeads(null);
  };

  if (isLoading) {
    return (
      <VStack py="20">
        <Spinner />
      </VStack>
    );
  }

  if (!leads) {
    return (
      <VStack py="20" px="4">
        <Box as="form" onSubmit={onLogin} w="100%" maxW="420px">
          <VStack align="stretch" spacing="4">
            <Heading size="md">Leads Login</Heading>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Button type="submit" isLoading={isLoginLoading}>
              Войти
            </Button>
            {error ? <Text color="red.500">{error}</Text> : null}
          </VStack>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" px="4" py="6" spacing="4">
      <HStack justify="space-between">
        <Heading size="md">Leads ({leads.length})</Heading>
        <Button variant="outline" onClick={onLogout}>
          Выйти
        </Button>
      </HStack>

      {leads.map((lead) => (
        <Card key={lead.id}>
          <CardBody>
            <VStack align="stretch" spacing="4">
              <HStack justify="space-between" flexWrap="wrap">
                <HStack spacing="3">
                  <Heading size="sm">{lead.name || "Без имени"}</Heading>
                  {(() => {
                    const meta = statusMeta[lead.status] || {
                      label: lead.status || "Unknown",
                      colorScheme: "gray",
                      icon: MdHelpOutline,
                    };
                    const Icon = meta.icon;
                    return (
                      <Badge
                        colorScheme={meta.colorScheme}
                        display="inline-flex"
                        alignItems="center"
                        gap="1"
                        px="2"
                        py="1"
                        borderRadius="md"
                        textTransform="none"
                      >
                        <Icon />
                        {meta.label}
                      </Badge>
                    );
                  })()}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleString("ru-RU")
                    : ""}
                </Text>
              </HStack>

              <HStack spacing="6" flexWrap="wrap">
                <Text fontSize="sm">Возраст: {lead.kid_age ?? "—"}</Text>
                <Text fontSize="sm">Страна: {lead.country || "—"}</Text>
                <Text fontSize="sm">User-Agent: {lead.userAgent || "—"}</Text>
              </HStack>

              <Divider />

              <Stack spacing="3">
                {lead.responses.map((response) => {
                  const q = response.question;
                  if (!q) {
                    return (
                      <Text key={response.id} fontSize="sm">
                        {response.answer}
                      </Text>
                    );
                  }

                  const label = `${q.text || q.name}${q.isOptional ? "" : " *"}`;
                  const hasOptions = Array.isArray(q.options) && q.options.length > 0;

                  if (hasOptions) {
                    return (
                      <FormControl key={response.id}>
                        <FormLabel mb="1">{label}</FormLabel>
                        <Select value={response.answer || ""} isDisabled>
                          <option value="">Не выбрано</option>
                          {q.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  }

                  if (q.isBoolean) {
                    return (
                      <FormControl key={response.id} display="flex" alignItems="center">
                        <FormLabel mb="0">{label}</FormLabel>
                        <Switch isChecked={boolFromAnswer(response.answer)} isDisabled />
                      </FormControl>
                    );
                  }

                  return (
                    <FormControl key={response.id}>
                      <FormLabel mb="1">{label}</FormLabel>
                      <Input value={response.answer || ""} isReadOnly />
                    </FormControl>
                  );
                })}
              </Stack>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}
