import classNames from "classnames/bind";
import styles from "./Interscroller.module.scss";
import { Ad } from "react-ad-manager";
import { GetInterscrollerVisibility } from "../../../queries/GetInterscrollerVisibility";
import { useQuery } from "@apollo/client";

let cx = classNames.bind(styles);

export default function Interscroller() {
  // Get Interscroller Component
  const { data, loading } = useQuery(GetInterscrollerVisibility, {
    variables: {
      // Interscroller id
      id: 93939,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  });

  if (loading) {
    return null;
  }

  // Get Header Component
  const interscroller = data?.bannerAd?.interscroller ?? [];

  return (
    <div
      className={cx(
        "component",
        interscroller?.visibility == null ? "hide" : undefined
      )}
    >
      <div className={cx("interscroller-wrapper")}>
        <div className={cx("title-wrapper")}>
          <div className={cx("title")}>{"Interscroller Ads"}</div>
        </div>
        <div className={cx("interscroller-banner")}>
          {/* Interscroller Banner */}
          <Ad
            adUnit="/6808792/DAMAN_INTERSCROLLER"
            name="div-gpt-ad-1702016546215-0"
            size={[300, 600]}
          />
        </div>
        <div className={cx("scroll-down-wrapper")}>
          <div className={cx("scroll-down")}>{"Scroll down to continue"}</div>
        </div>
      </div>
    </div>
  );
}
