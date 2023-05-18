import definedConst from "./definedConst";
import { Divider } from "@mui/material";

export const newsTagList = [
  {
    value: "anime",
    label: "ANIME",
    divider: "divider",
  },
  {
    value: "manga",
    label: "MANGA",
    divider: "divider",
  },
  {
    value: "asia",
    label: "ASIA",
    divider: null,
  },
];

export const roleList = [
  {
    value: "user",
    label: "user",
  },
  {
    value: "admin",
    label: "admin",
  },
];

export const userStatusList = [
  {
    value: "visible",
    label: "visible",
  },
  {
    value: "hided",
    label: "oculto",
  },
  {
    value: "pending",
    label: "pendiente",
  },
  {
    value: "banned",
    label: "baneado",
  },
];

export const statusList = [
  {
    value: "visible",
    label: "visible",
  },
  {
    value: "hided",
    label: "ocultar",
  },
  {
    value: "pending",
    label: "pendiente",
  },
];

export const gameTypeList = [
  {
    value: definedConst.GAME_SILHOUETTE,
    label: "Adivina la silueta",
  },
  {
    value: definedConst.GAME_MUSIC,
    label: "Adivina la música",
  },
];
