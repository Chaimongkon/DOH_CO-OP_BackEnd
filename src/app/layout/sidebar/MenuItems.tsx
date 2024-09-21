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
  IconApps,
  IconHours24,
  IconUserStar
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
    roles: ["SuperAdmin", "Admin", "Administrative", "Welfare"],
  },
  {
    id: uniqueId(),
    title: "เลือกตั้งสหกรณ์ฯ",
    icon: IconShieldCheck,
    href: "/ElectionAll",
    roles: ["SuperAdmin"],
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
        roles: ["SuperAdmin", "Admin", "Administrative", "Welfare"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "Slides",
        href: "/SlideAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "Notifications",
        href: "/NotifyAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "รูปภาพ DOHCoop",
        href: "/PhotoAll",
        roles: ["SuperAdmin", "Admin", "Welfare"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "วิดีโอ CoopNews",
        href: "/VideoAll",
        roles: ["SuperAdmin", "Admin", "Welfare"],
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
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "คณะกรรมการดำเนินการ",
        href: "/BoardOrganizational",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ผู้ตรวจสอบบัญชีและผู้ตรวจสอบกิจการ",
        href: "/AuditorsOrganizational",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "เจ้าหน้าที่สหกรณ์ฯ",
        href: "/OfficerOrganizational",
        roles: ["SuperAdmin"],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "บริการ",
    icon: IconHours24,
    children: [
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "สมัครสมาชิก",
        href: "/MemberAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "สวัสดิการสมาชิก",
        href: "/WelfareAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "บริการทำประกัน",
        href: "/InsuranceAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "บริการเงินฝาก",
        href: "/DepositAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "บริการเงินกู้",
        href: "/LoanAll",
        roles: ["SuperAdmin"],
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
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มสมัครสมาชิก",
        href: "/MembershipFormAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มเงินฝาก - ถอน",
        href: "/DepositsWithdrawFormAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มเกี่ยวกับเงินกู้",
        href: "/LoanFormAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มหนังสือร้องทุกข์ / ร้องเรียน",
        href: "/ComplaintComplaintFormAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "หนังสือแต่งตั้งผู้รับโอนประโยชน์",
        href: "/BeneficiaryFormAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ใบคำขอเอาประกันภัยกลุ่มสหกรณ์",
        href: "/GroupInsuranceFormAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "แบบฟอร์มอื่น ๆ",
        href: "/OtherFormAll",
        roles: ["SuperAdmin"],
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
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "เอกสารประชุมใหญ่",
        href: "/BusinessReportAll",
        roles: ["SuperAdmin"],
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
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ระเบียบ",
        href: "/RegularityAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ประกาศ",
        href: "/DeclareAll",
        roles: ["SuperAdmin"],
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
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "ดูข้อมูลส่วนบุคคล",
        href: "/InformationAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "จัดการปัญชี",
        href: "/ManageAccountsAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "การทำธุรกรรม",
        href: "/TransactionsAll",
        roles: ["SuperAdmin"],
      },
      {
        id: uniqueId(),
        icon: StyledIcon,
        title: "การตั้งค่าผู้ใช้งาน",
        href: "/UserSettingsAll",
        roles: ["SuperAdmin"],
      },
    ],
  },
  {
    navlabel: true,
    subheader: "Adminitrator",
  },
  {
    id: uniqueId(),
    title: "User Coop",
    icon: IconUserStar,
    href: "/UserManagement",
    roles: ["SuperAdmin"],
  },
];

export default MenuItems;
