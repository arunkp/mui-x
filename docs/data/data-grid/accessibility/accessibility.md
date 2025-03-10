# Data Grid - Accessibility

<p class="description">The Data Grid has complete accessibility support, including built-in keyboard navigation that follows international standards.</p>

## Guidelines

The most commonly encountered conformance guidelines for accessibility are:

- [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) - Globally accepted standard
- [ADA](https://www.ada.gov/) - US Department of Justice
- [Section 508](https://www.section508.gov/) - US federal agencies

WCAG 2.0 has three levels of conformance: A, AA, and AAA.
Level AA matches the ADA and Section 508 guidelines, so this is the most common target for organizations to aim for.

The [WAI-ARIA authoring practices](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) provide valuable information on how to optimize the accessibility of a grid.

## Density

You can change the density of the rows and the column header.

### Density selector

To enable the density selector, create a toolbar containing the `GridToolbarDensitySelector` component and apply it using the `toolbar` property in the Data Grid's `slots` prop.
The user can then change the density of the Data Grid by using the density selector from the toolbar, as the following demo illustrates:

{{"demo": "DensitySelectorGrid.js", "bg": "inline"}}

To hide the density selector, add the `disableDensitySelector` prop to the Data Grid.

### Density prop

Set the vertical density of the Data Grid using the `density` prop.
This prop applies the values determined by the `rowHeight` and `columnHeaderHeight` props, if supplied.
The user can override this setting with the optional toolbar density selector.

The following demo shows a Data Grid with the default density set to `compact`:

{{"demo": "DensitySelectorSmallGrid.js", "bg": "inline"}}

## Keyboard navigation

The Data Grid listens for keyboard interactions from the user and emits events in response to key presses within cells.

### Tab sequence

According to [WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), only one of the focusable elements contained by a composite widget should be included in the page tab sequence.
For an element to be included in the tab sequence, it needs to have a `tabIndex` value of zero or greater.

When a user focuses on a Data Grid cell, the first inner element with `tabIndex={0}` receives the focus.
If there is no element with `tabIndex={0}`, the focus is set on the cell itself.

The two Data Grids below illustrate how the user experience is impacted by improper management of the page tab sequence, making it difficult to navigate through the data set:

{{"demo": "FocusManagement.js", "bg": "inline", "defaultCodeOpen": false}}

If you customize cell rendering with the [`renderCell`](/x/react-data-grid/column-definition/#rendering-cells) method, you become responsible for removing focusable elements from the page tab sequence.
Use the `tabIndex` prop passed to the `renderCell` params to determine if the rendered cell has focus and if, as a result, the inner elements should be removed from the tab sequence:

```jsx
renderCell: (params) => (
  <Box>
    <Link tabIndex={params.tabIndex} href="/#">
      more info
    </Link>
  </Box>
);
```

### Navigation

The following key assignments apply to Windows and Linux users.

On macOS:

- replace <kbd class="key">Ctrl</kbd> with <kbd class="key">⌘ Command</kbd>
- replace <kbd class="key">Alt</kbd> with <kbd class="key">⌥ Option</kbd>

|                                                               Keys | Description                                                 |
| -----------------------------------------------------------------: | :---------------------------------------------------------- |
|                                  <kbd class="key">Arrow Left</kbd> | Navigate between cell elements                              |
|                                <kbd class="key">Arrow Bottom</kbd> | Navigate between cell elements                              |
|                                 <kbd class="key">Arrow Right</kbd> | Navigate between cell elements                              |
|                                    <kbd class="key">Arrow Up</kbd> | Navigate between cell elements                              |
|                                        <kbd class="key">Home</kbd> | Navigate to the first cell of the current row               |
|                                         <kbd class="key">End</kbd> | Navigate to the last cell of the current row                |
| <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Home</kbd></kbd> | Navigate to the first cell of the first row                 |
|  <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">End</kbd></kbd> | Navigate to the last cell of the last row                   |
|                                       <kbd class="key">Space</kbd> | Navigate to the next scrollable page                        |
|                                     <kbd class="key">Page Up</kbd> | Navigate to the previous scrollable page                    |
|                                   <kbd class="key">Page Down</kbd> | Navigate to the next scrollable page                        |
|                                       <kbd class="key">Space</kbd> | Toggle row children expansion when grouping cell is focused |

### Selection

|                                                                         Keys | Description                                                          |
| ---------------------------------------------------------------------------: | :------------------------------------------------------------------- |
|         <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Space</kbd></kbd> | Select the current row                                               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Arrow Up/Down</kbd></kbd> | Select the current row and the row above or below                    |
|                                  <kbd class="key">Shift</kbd>+ Click on cell | Select the range of rows between the first and the last clicked rows |
|              <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">A</kbd></kbd> | Select all rows                                                      |
|              <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">C</kbd></kbd> | Copy the currently selected rows                                     |
|                                   <kbd class="key">Ctrl</kbd>+ Click on cell | Enable multi-selection                                               |
|                         <kbd class="key">Ctrl</kbd>+ Click on a selected row | Deselect the row                                                     |

### Sorting

|                                                                 Keys | Description                                        |
| -------------------------------------------------------------------: | :------------------------------------------------- |
|                         <kbd class="key">Ctrl</kbd>+ Click on header | Enable multi-sorting                               |
|                        <kbd class="key">Shift</kbd>+ Click on header | Enable multi-sorting                               |
| <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Enter</kbd></kbd> | Enable multi-sorting when column header is focused |
|                                         <kbd class="key">Enter</kbd> | Sort column when column header is focused          |
|  <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> | Open column menu when column header is focused     |

### Group and pivot

|                                                                Keys | Description                      |
| ------------------------------------------------------------------: | :------------------------------- |
| <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> | Toggle the detail panel of a row |

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
