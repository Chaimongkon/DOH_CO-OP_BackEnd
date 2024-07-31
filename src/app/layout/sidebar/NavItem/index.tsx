import React, { useState } from "react";
import Link from "next/link";

// MUI imports
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { Theme, useTheme, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { IconChevronDown } from "@tabler/icons-react"; // Import the icon

type NavGroup = {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: NavGroup[];
  chip?: string;
  chipColor?: any;
  variant?: string | any;
  external?: boolean;
  level?: number;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  disabled?: boolean;
  subtitle?: string;
  bgcolor?: string;
};

interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: boolean;
  level?: number;
  pathDirect: string;
}

const NavItem: React.FC<ItemType> = ({
  item,
  level = 1,
  pathDirect,
  hideMenu,
  onClick,
}) => {
  const theme = useTheme();
  const Icon = item.icon;
  const itemIcon = Icon ? <Icon stroke={1.5} size="1.3rem" /> : null;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const ListItemStyled = styled(ListItemButton)(({ theme }) => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "5px 10px 5px 0",
    borderRadius: `30px`,
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color:
      level > 1 && pathDirect === item.href
        ? `${theme.palette.primary.main}!important`
        : theme.palette.text.secondary,
    fontWeight:
      level > 1 && pathDirect === item.href ? "600 !important" : "400",
    paddingLeft: hideMenu
      ? "0"
      : level > 2
      ? `${level * 15}px`
      : level > 1
      ? "10px"
      : "0",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "-20px",
      height: "100%",
      zIndex: "-1",
      borderRadius: "0 24px 24px 0",
      transition: "all .3s ease-in-out",
      width: "0",
    },
    "&:hover::before": {
      width: "calc(100% + 20px)",
      backgroundColor: theme.palette.primary.light,
    },
    "& > .MuiListItemIcon-root": {
      width: 45,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      marginRight: "8px",
      transition: "all .3s ease-in-out",
    },
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&.Mui-selected": {
      backgroundColor: "transparent !important",
      ".MuiListItemIcon-root": {
        color: theme.palette.primary.main,
      },
      "&:before": {
        backgroundColor: theme.palette.primary.light,
        width: "calc(100% + 16px)",
      },
      "&:hover": {
        color: theme.palette.text.primary,
      },
    },
  }));

  return (
    <>
      <List component="li" disablePadding key={item.id}>
        {item.href ? (
          <Link href={item.href} passHref legacyBehavior>
            <ListItemStyled
              disabled={item.disabled}
              selected={pathDirect === item.href}
              onClick={item.children ? handleClick : onClick}
              sx={{
                textDecoration: "none",
                "&:hover": {
                  ".MuiListItemIcon-root": {
                    color: item.bgcolor ? `${item.bgcolor}.main` : "",
                  },
                },
                "&:hover::before": {
                  backgroundColor: item.bgcolor ? `${item.bgcolor}.light` : "",
                },
                "&.Mui-selected": {
                  color:
                    level > 1
                      ? `${theme.palette.text.secondary} !important`
                      : theme.palette.primary.main,
                  "& .MuiTypography-root": {
                    fontWeight: "600 !important",
                  },
                  ".MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                  "&:before": {
                    backgroundColor: theme.palette.primary.light,
                  },
                  "&:hover": {
                    color: theme.palette.primary.main,
                    ".MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "36px",
                  p: "3px 0",
                  color:
                    level > 1 && pathDirect === item.href
                      ? `${theme.palette.primary.main}!important`
                      : "inherit",
                }}
              >
                {itemIcon}
              </ListItemIcon>
              <ListItemText>
                {hideMenu ? "" : <>{item.title}</>}
                {item.subtitle && (
                  <Typography variant="caption">
                    {hideMenu ? "" : item.subtitle}
                  </Typography>
                )}
              </ListItemText>
              {!item.chip || hideMenu ? null : (
                <Chip
                  color={item.chipColor}
                  variant={item.variant || "filled"}
                  size="small"
                  label={item.chip}
                />
              )}
              {item.children && (
                <IconChevronDown
                  size={16}
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    marginLeft: "auto",
                  }}
                />
              )}
            </ListItemStyled>
          </Link>
        ) : (
          <ListItemStyled
            disabled={item.disabled}
            selected={pathDirect === item.href}
            onClick={item.children ? handleClick : onClick}
            sx={{
              textDecoration: "none",
              "&:hover": {
                ".MuiListItemIcon-root": {
                  color: item.bgcolor ? `${item.bgcolor}.main` : "",
                },
              },
              "&:hover::before": {
                backgroundColor: item.bgcolor ? `${item.bgcolor}.light` : "",
              },
              "&.Mui-selected": {
                color:
                  level > 1
                    ? `${theme.palette.text.secondary} !important`
                    : theme.palette.primary.main,
                "& .MuiTypography-root": {
                  fontWeight: "600 !important",
                },
                ".MuiListItemIcon-root": {
                  color: theme.palette.primary.main,
                },
                "&:before": {
                  backgroundColor: theme.palette.primary.light,
                },
                "&:hover": {
                  color: theme.palette.primary.main,
                  ".MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: "36px",
                p: "3px 0",
                color:
                  level > 1 && pathDirect === item.href
                    ? `${theme.palette.primary.main}!important`
                    : "inherit",
              }}
            >
              {itemIcon}
            </ListItemIcon>
            <ListItemText>
              {hideMenu ? "" : <>{item.title}</>}
              {item.subtitle && (
                <Typography variant="caption">
                  {hideMenu ? "" : item.subtitle}
                </Typography>
              )}
            </ListItemText>
            {!item.chip || hideMenu ? null : (
              <Chip
                color={item.chipColor}
                variant={item.variant || "filled"}
                size="small"
                label={item.chip}
              />
            )}
            {item.children && (
              <IconChevronDown
                size={16}
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                  marginLeft: "auto",
                }}
              />
            )}
          </ListItemStyled>
        )}
        {item.children && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <NavItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  onClick={onClick}
                />
              ))}
            </List>
          </Collapse>
        )}
      </List>
    </>
  );
};

export default NavItem;
