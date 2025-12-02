import type { Theme } from '@ant-design/react-native/lib/style';

import { generate } from '@ant-design/colors';

export const grey = generate('#bfbfbf');
export const blue = generate('#1f78d1');
export const green = generate('#4caf50');
export const orange = generate('#ff9800');
export const red = generate('#d32f2f');

export const antTheme: Partial<Theme> = {
  primary_button_fill: blue[5],
  primary_button_fill_tap: blue[3],

  warning_button_fill: red[5],
  warning_button_fill_tap: red[3],

  color_text_base: grey[9],
  color_text_base_inverse: grey[1],

  color_text_caption: grey[7],
  color_text_placeholder: grey[4],

  brand_error: red[5],

  border_color_base: grey[2],
};
