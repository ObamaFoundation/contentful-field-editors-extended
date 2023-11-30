import * as React from 'react';

import tokens from '@contentful/f36-tokens';
import { BLOCKS } from '@contentful/rich-text-types';
import { css, cx } from 'emotion';
import { Editor } from 'slate';

import { Element, RenderElementProps } from '../../internal/types';

const styles = {
  [BLOCKS.PARAGRAPH]: css`
    line-height: ${tokens.lineHeightDefault};
    margin-bottom: 1.5em;
  `,
  align: {
    left: css`
      text-align: left;
    `,
    center: css`
      text-align: center;
    `,
    right: css`
      text-align: right;
    `,
    justify: css`
      text-align: justify;
    `,
  },
};

export function Paragraph(
  props: RenderElementProps & {
    style: React.CSSProperties | undefined;
    editor: Editor;
    element: Element;
  }
) {
  return (
    <div
      {...props.attributes}
      className={cx(styles[BLOCKS.PARAGRAPH], styles.align[props.element?.data?.align as string])}
    >
      {props.children}
    </div>
  );
}
