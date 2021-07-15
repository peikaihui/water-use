import type {
  MenuModal,
} from '../api-mods/external';

import {
  MENU_GROUP_ENUM,
  AUTH_TYPE_ENUM,
} from '../api-mods/external';
import { getEnvConfig } from '../env';

const { VITE_MENU_ACTIVE, VITE_USE_AUTH } = getEnvConfig();

export const getDarkMenus = (external: MenuModal[]) => {
  const originMenus = external
    .filter(({ isAccessible, options }: MenuModal) => !VITE_USE_AUTH || !!isAccessible || options.deniedType !== AUTH_TYPE_ENUM.HIDDEN)
    .sort((prev: MenuModal, next: MenuModal) => next.order - prev.order);

  const baseMenus = originMenus.filter((mItem: MenuModal) => mItem.group === MENU_GROUP_ENUM.BASE);
  const otherMenus = originMenus.filter((mItem: MenuModal) => mItem.group === MENU_GROUP_ENUM.OTHER);
  return {
    [MENU_GROUP_ENUM.BASE]: baseMenus,
    [MENU_GROUP_ENUM.OTHER]: otherMenus,
  };
};

export interface NavActiveModal {
  activeNavCode: string
  openNavCode: string
  twoNavItem: MenuModal
  threeNavItem: MenuModal
}

export const getAvtiveKey = (navs: MenuModal[], fullPath: string): NavActiveModal => {
  // 如果没有 二级 导航
  if (!navs.length) {
    return {
      activeNavCode: '',
      openNavCode: '',
      twoNavItem: {} as MenuModal,
      threeNavItem: {} as MenuModal,
    };
  }

  const testPathNavs: MenuModal[] = [];
  let activeNavCode = '';
  let openNavCode = '';
  let twoNavItem = {} as MenuModal;
  let threeNavItem = {} as MenuModal;
  navs.forEach(({ subMenus, ...eItem }: MenuModal) => {
    testPathNavs.push(eItem);
    // NOTE 匹配 三级
    if (subMenus && subMenus.length) {
      const activeNavItem = subMenus.find((sItem: MenuModal) => fullPath.includes(sItem.path));

      if (activeNavItem) {
        activeNavCode = activeNavItem.permissionCode;
        threeNavItem = activeNavItem;
      }
    }
    else {
      const activeNav = fullPath.includes(eItem.path);
      if (activeNav) {
        activeNavCode = eItem.permissionCode;
        openNavCode = eItem.permissionCode;
        twoNavItem = eItem;
      }
    }
    // NOTE 匹配 二级
    if (activeNavCode && !openNavCode) {
      openNavCode = eItem.permissionCode;
      twoNavItem = eItem;
    }
  });

  return {
    activeNavCode,
    openNavCode,
    twoNavItem,
    threeNavItem,
  };
};

export interface LightMenusModal {
  title: string
  currentNavs: MenuModal[]
}

export const getLightMenus = (external: MenuModal[], menuActive?: string): LightMenusModal => {
  const currentMenus = external.find((eItem: MenuModal) => menuActive ? (eItem.permissionCode === menuActive) : (eItem.permissionCode === VITE_MENU_ACTIVE));
  const currentNavs = currentMenus?.subMenus || [];
  return {
    title: currentMenus?.name || '',
    currentNavs,
  };
};
