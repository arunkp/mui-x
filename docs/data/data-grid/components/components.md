# Data Grid - Components

<p class="description">The grid is highly customizable. Override components using the <code>slots</code> prop.</p>

## Overriding components

As part of the customization API, the grid allows you to override internal components with the `slots` prop.
The prop accepts an object of type [`GridSlotsComponent`](/x/api/data-grid/data-grid/#slots).

If you wish to pass additional props in a component slot, you can do it using the `slotProps` prop.
This prop is of type `GridSlotsComponentsProps`.

As an example, you could override the column menu and pass additional props as below.

```jsx
<DataGrid
  rows={rows}
  columns={columns}
  slots={{
    columnMenu: MyCustomColumnMenu,
  }}
  slotProps={{
    columnMenu: { background: 'red', counter: rows.length },
  }}
/>
```

:::warning
The `components/componentsProps` API is deprecated and `slots/slotProps` API is preferred.

Note that the `components` prop used _PascalCase_ for the slot names, while the `slots` prop uses _camelCase_.

```tsx
<DataGrid components={{ ColumnMenu: GridColumnMenu }} /> // Deprecated
<DataGrid slots={{ columnMenu: GridColumnMenu }} />
```

:::

### Interacting with the grid

The grid exposes two hooks to help you to access the grid data while overriding component slots.

They can be used as below:

- `useGridApiContext`: returns the `apiRef` object (more details in the [API object page](/x/react-data-grid/api-object/#inside-the-data-grid)).
- `useGridSelector`: returns the result of a selector on the current state (more details in the [State page](/x/react-data-grid/state/#access-the-state)).

```tsx
function CustomPagination() {
  const apiRef = useGridApiContext();
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      count={pageCount}
      page={paginationModel.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
```

## Components

The full list of overridable components slots can be found on the [`GridSlotsComponent`](/x/api/data-grid/data-grid/#slots) API page.

### Column menu

As mentioned above, the column menu is a component slot that can be recomposed easily and customized on each column as in the demo below.

{{"demo": "CustomColumnMenu.js", "bg": "inline"}}

Below is the default `GridColumnMenu`.

```tsx
export const GridColumnMenu = React.forwardRef<
  HTMLUListElement,
  GridColumnMenuProps
>(function GridColumnMenu(props: GridColumnMenuProps, ref) {
  const { hideMenu, colDef } = props;

  return (
    <GridColumnMenuContainer ref={ref} {...props}>
      <GridColumnMenuSortItem onClick={hideMenu} colDef={colDef} />
      <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef} />
      <GridColumnMenuColumnsItem onClick={hideMenu} colDef={colDef} />
    </GridColumnMenuContainer>
  );
});
```

### Toolbar

To enable the toolbar you need to add the `toolbar: GridToolbar` to the grid `slots` prop.
This demo showcases how this can be achieved.

{{"demo": "ToolbarGrid.js", "bg": "inline"}}

Alternatively, you can compose your own toolbar.

```jsx
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
```

{{"demo": "CustomToolbarGrid.js", "bg": "inline"}}

### Footer

The grid exposes props to hide specific elements of the UI:

- `hideFooter`: If `true`, the footer component is hidden.
- `hideFooterRowCount`: If `true`, the row count in the footer is hidden.
- `hideFooterSelectedRowCount`: If `true`, the selected row count in the footer is hidden.
- `hideFooterPagination`: If `true`, the pagination component in the footer is hidden.

{{"demo": "CustomFooter.js", "bg": "inline"}}

### Pagination

The default pagination component is exported as `GridPagination`.
This component is an extension of the [TablePagination](/material-ui/react-pagination/#table-pagination) component, and it renders the page size control, the number of rows in the page and also the buttons to go to the previous and next page.
You can replace the pagination component completely or reuse the default one.

The next demo reuses `GridPagination` but replaces the previous and next page buttons with [Pagination](/material-ui/react-pagination/), which renders a dedicated button for each page.

{{"demo": "CustomPaginationGrid.js", "bg": "inline"}}

### Loading overlay

By default, the loading overlay displays a circular progress.
This demo replaces it with a linear progress.

{{"demo": "CustomLoadingOverlayGrid.js", "bg": "inline"}}

### No rows overlay

In the following demo, an illustration is added on top of the default "No Rows" message.

{{"demo": "CustomEmptyOverlayGrid.js", "bg": "inline"}}

:::info
As the no rows overlay, the grid allows to override the no results overlay with the `NoResultsOverlay` slot.
:::

### Row

The `slotProps.row` prop can be used to pass additional props to the row component.
One common use case might be to listen for events not exposed by [default](/x/react-data-grid/events/#catalog-of-events).
The demo below shows a context menu when a row is right-clicked.

{{"demo": "RowContextMenu.js", "bg": "inline"}}

### Cell

The following demo uses the `slotProps.cell` prop to listen for specific events emitted by the cells.
Try it by hovering a cell with the mouse and it should display the number of characters each cell has.

{{"demo": "CellWithPopover.js", "bg": "inline"}}

### Icons

As any component slot, every icon can be customized. However, it is not yet possible to use the `slotProps` with icons.

{{"demo": "CustomSortIcons.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
