/* eslint-disable mocha/no-setup-in-describe */

import { BLOCKS } from '@contentful/rich-text-types';

import { block, document as doc, text } from '../../../packages/rich-text/src/helpers/nodeFactory';
import { getIframe } from '../../fixtures/utils';
import { RichTextPage } from './RichTextPage';

// the sticky toolbar gets in the way of some of the tests, therefore
// we increase the viewport height to fit the whole page on the screen

describe('Rich Text Editor - Headings', { viewportHeight: 2000 }, () => {
  let richText: RichTextPage;

  // copied from the 'is-hotkey' library we use for RichText shortcuts
  const IS_MAC =
    typeof window != 'undefined' && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
  const mod = IS_MAC ? 'meta' : 'control';
  const buildHelper =
    (type) =>
    (...children) =>
      block(type, {}, ...children);
  const paragraph = buildHelper(BLOCKS.PARAGRAPH);
  const paragraphWithText = (t) => paragraph(text(t, []));
  const emptyParagraph = () => paragraphWithText('');

  const entryBlock = () =>
    block(BLOCKS.EMBEDDED_ENTRY, {
      target: {
        sys: {
          id: 'example-entity-id',
          type: 'Link',
          linkType: 'Entry',
        },
      },
    });
  function getDropdownList() {
    return getIframe().findByTestId('dropdown-heading-list');
  }

  const headings = [
    [BLOCKS.PARAGRAPH, 'Normal text'],
    [BLOCKS.HEADING_1, 'Heading 1', `{${mod}+alt+1}`],
    [BLOCKS.HEADING_2, 'Heading 2', `{${mod}+alt+2}`],
    [BLOCKS.HEADING_3, 'Heading 3', `{${mod}+alt+3}`],
    [BLOCKS.HEADING_4, 'Heading 4', `{${mod}+alt+4}`],
    [BLOCKS.HEADING_5, 'Heading 5', `{${mod}+alt+5}`],
    [BLOCKS.HEADING_6, 'Heading 6', `{${mod}+alt+6}`],
  ];

  function addBlockquote(content = '') {
    richText.editor.click().type(content);

    richText.toolbar.quote.click();

    const expectedValue = doc(
      block(BLOCKS.QUOTE, {}, block(BLOCKS.PARAGRAPH, {}, text(content, []))),
      block(BLOCKS.PARAGRAPH, {}, text('', []))
    );

    richText.expectValue(expectedValue);

    return expectedValue;
  }

  beforeEach(() => {
    richText = new RichTextPage();
    richText.visit();
  });

  headings.forEach(([type, label, shortcut]) => {
    describe(label, () => {
      it(`allows typing ${label} (${type})`, () => {
        richText.editor.click().type('some text');

        richText.toolbar.toggleHeading(type);

        // TODO: We should somehow assert that the editor is focused after this.

        // Account for trailing paragraph
        const expectedValue =
          type === BLOCKS.PARAGRAPH
            ? doc(block(type, {}, text('some text', [])))
            : doc(block(type, {}, text('some text', [])), emptyParagraph());

        richText.expectValue(expectedValue);
      });

      if (shortcut) {
        it(`allows writing ${label} (${type}) via hotkeys ${shortcut}`, () => {
          richText.editor.click().type(shortcut).type('some text');

          const expectedValue = doc(block(type, {}, text('some text', [])), emptyParagraph());

          richText.expectValue(expectedValue);
        });
      }

      it(`should set the dropdown label to ${label}`, () => {
        richText.editor.click().type('some text');

        richText.toolbar.toggleHeading(type);

        richText.toolbar.headingsDropdown.should('have.text', label);
      });

      // TODO: Move this test to either a single test with multiple assertions or for only one heading type due to performance
      if (type !== BLOCKS.PARAGRAPH) {
        it('should unwrap blockquote', () => {
          addBlockquote('some text');

          richText.toolbar.toggleHeading(type);

          const expectedHeadingValue = doc(
            block(type, {}, text('some text', [])),
            block(BLOCKS.PARAGRAPH, {}, text('', []))
          );

          richText.expectValue(expectedHeadingValue);
        });
      } else {
        it('should not unwrap blockquote', () => {
          const expectedQuoteValue = addBlockquote('some text');

          richText.toolbar.toggleHeading(type);

          richText.expectValue(expectedQuoteValue);
        });
      }

      it('should be deleted if empty when pressing delete', () => {
        cy.shouldConfirm(true);
        richText.editor.click(); // to set an initial editor.location

        richText.toolbar.toggleHeading(type);

        richText.editor.type('x{enter}');

        richText.toolbar.embed('entry-block');

        // To make sure paragraph/heading is present
        richText.expectValue(doc(block(type, {}, text('x')), entryBlock(), emptyParagraph()));

        richText.editor
          .click('bottom')
          // Using `delay` to avoid flakiness, cypress triggers a keypress every 10ms and the editor was not responding correctly
          .type('{uparrow}{uparrow}{uparrow}{del}{del}', { delay: 100 });

        richText.expectValue(doc(entryBlock(), emptyParagraph()));
        cy.unsetShouldConfirm();
      });

      it('should delete next block if not empty when pressing delete', () => {
        cy.shouldConfirm(true);
        const value = 'some text';
        richText.editor.click().type(value);

        richText.toolbar.toggleHeading(type);

        richText.toolbar.embed('entry-block');

        // Using `delay` to avoid flakiness, cypress triggers a keypress every 10ms and the editor was not responding correcrly
        richText.editor.type('{leftarrow}{del}', { delay: 100 });

        richText.expectValue(doc(block(type, {}, text(value)), emptyParagraph()));
        cy.unsetShouldConfirm();
      });
    });
  });

  describe('Toolbar', () => {
    it('should be visible', () => {
      richText.toolbar.headingsDropdown.should('be.visible');

      richText.toolbar.headingsDropdown.click();
      getDropdownList().should('be.visible');
    });

    it(`should have ${headings.length} items`, () => {
      richText.toolbar.headingsDropdown.click();
      getDropdownList().children().should('have.length', headings.length);

      headings.forEach(([, label], index) => {
        getDropdownList().children().eq(index).should('have.text', label);
      });
    });
  });
});
