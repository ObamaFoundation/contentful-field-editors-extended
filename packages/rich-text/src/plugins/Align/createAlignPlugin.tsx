import { BLOCKS } from '@contentful/rich-text-types';
import { createAlignPlugin as createDefaultAlignPlugin } from '@udecode/plate-alignment';
import { PlatePlugin } from 'internal';

import { withAlignNormalizer } from './withAlignNormalizer';

/**
 * Override the default alignment plugin.
 */
export const createAlignPlugin = (): PlatePlugin =>
  createDefaultAlignPlugin({
    withOverrides: withAlignNormalizer,
    inject: {
      props: {
        validTypes: [
          BLOCKS.PARAGRAPH,
          BLOCKS.HEADING_1,
          BLOCKS.HEADING_2,
          BLOCKS.HEADING_3,
          BLOCKS.HEADING_4,
          BLOCKS.HEADING_5,
          BLOCKS.HEADING_6,
        ],
      },
    },
  });
