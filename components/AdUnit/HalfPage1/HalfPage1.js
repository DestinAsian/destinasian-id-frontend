import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./HalfPage1.module.scss";
import { Ad } from "react-ad-manager";

let cx = classNames.bind(styles);

export default function HalfPage1() {
  useEffect(() => {
  }, []);
  return (
    <div className={cx("halfpage-wrapper")}>
      <div className={cx("halfpage-banner")}>
        {/* HalfPage Banner */}
        <Ad
          adUnit="/6808792/DAI_HALFPAGE_01"
          name="div-gpt-ad-1737088561514-0"
          size={[300, 600]}
        />
      </div>
    </div>
  );
}
