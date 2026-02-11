/**
 * Element Renderer - Complete
 */

import type { DroppedElement } from '../form-builder.configuration';
import { Checkbox } from './checkbox';
import { DatePicker } from './date-picker';
import { Divider } from './divider';
import { FileUpload } from './file-upload';
import { Heading } from './heading';
import { Matrix } from './matrix';
import { MultiSelect } from './multi-select';
import { PhoneInput } from './phone-input';
import { Radio } from './radio';
import { Rating } from './rating';
import { Section } from './section';
import { Select } from './select';
import { SliderInput } from './slider';
import { TextInput } from './text-input';
import { Textarea } from './textarea';
import { TimePicker } from './time-picker';
import { UrlInput } from './url-input';
import { GridLayoutRenderer } from './renderers/GridLayoutRenderer';

interface ElementRendererProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  onDeleteElement?: (id: string) => void;
  onUpdateElement?: (elementId: string, updates: Partial<DroppedElement>) => void;
  onDropIntoContainer?: (
    containerId: string,
    newElement: DroppedElement,
    columnIndex?: number
  ) => void;
  onSelectElement?: (id: string) => void;
}

export function ElementRenderer({
  element,
  isSelected,
  onClick,
  onDeleteElement,
  onUpdateElement,
  onDropIntoContainer,
  onSelectElement,
}: ElementRendererProps) {
  switch (element.type) {
    // Input Fields
    case 'text-input':
    case 'email-input':
      return <TextInput element={element} isSelected={isSelected} onClick={onClick} />;

    case 'number-input':
      return <TextInput element={element} isSelected={isSelected} onClick={onClick} />;

    case 'select':
      return <Select element={element} isSelected={isSelected} onClick={onClick} />;

    case 'textarea':
      return <Textarea element={element} isSelected={isSelected} onClick={onClick} />;

    case 'checkbox':
      return <Checkbox element={element} isSelected={isSelected} onClick={onClick} />;

    case 'radio':
      return <Radio element={element} isSelected={isSelected} onClick={onClick} />;

    case 'date-picker':
      return <DatePicker element={element} isSelected={isSelected} onClick={onClick} />;

    case 'file-upload':
      return <FileUpload element={element} isSelected={isSelected} onClick={onClick} />;

    case 'phone-input':
      return <PhoneInput element={element} isSelected={isSelected} onClick={onClick} />;

    case 'url-input':
      return <UrlInput element={element} isSelected={isSelected} onClick={onClick} />;

    case 'rating':
      return <Rating element={element} isSelected={isSelected} onClick={onClick} />;

    case 'slider':
      return <SliderInput element={element} isSelected={isSelected} onClick={onClick} />;

    case 'time-picker':
      return <TimePicker element={element} isSelected={isSelected} onClick={onClick} />;

    case 'multi-select':
      return <MultiSelect element={element} isSelected={isSelected} onClick={onClick} />;

    case 'matrix':
      return <Matrix element={element} isSelected={isSelected} onClick={onClick} />;

    // Layout elements
    case 'section':
    case 'card':
      return (
        <Section
          element={element}
          isSelected={isSelected}
          onClick={onClick}
          onDeleteElement={onDeleteElement}
          onUpdateElement={onUpdateElement}
          onDropIntoContainer={onDropIntoContainer}
          onSelectElement={onSelectElement}
        />
      );

    case 'grid-layout':
      return (
        <GridLayoutRenderer
          element={element}
          isSelected={isSelected || false}
          onClick={onClick || (() => { })}
          onDeleteElement={onDeleteElement || (() => { })}
          onUpdateElement={onUpdateElement || (() => { })}
          onDropIntoContainer={onDropIntoContainer || (() => { })}
          onSelectElement={onSelectElement || (() => { })}
        />
      );

    // Decorator elements
    case 'heading':
      return <Heading element={element} isSelected={isSelected} onClick={onClick} />;

    case 'text-block':
      return <Heading element={element} isSelected={isSelected} onClick={onClick} />;

    case 'divider':
      return <Divider element={element} isSelected={isSelected} onClick={onClick} />;

    case 'spacer':
      return <Divider element={element} isSelected={isSelected} onClick={onClick} />;

    default:
      return <TextInput element={element} isSelected={isSelected} onClick={onClick} />;
  }
}
