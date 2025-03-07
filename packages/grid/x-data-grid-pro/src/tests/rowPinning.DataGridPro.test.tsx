import * as React from 'react';
import { expect } from 'chai';
import {
  DataGridPro,
  gridClasses,
  useGridApiRef,
  GridApi,
  GridRowsProp,
  DataGridProProps,
} from '@mui/x-data-grid-pro';
import { getBasicGridData } from '@mui/x-data-grid-generator';
import {
  createRenderer,
  fireEvent,
  screen,
  act,
  userEvent,
  // @ts-expect-error Remove once the test utils are typed
} from '@mui/monorepo/test/utils';
import {
  getActiveCell,
  getActiveColumnHeader,
  getCell,
  getColumnHeaderCell,
  getColumnValues,
  getRows,
} from 'test/utils/helperFn';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGridPro /> - Row pinning', () => {
  const { render } = createRenderer({ clock: 'fake' });

  function getRowById(id: number | string) {
    return document.querySelector(`[data-id="${id}"]`);
  }

  function getTopPinnedRowsContainer() {
    return document.querySelector(`.${gridClasses['pinnedRows--top']}`) as HTMLElement;
  }
  function getBottomPinnedRowsContainer() {
    return document.querySelector(`.${gridClasses['pinnedRows--bottom']}`) as HTMLElement;
  }

  function isRowPinned(row: Element | null, section: 'top' | 'bottom') {
    const container =
      section === 'top' ? getTopPinnedRowsContainer() : getBottomPinnedRowsContainer();
    if (!row || !container) {
      return false;
    }
    return container.contains(row);
  }

  function BaselineTestCase({
    rowCount,
    colCount,
    height = 300,
    ...props
  }: {
    rowCount: number;
    colCount: number;
    height?: number | string;
  } & Partial<DataGridProProps>) {
    const data = getBasicGridData(rowCount, colCount);
    const [pinnedRow0, pinnedRow1, ...rows] = data.rows;

    return (
      <div style={{ width: 302, height }}>
        <DataGridPro
          {...data}
          rows={rows}
          pinnedRows={{
            top: [pinnedRow0],
            bottom: [pinnedRow1],
          }}
          experimentalFeatures={{ rowPinning: true }}
          {...props}
        />
      </div>
    );
  }

  it('should render pinned rows in pinned containers', () => {
    render(<BaselineTestCase rowCount={20} colCount={5} />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should treat row as pinned even if row with the same id is present in `rows` prop', () => {
    const rowCount = 5;

    function TestCase({ pinRows = true }) {
      const data = getBasicGridData(rowCount, 5);

      const pinnedRows = React.useMemo(() => {
        if (pinRows) {
          return {
            top: [data.rows[0]],
            bottom: [data.rows[1]],
          };
        }
        return undefined;
      }, [pinRows, data.rows]);

      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            autoHeight
            pinnedRows={pinnedRows}
            experimentalFeatures={{ rowPinning: true }}
          />
        </div>
      );
    }

    const { setProps } = render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    expect(getColumnValues(0)).to.deep.equal(['0', '2', '3', '4', '1']);
    expect(screen.getByText(`Total Rows: ${rowCount - 2}`)).not.to.equal(null);

    setProps({ pinRows: false });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 not pinned');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 not pinned');
    expect(getColumnValues(0)).to.deep.equal(['0', '1', '2', '3', '4']);
    expect(screen.getByText(`Total Rows: ${rowCount}`)).not.to.equal(null);

    setProps({ pinRows: true });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    expect(getColumnValues(0)).to.deep.equal(['0', '2', '3', '4', '1']);
    expect(screen.getByText(`Total Rows: ${rowCount - 2}`)).not.to.equal(null);
  });

  it('should keep rows pinned on rows scroll', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    render(<BaselineTestCase rowCount={20} colCount={5} />);

    const virtualScroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
    expect(virtualScroller.scrollTop).to.equal(0);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    // scroll to the very bottom
    virtualScroller.scrollTop = 1000;
    virtualScroller.dispatchEvent(new Event('scroll'));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should update pinned rows when `pinnedRows` prop change', () => {
    const data = getBasicGridData(20, 5);
    function TestCase(props: any) {
      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            {...props}
            experimentalFeatures={{ rowPinning: true }}
          />
        </div>
      );
    }

    const { setProps } = render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    const pinnedRows = { top: [data.rows[11]], bottom: [data.rows[3]] };
    const rows = data.rows.filter((row) => row.id !== 11 && row.id !== 3);

    setProps({ pinnedRows, rows });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 pinned bottom');

    expect(isRowPinned(getRowById(11), 'top')).to.equal(true, '#11 pinned top');
    expect(isRowPinned(getRowById(3), 'bottom')).to.equal(true, '#3 pinned bottom');
  });

  it('should update pinned rows when calling `apiRef.current.setPinnedRows` method', async () => {
    const data = getBasicGridData(20, 5);
    let apiRef!: React.MutableRefObject<GridApi>;

    function TestCase(props: any) {
      const [pinnedRow0, pinnedRow1, ...rows] = data.rows;
      apiRef = useGridApiRef();
      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            apiRef={apiRef}
            {...props}
            experimentalFeatures={{ rowPinning: true }}
          />
        </div>
      );
    }

    render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    let pinnedRows = { top: [data.rows[11]], bottom: [data.rows[3]] };
    let rows = data.rows.filter((row) => row.id !== 11 && row.id !== 3);

    // should work when calling `setPinnedRows` before `setRows`
    act(() => apiRef.current.unstable_setPinnedRows(pinnedRows));
    act(() => apiRef.current.setRows(rows));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(false, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(false, '#1 pinned bottom');

    expect(isRowPinned(getRowById(11), 'top')).to.equal(true, '#11 pinned top');
    expect(isRowPinned(getRowById(3), 'bottom')).to.equal(true, '#3 pinned bottom');

    pinnedRows = { top: [data.rows[8]], bottom: [data.rows[5]] };
    rows = data.rows.filter((row) => row.id !== 8 && row.id !== 5);

    // should work when calling `setPinnedRows` after `setRows`
    act(() => apiRef.current.setRows(rows));
    act(() => apiRef.current.unstable_setPinnedRows(pinnedRows));

    expect(isRowPinned(getRowById(11), 'top')).to.equal(false, '#11 pinned top');
    expect(isRowPinned(getRowById(3), 'bottom')).to.equal(false, '#3 pinned bottom');

    expect(isRowPinned(getRowById(8), 'top')).to.equal(true, '#8 pinned top');
    expect(isRowPinned(getRowById(5), 'bottom')).to.equal(true, '#5 pinned bottom');
  });

  it('should work with `getRowId`', () => {
    function TestCase() {
      const data = getBasicGridData(20, 5);

      const rowsData = data.rows.map((row) => {
        const { id, ...rowData } = row;
        return {
          ...rowData,
          productId: id,
        };
      });

      const [pinnedRow0, pinnedRow1, ...rows] = rowsData;

      const getRowId = React.useCallback<NonNullable<DataGridProProps['getRowId']>>(
        (row) => row.productId,
        [],
      );

      return (
        <div style={{ width: 302, height: 300 }}>
          <DataGridPro
            {...data}
            rows={rows}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            getRowId={getRowId}
            experimentalFeatures={{ rowPinning: true }}
          />
        </div>
      );
    }

    render(<TestCase />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should not be impacted by sorting', () => {
    render(<BaselineTestCase rowCount={5} colCount={5} />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    expect(getColumnValues(0)).to.deep.equal(['0', '2', '3', '4', '1']);

    fireEvent.click(getColumnHeaderCell(0));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    expect(getColumnValues(0)).to.deep.equal(['0', '2', '3', '4', '1']);

    fireEvent.click(getColumnHeaderCell(0));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
    expect(getColumnValues(0)).to.deep.equal(['0', '4', '3', '2', '1']);
  });

  it('should not be impacted by filtering', () => {
    const { setProps } = render(<BaselineTestCase rowCount={20} colCount={5} />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    setProps({
      filterModel: {
        items: [{ field: 'currencyPair', operator: 'equals', value: 'GBPEUR' }],
      },
    });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    // should show pinned rows even if there's no filtering results
    setProps({
      filterModel: {
        items: [{ field: 'currencyPair', operator: 'equals', value: 'whatever' }],
      },
    });

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should work when there is no rows data', () => {
    render(<BaselineTestCase rowCount={20} colCount={5} />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  describe('keyboard navigation', () => {
    function getActiveCellRowId() {
      const cell = document.activeElement;
      if (!cell || cell.getAttribute('role') !== 'cell') {
        return undefined;
      }
      return cell.parentElement!.getAttribute('data-id');
    }

    it('should work with top pinned rows', () => {
      function TestCase() {
        const data = getBasicGridData(20, 5);
        const [pinnedRow0, pinnedRow1, ...rows] = data.rows;

        return (
          <div style={{ width: 302, height: 300 }}>
            <DataGridPro
              {...data}
              rows={rows}
              pinnedRows={{
                top: [pinnedRow1, pinnedRow0],
              }}
              experimentalFeatures={{ rowPinning: true }}
            />
          </div>
        );
      }

      render(<TestCase />);

      expect(isRowPinned(getRowById(1), 'top')).to.equal(true, '#1 pinned top');
      expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');

      userEvent.mousePress(getCell(0, 0));
      // first top pinned row
      expect(getActiveCellRowId()).to.equal('1');

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowDown' });
      // second top pinned row
      expect(getActiveCellRowId()).to.equal('0');

      fireEvent.keyDown(getCell(1, 0), { key: 'ArrowDown' });
      // first non-pinned row
      expect(getActiveCellRowId()).to.equal('2');

      fireEvent.keyDown(getCell(2, 0), { key: 'ArrowRight' });
      fireEvent.keyDown(getCell(2, 1), { key: 'ArrowUp' });
      fireEvent.keyDown(getCell(1, 1), { key: 'ArrowUp' });
      fireEvent.keyDown(getCell(0, 1), { key: 'ArrowUp' });
      expect(getActiveColumnHeader()).to.equal('1');
    });

    it('should work with bottom pinned rows', () => {
      function TestCase() {
        const data = getBasicGridData(5, 5);
        const [pinnedRow0, pinnedRow1, ...rows] = data.rows;

        return (
          <div style={{ width: 302, height: 300 }}>
            <DataGridPro
              {...data}
              rows={rows}
              pinnedRows={{
                bottom: [pinnedRow0, pinnedRow1],
              }}
              experimentalFeatures={{ rowPinning: true }}
            />
          </div>
        );
      }

      render(<TestCase />);

      expect(isRowPinned(getRowById(0), 'bottom')).to.equal(true, '#0 pinned top');
      expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned top');

      userEvent.mousePress(getCell(0, 0));
      expect(getActiveCellRowId()).to.equal('2');

      fireEvent.keyDown(getCell(0, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('3');

      fireEvent.keyDown(getCell(1, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('4');

      fireEvent.keyDown(getCell(2, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('0');

      fireEvent.keyDown(getCell(3, 0), { key: 'ArrowDown' });
      expect(getActiveCellRowId()).to.equal('1');
    });

    it('should work with pinned columns', function test() {
      if (isJSDOM) {
        // Need layouting
        this.skip();
      }

      function TestCase() {
        const data = getBasicGridData(5, 7);
        const [pinnedRow0, pinnedRow1, ...rows] = data.rows;

        return (
          <div style={{ width: 502, height: 300 }}>
            <DataGridPro
              {...data}
              rows={rows}
              pinnedRows={{
                top: [pinnedRow1],
                bottom: [pinnedRow0],
              }}
              initialState={{
                pinnedColumns: {
                  left: ['id'],
                  right: ['price2M'],
                },
              }}
              experimentalFeatures={{ rowPinning: true }}
            />
          </div>
        );
      }

      render(<TestCase />);

      expect(isRowPinned(getRowById(1), 'top')).to.equal(true, '#1 pinned top');
      expect(isRowPinned(getRowById(0), 'bottom')).to.equal(true, '#0 pinned bottom');

      // top-pinned row
      userEvent.mousePress(getCell(0, 3));
      expect(getActiveCell()).to.equal('0-3');
      expect(getActiveCellRowId()).to.equal('1');

      fireEvent.keyDown(getCell(0, 3), { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('0-4');

      fireEvent.keyDown(getCell(0, 4), { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('0-5');

      // right-pinned column cell
      fireEvent.keyDown(getCell(0, 5), { key: 'ArrowRight' });
      expect(getActiveCell()).to.equal('0-6');

      // go through the right-pinned column all way down to bottom-pinned row
      fireEvent.keyDown(getCell(0, 6), { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('1-6');
      expect(getActiveCellRowId()).to.equal('2');

      fireEvent.keyDown(getCell(1, 6), { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('2-6');
      expect(getActiveCellRowId()).to.equal('3');

      fireEvent.keyDown(getCell(2, 6), { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('3-6');
      expect(getActiveCellRowId()).to.equal('4');

      fireEvent.keyDown(getCell(3, 6), { key: 'ArrowDown' });
      expect(getActiveCell()).to.equal('4-6');
      expect(getActiveCellRowId()).to.equal('0');
    });
  });

  it('should work with variable row height', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    render(
      <BaselineTestCase
        rowCount={20}
        colCount={5}
        getRowHeight={(row) => {
          if (row.id === 0) {
            return 100;
          }
          if (row.id === 1) {
            return 20;
          }
          return undefined;
        }}
      />,
    );

    expect(getRowById(0)?.clientHeight).to.equal(100);
    expect(getRowById(1)?.clientHeight).to.equal(20);
  });

  it('should always update on `rowHeight` change', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    const defaultRowHeight = 52;

    const { setProps } = render(
      <BaselineTestCase rowCount={10} colCount={5} rowHeight={defaultRowHeight} />,
    );

    expect(getRowById(0)?.clientHeight).to.equal(defaultRowHeight);
    expect(document.querySelector(`.${gridClasses['pinnedRows--top']}`)?.clientHeight).to.equal(
      defaultRowHeight,
    );
    expect(getRowById(1)?.clientHeight).to.equal(defaultRowHeight);
    expect(document.querySelector(`.${gridClasses['pinnedRows--bottom']}`)?.clientHeight).to.equal(
      defaultRowHeight,
    );

    setProps({ rowHeight: 36 });

    expect(getRowById(0)?.clientHeight).to.equal(36);
    expect(document.querySelector(`.${gridClasses['pinnedRows--top']}`)?.clientHeight).to.equal(36);
    expect(getRowById(1)?.clientHeight).to.equal(36);
    expect(document.querySelector(`.${gridClasses['pinnedRows--bottom']}`)?.clientHeight).to.equal(
      36,
    );
  });

  it('should work with `autoHeight`', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    const columnHeaderHeight = 56;
    const rowHeight = 52;
    const rowCount = 10;

    render(
      <BaselineTestCase
        rowCount={rowCount}
        colCount={2}
        rowHeight={rowHeight}
        columnHeaderHeight={columnHeaderHeight}
        hideFooter
        autoHeight
      />,
    );

    expect(document.querySelector(`.${gridClasses.main}`)!.clientHeight).to.equal(
      columnHeaderHeight + rowHeight * rowCount,
    );
  });

  it('should work with `autoPageSize`', function test() {
    if (isJSDOM) {
      // Need layouting
      this.skip();
    }

    render(
      <BaselineTestCase
        rowCount={10}
        colCount={5}
        rowHeight={52}
        pagination
        autoPageSize
        columnHeaderHeight={56}
        hideFooter
      />,
    );

    // 300px grid height - 56px header = 244px available for rows
    // 244px / 52px = 4 rows = 2 rows + 1 top-pinned row + 1 bottom-pinned row
    expect(getRows().length).to.equal(4);
  });

  it('should not allow to expand detail panel of pinned row', () => {
    render(
      <BaselineTestCase
        rowCount={10}
        colCount={5}
        height={500}
        getDetailPanelContent={({ row }) => <div>{row.id}</div>}
      />,
    );

    const cell = getCell(0, 0);
    expect(cell.querySelector('[aria-label="Expand"]')).to.have.attribute('disabled');
  });

  it('should not allow to reorder pinned rows', () => {
    render(<BaselineTestCase rowCount={10} colCount={5} rowReordering />);

    const cell = getCell(0, 0);
    expect(cell.querySelector(`.${gridClasses.rowReorderCell}`)).to.equal(null);
  });

  it('should keep pinned rows on page change', () => {
    render(
      <BaselineTestCase
        rowCount={20}
        colCount={5}
        height={500}
        pagination
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        pageSizeOptions={[5]}
      />,
    );

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should not count pinned rows as part of the page', () => {
    const pageSize = 3;

    render(
      <BaselineTestCase
        rowCount={20}
        colCount={5}
        height={500}
        pagination
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        pageSizeOptions={[pageSize]}
      />,
    );

    expect(getRows().length).to.equal(pageSize + 2); // + 2 pinned rows
  });

  it('should render pinned rows outside of the tree data', () => {
    const rows: GridRowsProp = [
      { id: 0, name: 'A' },
      { id: 1, name: 'A.B' },
      { id: 2, name: 'A.A' },
      { id: 3, name: 'B.A' },
      { id: 4, name: 'B.B' },
    ];

    const columns = [{ field: 'name', width: 200 }];

    function Test() {
      const [pinnedRow0, pinnedRow1, ...rowsData] = rows;

      return (
        <div style={{ width: 300, height: 400 }}>
          <DataGridPro
            treeData
            getTreeDataPath={(row) => row.name.split('.')}
            rows={rowsData}
            columns={columns}
            pinnedRows={{
              top: [pinnedRow0],
              bottom: [pinnedRow1],
            }}
            experimentalFeatures={{ rowPinning: true }}
          />
        </div>
      );
    }

    render(<Test />);

    expect(isRowPinned(getRowById(0), 'top')).to.equal(true, '#0 pinned top');
    expect(isRowPinned(getRowById(1), 'bottom')).to.equal(true, '#1 pinned bottom');
  });

  it('should not be selectable', () => {
    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase() {
      apiRef = useGridApiRef();
      return <BaselineTestCase rowCount={20} colCount={5} apiRef={apiRef} />;
    }

    render(<TestCase />);

    fireEvent.click(getCell(0, 0));
    expect(apiRef!.current.isRowSelected(0)).to.equal(false);
  });

  it('should not render selection checkbox for pinned rows', () => {
    render(<BaselineTestCase rowCount={20} colCount={5} checkboxSelection />);

    expect(getRowById(0)!.querySelector('input[type="checkbox"]')).to.equal(null);
    expect(getRowById(1)!.querySelector('input[type="checkbox"]')).to.equal(null);
  });

  it('should export pinned rows to CSV', () => {
    let apiRef: React.MutableRefObject<GridApi>;

    function TestCase() {
      apiRef = useGridApiRef();
      return <BaselineTestCase rowCount={20} colCount={1} apiRef={apiRef} />;
    }

    render(<TestCase />);

    const csv = apiRef!.current.getDataAsCsv({
      includeHeaders: false,
    });

    const csvRows = csv.split('\r\n');
    expect(csvRows[0]).to.equal('0');
    expect(csvRows[csvRows.length - 1]).to.equal('1');
  });

  it('should include pinned rows in `aria-rowcount` attribute', () => {
    const rowCount = 10;

    render(<BaselineTestCase rowCount={rowCount} colCount={1} />);

    expect(screen.getByRole('grid')).to.have.attribute('aria-rowcount', `${rowCount + 1}`); // +1 for header row
  });

  // https://github.com/mui/mui-x/issues/5845
  it('should work with `getCellClassName` when `rows=[]`', () => {
    const className = 'test-class-name';
    render(
      <BaselineTestCase rowCount={2} colCount={1} rows={[]} getRowClassName={() => className} />,
    );

    expect(getRowById(0)!).to.have.class(className);
    expect(getRowById(1)!).to.have.class(className);
  });
});
