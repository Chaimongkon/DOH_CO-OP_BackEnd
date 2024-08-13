import styled from "@emotion/styled";
import {
  IconChartDonut,
  IconLayoutDashboard,
  IconPercentage100,
  IconPhoto,
  IconCircleArrowDown,
  IconHomeCog,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";
const StyledIcon = styled(IconPercentage100)`
  width: 8px; // Set your desired width
  height: 8px; // Set your desired height
`;
const MenuItems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Utilities",
  },
  {
    id: uniqueId(),
    title: "กิจกรรมและข่าวสาร",
    icon: IconPhoto,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "News",
        href: "/NewAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "Slides",
        href: "/SlideAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "Notifications",
        href: "/NotifyAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "Videos",
        href: "/VideoAll",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "เกี่ยวกับสหกรณ์ฯ",
    icon: IconHomeCog,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ประวัติสหกรณ์",
        href: "/AssetsLiabilitiesAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ค่านิยม วิสัยทัศน์ พันธกิจ",
        href: "/",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "จรรยาบรรณคณะกรมมการดำเนินการ",
        href: "/",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "จรรยาบรรณเจ้าหน้าที่",
        href: "/",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "ผลการดำเนินงาน",
    icon: IconChartDonut,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "รายการสิ้นทรัพย์ย่อ",
        href: "/AssetsLiabilitiesAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "เอกสารประชุมใหญ่",
        href: "/",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "ดาวน์โหลดเอกสาร",
    icon: IconCircleArrowDown,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มสวัสดิการ",
        href: "/",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มสมัครสมาชิก",
        href: "/",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มเงินฝาก - ถอน",
        href: "/",
      },
    ],
  },
];

export default MenuItems;
