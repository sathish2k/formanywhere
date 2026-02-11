/**
 * Material 3 Date Picker Component for SolidJS
 * Based on M3 date picker spec
 *
 * Implements the M3 spec with:
 * - TextField trigger with calendar icon
 * - Modal dialog with month/year navigation
 * - Calendar grid with day selection
 * - Today indicator, selected state
 * - Liquid Glass enhanced dialog
 * - CSS class-based styling with M3 design tokens
 */
import { JSX, createSignal, Show, For, splitProps } from 'solid-js';
import { TextField } from '../input';
import { Dialog } from '../dialog';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { Typography } from '../typography';
import './styles.scss';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isToday,
    startOfWeek,
    endOfWeek,
    isSameMonth
} from 'date-fns';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
    /** Current value (Date object) */
    value?: Date;
    /** Change handler */
    onChange?: (date: Date) => void;
    /** Label for the input */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Error state */
    error?: boolean;
    /** Helper text */
    helperText?: string;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const DatePicker: (props: DatePickerProps) => JSX.Element = (props) => {
    const [local, others] = splitProps(props, [
        'value', 'onChange', 'label', 'disabled', 'error', 'helperText', 'variant', 'style', 'class'
    ]);

    const [open, setOpen] = createSignal(false);
    const [viewDate, setViewDate] = createSignal(props.value || new Date());
    const [tempSelectedDate, setTempSelectedDate] = createSignal(props.value || new Date());

    const handleOpen = () => {
        if (local.disabled) return;
        setTempSelectedDate(props.value || new Date());
        setViewDate(props.value || new Date());
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        if (tempSelectedDate()) {
            local.onChange?.(tempSelectedDate());
        }
        setOpen(false);
    };

    const handlePrevMonth = () => setViewDate(d => subMonths(d, 1));
    const handleNextMonth = () => setViewDate(d => addMonths(d, 1));
    const handleDayClick = (day: Date) => setTempSelectedDate(day);

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getDays = () => {
        const start = startOfWeek(startOfMonth(viewDate()));
        const end = endOfWeek(endOfMonth(viewDate()));
        return eachDayOfInterval({ start, end });
    };

    const getDayClass = (day: Date) => {
        const classes = ['md-date-picker__day'];
        const isSelected = tempSelectedDate() && isSameDay(day, tempSelectedDate());
        const isCurrentMonth = isSameMonth(day, viewDate());
        const isTodayDate = isToday(day);

        if (isSelected) classes.push('selected');
        if (!isCurrentMonth) classes.push('other-month');
        if (isTodayDate && !isSelected) classes.push('today');

        return classes.join(' ');
    };

    const rootClass = () => {
        const classes = ['md-date-picker'];
        if (local.variant === 'glass') classes.push('glass');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={local.style}>
            <div class="md-date-picker__trigger" onClick={handleOpen}>
                <TextField
                    label={local.label || "Select Date"}
                    value={local.value ? format(local.value, 'MMM d, yyyy') : ''}
                    disabled={local.disabled}
                    error={local.error}
                    supportingText={local.helperText}
                    readOnly
                    trailingIcon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .09-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                    }
                />
            </div>

            <Dialog
                open={open()}
                onClose={handleClose}
                closeOnBackdropClick
                class="md-date-picker__dialog"
            >
                {/* Header */}
                <div class="md-date-picker__header">
                    <Typography variant="label-medium" color="on-surface-variant">Select Date</Typography>
                    <div class="md-date-picker__header-date">
                        <Typography variant="headline-large" color="on-surface">
                            {tempSelectedDate() ? format(tempSelectedDate(), 'EEE, MMM d') : 'Select date'}
                        </Typography>
                    </div>
                </div>

                <div class="md-date-picker__body">
                    {/* Month Navigation */}
                    <div class="md-date-picker__month-nav">
                        <div class="md-date-picker__month-label">
                            <Typography variant="title-small" color="on-surface">
                                {format(viewDate(), 'MMMM yyyy')}
                            </Typography>
                            <button class="md-date-picker__today-btn" onClick={() => setViewDate(new Date())}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--m3-color-on-surface-variant)">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </button>
                        </div>
                        <div class="md-date-picker__month-controls">
                            <IconButton
                                onClick={handlePrevMonth}
                                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>}
                            />
                            <IconButton
                                onClick={handleNextMonth}
                                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>}
                            />
                        </div>
                    </div>

                    {/* Weekday Header */}
                    <div class="md-date-picker__weekdays">
                        <For each={weekDays}>
                            {(day) => (
                                <span class="md-date-picker__weekday">{day}</span>
                            )}
                        </For>
                    </div>

                    {/* Day Grid */}
                    <div class="md-date-picker__days">
                        <For each={getDays()}>
                            {(day) => (
                                <div class="md-date-picker__day-cell">
                                    <button
                                        class={getDayClass(day)}
                                        onClick={() => handleDayClick(day)}
                                    >
                                        {format(day, 'd')}
                                    </button>
                                </div>
                            )}
                        </For>
                    </div>
                </div>

                <div class="md-date-picker__actions">
                    <Button variant="text" onClick={handleClose}>Cancel</Button>
                    <Button variant="text" onClick={handleConfirm}>OK</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default DatePicker;
