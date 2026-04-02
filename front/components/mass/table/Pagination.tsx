// src/components/common/Pagination.tsx
import { HStack, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageHref?: (page: number) => string;
  shallow?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  shallow = false,
}: PaginationProps) {
  const pages = useMemo(() => {
    const pageItems: (number | "ellipsis")[] = [];

    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      pageItems.push(1, 2, 3, 4, "ellipsis", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageItems.push(
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pageItems.push(
        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        totalPages
      );
    }

    return pageItems;
  }, [currentPage, totalPages]);

  const renderPageButton = (
    page: number,
    key: string,
    label?: string,
    isDisabled?: boolean
  ) => {
    const content = label ?? page;
    const href = getPageHref ? getPageHref(page) : null;
    const button = (
      <Button
        key={key}
        as={href && !isDisabled ? "a" : undefined}
        size="sm"
        variant={page === currentPage ? "solid" : "outline"}
        isDisabled={isDisabled}
        onClick={() => {
          if (!href) onPageChange(page);
        }}
        aria-current={page === currentPage ? "page" : undefined}
      >
        {content}
      </Button>
    );

    if (!href || isDisabled) {
      return button;
    }

    return (
      <Link key={key} href={href} shallow={shallow} passHref legacyBehavior>
        {button}
      </Link>
    );
  };

  const renderNavButton = (page: number, label: string, isDisabled: boolean) => {
    const href = getPageHref ? getPageHref(page) : null;
    const button = (
      <Button
        as={href && !isDisabled ? "a" : undefined}
        size="sm"
        isDisabled={isDisabled}
        onClick={() => {
          if (!href) onPageChange(page);
        }}
      >
        {label}
      </Button>
    );

    if (!href || isDisabled) {
      return button;
    }

    return (
      <Link key={`nav-${label}`} href={href} shallow={shallow} passHref legacyBehavior>
        {button}
      </Link>
    );
  };

  return (
    <HStack justify="center" mt={4} spacing={2}>
      {renderNavButton(currentPage - 1, "<-", currentPage === 1)}

      {pages.map((page, index) => {
        if (typeof page === "number") {
          return renderPageButton(page, `page-${page}`);
        }
        return (
          <Button
            key={`ellipsis-${index}`}
            size="sm"
            variant="ghost"
            isDisabled
            cursor="default"
          >
            ...
          </Button>
        );
      })}

      {renderNavButton(currentPage + 1, "->", currentPage === totalPages)}
    </HStack>
  );
}
