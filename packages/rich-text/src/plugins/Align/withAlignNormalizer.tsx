import type { PlateEditor } from '@udecode/plate-core';
import { Value } from 'internal';

export const withAlignNormalizer = <
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>
>(
  editor: E
) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    // Normalize the node if necessary
    if (
      editor.pluginsByKey.align?.inject.props?.validTypes?.includes(node.type as string) &&
      node.data &&
      node.align
    ) {
      node.data = { ...node.data, align: node.align };
    }

    // Call other normalizers
    normalizeNode([node, path]);
  };

  return editor;
};
