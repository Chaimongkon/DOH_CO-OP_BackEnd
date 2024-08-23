import styled from "@emotion/styled";
import {
  IconChartDonut,
  IconLayoutDashboard,
  IconPercentage100,
  IconPhoto,
  IconCircleArrowDown,
  IconHomeCog,
  IconShieldCheck,
  IconFolderOpen,
  IconApps
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
    id: uniqueId(),
    title: "เลือกตั้งสหกรณ์ฯ",
    icon: IconShieldCheck,
    href: "/Elections",
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
        title: "ข่าวประชาสัมพันธ์",
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
        title: "รูปภาพ DOHCoop",
        href: "/VideoAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "วิดีโอ CoopNews",
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
        title: "รู้จักสหกรณ์ฯ",
        href: "/CooperativeSocietyAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "คณะกรรมการดำเนินการ",
        href: "/BoardOrganizational",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ผู้ตรวจสอบบัญชีและผู้ตรวจสอบกิจการ",
        href: "/AuditorsOrganizational",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "เจ้าหน้าที่สหกรณ์ฯ",
        href: "/OfficerOrganizational",
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
        href: "/BusinessReportAll",
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
        href: "/WelfareFormAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มสมัครสมาชิก",
        href: "/MembershipFormAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มเงินฝาก - ถอน",
        href: "/DepositsWithdrawFormAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มเกี่ยวกับเงินกู้",
        href: "/LoanFormAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มหนังสือร้องทุกข์ / ร้องเรียน",
        href: "/ComplaintComplaintFormAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "หนังสือแต่งตั้งผู้รับโอนประโยชน์",
        href: "/BeneficiaryFormAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ใบคำขอเอาประกันภัยกลุ่มสหกรณ์",
        href: "/GroupInsuranceFormAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มอื่น ๆ",
        href: "/OtherFormAll",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "ข้อบังคับ ระเบียบ ประกาศ",
    icon: IconFolderOpen,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ข้อบังคับ",
        href: "/StatuteAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ระเบียบ",
        href: "/RegularityAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ประกาศ",
        href: "/DeclareAll",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "แอปพลิเคชั่นสหกรณ์ฯ",
    icon: IconApps,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "การติดตั้ง",
        href: "/InstallationAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ดูข้อมูลส่วนบุคคล",
        href: "/InformationAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "จัดการปัญชี",
        href: "/ManageAccountsAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "การทำธุรกรรม",
        href: "/TransactionsAll",
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "การตั้งค่าผู้ใช้งาน",
        href: "/UserSettingsAll",
      },
    ],
  },
];

export default MenuItems;
