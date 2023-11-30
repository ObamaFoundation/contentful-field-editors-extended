import { ClassNamesArg, css } from 'emotion';
import { Element } from 'internal';

const styles = {
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
};

export const useAlignmentStyles = (element: Element): ClassNamesArg => {
  const align = element?.data?.align as string;
  return styles[align];
};
