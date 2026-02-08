/**
 * Material 3 Date Picker Component for SolidJS
 */
import { JSX, createSignal, Show, For, mergeProps, splitProps } from 'solid-js';
import { TextField } from '../input';
import { Dialog } from '../dialog';
import { Button } from '../button';
import { IconButton } from '../icon-button';
import { Typography } from '../typography';
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
    /** Custom style */
    style?: JSX.CSSProperties;
}

export const DatePicker: (props: DatePickerProps) => JSX.Element = (props) => {
    const [local, others] = splitProps(props, [
        'value', 'onChange', 'label', 'disabled', 'error', 'helperText', 'style'
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

    return (
        <div class="date-picker-container" style={{ display: 'inline-flex', width: '100%', ...local.style }}>
            <div onClick={handleOpen} style={{ width: '100%' }}>
                <TextField
                    label={local.label || "Select Date"}
                    value={local.value ? format(local.value, 'MMM d, yyyy') : ''}
                    disabled={local.disabled}
                    error={local.error}
                    supportingText={local.helperText}
                    readonly
                    trailingIcon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .09-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                    }
                    style={{ cursor: 'pointer' }}
                />
            </div>

            <Dialog
                open={open()}
                onClose={handleClose}
                closeOnBackdropClick
                style={{
                    'max-width': '360px',
                    'min-width': '320px',
                    'border-radius': '28px',
                    padding: '0'
                }}
            >
                {/* Custom Header Area within Dialog content structure */}
                <div style={{ padding: '24px 24px 12px' }}>
                    <Typography variant="label-medium" color="on-surface-variant">Select Date</Typography>
                    <Typography variant="headline-large" color="on-surface" style={{ 'margin-top': '8px' }}>
                        {tempSelectedDate() ? format(tempSelectedDate(), 'EEE, MMM d') : 'Select date'}
                    </Typography>
                </div>

                <div style={{ padding: '0 12px 12px' }}>
                    {/* Month Navigation */}
                    <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'padding': '0 12px 12px' }}>
                        <div style={{ display: 'flex', 'align-items': 'center', gap: '4px' }}>
                            <Typography variant="title-small" color="on-surface">
                                {format(viewDate(), 'MMMM yyyy')}
                            </Typography>
                            <button onClick={() => setViewDate(new Date())} style={{ border: 'none', background: 'transparent', cursor: 'pointer', 'margin-left': '4px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--m3-color-on-surface-variant)">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </button>
                        </div>
                        <div style={{ display: 'flex' }}>
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

                    {/* Calendar Grid */}
                    <div style={{ display: 'grid', 'grid-template-columns': 'repeat(7, 1fr)', 'text-align': 'center', 'margin-bottom': '8px' }}>
                        <For each={weekDays}>
                            {(day) => (
                                <Typography variant="body-small" color="on-surface-variant" style={{ width: '40px', height: '40px', 'line-height': '40px' }}>
                                    {day}
                                </Typography>
                            )}
                        </For>
                    </div>

                    <div style={{ display: 'grid', 'grid-template-columns': 'repeat(7, 1fr)', 'row-gap': '4px' }}>
                        <For each={getDays()}>
                            {(day) => {
                                const isSelected = tempSelectedDate() && isSameDay(day, tempSelectedDate());
                                const isCurrentMonth = isSameMonth(day, viewDate());
                                const isTodayDate = isToday(day);

                                return (
                                    <div style={{ display: 'flex', 'justify-content': 'center' }}>
                                        <button
                                            onClick={() => handleDayClick(day)}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                'border-radius': '50%',
                                                border: isTodayDate && !isSelected ? '1px solid var(--m3-color-primary)' : 'none',
                                                background: isSelected ? 'var(--m3-color-primary)' : 'transparent',
                                                color: isSelected
                                                    ? 'var(--m3-color-on-primary)'
                                                    : isCurrentMonth
                                                        ? 'var(--m3-color-on-surface)'
                                                        : 'var(--m3-color-on-surface-variant, #999)',
                                                cursor: 'pointer',
                                                'font-size': '14px',
                                                display: 'flex',
                                                'align-items': 'center',
                                                'justify-content': 'center',
                                                opacity: isCurrentMonth ? 1 : 0.38
                                            }}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    </div>
                                )
                            }}
                        </For>
                    </div>
                </div>

                <div style={{ display: 'flex', 'justify-content': 'flex-end', gap: '8px', padding: '16px 24px 24px' }}>
                    <Button variant="text" onClick={handleClose}>Cancel</Button>
                    <Button variant="text" onClick={handleConfirm}>OK</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default DatePicker;
