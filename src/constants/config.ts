import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Branded splash duration. Fixed at 8000ms by the factory contract. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_DELAY_MS = 300;
export const LOADER_PROGRESS_MS = 7400;

export const FADE_MS = 180;
export const CROSSFADE_MS = 150;

/** Layout invariants shared by every screen. */
export const HEADER_TOP_PAD = 44;
export const HEADER_CONTENT_H = 72;
export const BOTTOM_NAV_H = 72;
export const SCREEN_PAD = 16;
export const GAP = 12;

/** Bento geometry - parent padding + border are subtracted before dividing. */
export const BENTO_FRAME = SCREEN_PAD;
export const BENTO_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BENTO_COL_W = Math.floor((BENTO_MAX_W - GAP) / 2);
export const BENTO_H = 256;
export const BENTO_SMALL_H = Math.floor((BENTO_H - GAP) / 2);

export const BTN_PRIMARY_H = 58;
export const BTN_SECONDARY_H = 48;
export const TOUCH_MIN = 48;
export const ICON_SIZE = 24;
export const ICON_LINE_HEIGHT = 24;
export const BTN_ICON_GAP = 10;

/** Converter behaviour. */
export const DEFAULT_VALUE = 40;
export const STEP_CHOICES = [0.1, 1, 10] as const;
export const DEFAULT_STEP = 1;
export const MAX_NM = 1000000;
export const MIN_NM = 0;
export const STEPPER_HOLD_DELAY_MS = 400;
export const STEPPER_REPEAT_MS = 120;

export const DEFAULT_DECIMALS = 2;
export const DECIMAL_CHOICES = [0, 1, 2, 3] as const;

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export const APP_NAME = 'Torque Spec Sheet';
export const APP_VERSION = '1.0.0';
export const APP_PACKAGE = 'com.torquespec.sheet';
