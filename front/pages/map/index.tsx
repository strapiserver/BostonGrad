import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const DEFAULT_CITY_SLUG = "moscow";

const MapIndexRedirect: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/map/${DEFAULT_CITY_SLUG}`);
  }, [router]);

  return null;
};

export default MapIndexRedirect;
