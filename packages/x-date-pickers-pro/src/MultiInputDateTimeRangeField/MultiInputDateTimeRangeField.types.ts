import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  UseDateTimeRangeFieldDefaultizedProps,
  UseDateTimeRangeFieldProps,
} from '../internal/models/dateTimeRange';
import { RangePosition } from '../internal/models/range';

export interface UseMultiInputDateTimeRangeFieldParams<TDate, TChildProps extends {}> {
  sharedProps: Omit<TChildProps, keyof UseMultiInputDateTimeRangeFieldProps<TDate>> &
    UseMultiInputDateTimeRangeFieldProps<TDate>;
  startTextFieldProps: TChildProps;
  endTextFieldProps: TChildProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  endInputRef?: React.Ref<HTMLInputElement>;
}

export interface UseMultiInputDateTimeRangeFieldProps<TDate>
  extends UseDateTimeRangeFieldProps<TDate> {}

export type UseMultiInputDateTimeRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseMultiInputDateTimeRangeFieldProps<TDate>
> &
  UseMultiInputDateTimeRangeFieldProps<TDate>;

export interface MultiInputDateTimeRangeFieldProps<TDate>
  extends UseMultiInputDateTimeRangeFieldComponentProps<TDate, Omit<StackProps, 'position'>> {
  /**
   * Overrideable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MultiInputDateTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MultiInputDateTimeRangeFieldSlotsComponentsProps<TDate>;
  /**
   * Overrideable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MultiInputDateTimeRangeFieldSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateTimeRangeFieldSlotsComponentsProps<TDate>;
}

export type MultiInputDateTimeRangeFieldOwnerState<TDate> =
  MultiInputDateTimeRangeFieldProps<TDate>;

export interface MultiInputDateTimeRangeFieldSlotsComponent {
  /**
   * Element rendered at the root.
   * @default MultiInputDateTimeRangeFieldRoot
   */
  Root?: React.ElementType;
  /**
   * Form control with an input to render a date and time.
   * It is rendered twice: once for the start date time and once for the end date time.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateTimeRangeFieldSeparator
   */
  Separator?: React.ElementType;
}

export interface MultiInputDateTimeRangeFieldSlotsComponentsProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputDateTimeRangeFieldOwnerState<TDate>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateTimeRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateTimeRangeFieldOwnerState<TDate>
  >;
}

export type UseMultiInputDateTimeRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseDateTimeRangeFieldDefaultizedProps<TDate> & AdditionalProps;
