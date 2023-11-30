import * as React from 'react';

import tokens from '@contentful/f36-tokens';
import { BLOCKS } from '@contentful/rich-text-types';
import { css, cx } from 'emotion';

import { Element, RenderElementProps } from '../../internal/types';
import { useAlignmentStyles } from '../Align';

const styles = {
  [BLOCKS.PARAGRAPH]: css`
    line-height: ${tokens.lineHeightDefault};
    margin-bottom: 1.5em;
  `,
};

export function Paragraph(
  props: RenderElementProps & {
    element: Element;
  }
) {
  const alignmentStyles = useAlignmentStyles(props.element);
  return (
    <div {...props.attributes} className={cx(styles[BLOCKS.PARAGRAPH], alignmentStyles)}>
      {props.children}
    </div>
  );
}
