import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/base/utils';
import { PickersActionBarProps } from '../PickersActionBar';
import { DateOrTimeView } from '../internals/models/views';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../internals/models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../internals/models/props/tabs';
import { UsePickerLayoutPropsResponseLayoutProps } from '../internals/hooks/usePicker/usePickerLayoutProps';
import { UncapitalizeObjectKeys } from '../internals/utils/slots-migration';
import { PickersLayoutClasses } from './pickersLayoutClasses';
import { WrapperVariant } from '../internals/models/common';
import { PickersShortcutsProps } from '../PickersShortcuts';

export interface ExportedPickersLayoutSlotsComponent<TValue, TDate, TView extends DateOrTimeView> {
  /**
   * Custom component for the action bar, it is placed bellow the picker views.
   * @default PickersActionBar
   */
  ActionBar?: React.ElementType<PickersActionBarProps>;
  /**
   * Custom component for the shortcuts.
   * @default PickersShortcuts
   */
  Shortcuts?: React.JSXElementConstructor<PickersShortcutsProps<TValue>>;
  /**
   * Custom component for wrapping the layout.
   * It wraps the toolbar, views, action bar, and shortcuts.
   */
  Layout?: React.JSXElementConstructor<
    PickersLayoutProps<TValue, TDate, TView> & React.RefAttributes<HTMLDivElement>
  >;
}

interface PickersLayoutActionBarOwnerState<TValue, TDate, TView extends DateOrTimeView>
  extends PickersLayoutProps<TValue, TDate, TView> {
  wrapperVariant: WrapperVariant;
}

interface PickersShortcutsOwnerState<TValue> extends PickersShortcutsProps<TValue> {
  wrapperVariant: WrapperVariant;
}

export interface ExportedPickersLayoutSlotsComponentsProps<
  TValue,
  TDate,
  TView extends DateOrTimeView,
> {
  /**
   * Props passed down to the action bar component.
   */
  actionBar?: SlotComponentProps<
    React.ComponentType<
      Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>
    >,
    {},
    PickersLayoutActionBarOwnerState<TValue, TDate, TView>
  >;
  /**
   * Props passed down to the shortcuts component.
   */
  shortcuts?: SlotComponentProps<
    React.ComponentType<PickersShortcutsProps<TValue>>,
    {},
    PickersShortcutsOwnerState<TValue>
  >;
  /**
   * Props passed down to the layoutRoot component.
   */
  layout?: Partial<PickersLayoutProps<TValue, TDate, TView>>;
}

export interface PickersLayoutSlotsComponent<TValue, TDate, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponent<TValue, TDate, TView> {
  /**
   * Tabs enabling toggling between views.
   */
  Tabs?: React.ElementType<BaseTabsProps<TView>>;
  /**
   * Custom component for the toolbar.
   * It is placed above the picker views.
   */
  Toolbar?: React.JSXElementConstructor<BaseToolbarProps<TValue, TView>>;
}

export interface PickersLayoutSlotsComponentsProps<TValue, TDate, TView extends DateOrTimeView>
  extends ExportedPickersLayoutSlotsComponentsProps<TValue, TDate, TView> {
  /**
   * Props passed down to the tabs component.
   */
  tabs?: ExportedBaseTabsProps;
  /**
   * Props passed down to the toolbar component.
   */
  toolbar?: ExportedBaseToolbarProps;
}

export interface PickersLayoutProps<TValue, TDate, TView extends DateOrTimeView>
  extends Omit<UsePickerLayoutPropsResponseLayoutProps<TValue, TView>, 'value'> {
  value?: TValue;
  className?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  /**
   * Ref to pass to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
  classes?: Partial<PickersLayoutClasses>;
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: PickersLayoutSlotsComponent<TValue, TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: PickersLayoutSlotsComponentsProps<TValue, TDate, TView>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<PickersLayoutSlotsComponent<TValue, TDate, TView>>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: PickersLayoutSlotsComponentsProps<TValue, TDate, TView>;
}

export interface SubComponents {
  toolbar: React.ReactNode;
  content: React.ReactNode;
  tabs: React.ReactNode;
  actionBar: React.ReactNode;
  shortcuts: React.ReactNode;
}
