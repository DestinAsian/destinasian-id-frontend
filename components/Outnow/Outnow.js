import Link from "next/link";
import Image from "next/image";
import React from "react";
import classNames from "classnames/bind";
import styles from "./Outnow.module.scss";
import { GetSidebarComponent } from "../../queries/GetSidebarComponent";
import { useQuery } from "@apollo/client";

let cx = classNames.bind(styles);

export default function Outnow() {
  // Get Sidebar Component
  const { data, loading } = useQuery(GetSidebarComponent, {
    variables: {
      // Sidebar page id
      id: 79851,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  });

  if (loading) {
    return null;
  }

  // Get Header Component
  const sidebarComponent = data?.page?.sidebarComponent ?? {};
  // Get Outnow
  const outnow = sidebarComponent?.outnow ?? [];
  // Subscribe link
  const subsLink = "#";

  return (
    <>
      <div className={cx("component")}>
        {outnow && (
          <Link href={subsLink}>
            <div className={cx("image-wrapper")}>
              <Image
                src={outnow?.sourceUrl}
                alt={outnow?.altText ? outnow?.altText : "Outnow Image"}
                fill
                sizes="100%"
                priority
              />
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
