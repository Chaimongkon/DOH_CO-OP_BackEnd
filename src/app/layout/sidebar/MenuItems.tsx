import styled from "@emotion/styled";
import {
  IconChartDonutFilled,
  IconLayoutDashboard,
  IconPercentage100,
  IconPhoto,
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
        title: "Slide Show",
        href: "/SlideShowAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "Dialog Box",
        href: "/utilities/typography",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "ผลการดำเนินงาน",
    icon: IconChartDonutFilled,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "รายการสิ้นทรัพย์ย่อ",
        href: "/utilities/typography/typography",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "เอกสารประชุมใหญ่",
        href: "/utilities/typography/typography2",
      },
    ],
  },
];

export default MenuItems;
