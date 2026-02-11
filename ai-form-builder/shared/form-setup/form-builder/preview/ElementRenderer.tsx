/**
 * Element Renderer
 * Dispatcher that renders the appropriate component for each element type
 */

'use client';

import type { DroppedElement } from '../form-builder.configuration';
import { CardRenderer } from './renderers/CardRenderer';
import { CheckboxRenderer } from './renderers/CheckboxRenderer';
import { DatePickerRenderer } from './renderers/DatePickerRenderer';
import { DividerRenderer } from './renderers/DividerRenderer';
import { FileUploadRenderer } from './renderers/FileUploadRenderer';
import { HeadingRenderer } from './renderers/HeadingRenderer';
import { MatrixRenderer } from './renderers/MatrixRenderer';
import { MultiSelectRenderer } from './renderers/MultiSelectRenderer';
import { NumberInputRenderer } from './renderers/NumberInputRenderer';
import { PhoneInputRenderer } from './renderers/PhoneInputRenderer';
import { RadioRenderer } from './renderers/RadioRenderer';
import { RatingRenderer } from './renderers/RatingRenderer';
import { SectionRenderer } from './renderers/SectionRenderer';
import { SelectRenderer } from './renderers/SelectRenderer';
import { SliderRenderer } from './renderers/SliderRenderer';
import { SpacerRenderer } from './renderers/SpacerRenderer';
import { TextBlockRenderer } from './renderers/TextBlockRenderer';
import { TextInputRenderer } from './renderers/TextInputRenderer';
import { TextareaRenderer } from './renderers/TextareaRenderer';
import { TimePickerRenderer } from './renderers/TimePickerRenderer';
import { UrlInputRenderer } from './renderers/UrlInputRenderer';
import { GridLayoutRenderer } from './renderers/GridLayoutRenderer';

interface ElementRendererProps {
  element: DroppedElement;
}

export function ElementRenderer({ element }: ElementRendererProps) {
  switch (element.type) {
    // Input Fields
    case 'text-input':
    case 'email-input':
      return <TextInputRenderer element={element} />;

    case 'number-input':
      return <NumberInputRenderer element={element} />;

    case 'textarea':
      return <TextareaRenderer element={element} />;

    case 'select':
      return <SelectRenderer element={element} />;

    case 'checkbox':
      return <CheckboxRenderer element={element} />;

    case 'radio':
      return <RadioRenderer element={element} />;

    case 'date-picker':
      return <DatePickerRenderer element={element} />;

    case 'file-upload':
      return <FileUploadRenderer element={element} />;

    case 'phone-input':
      return <PhoneInputRenderer element={element} />;

    case 'url-input':
      return <UrlInputRenderer element={element} />;

    case 'rating':
      return <RatingRenderer element={element} />;

    case 'slider':
      return <SliderRenderer element={element} />;

    case 'time-picker':
      return <TimePickerRenderer element={element} />;

    case 'multi-select':
      return <MultiSelectRenderer element={element} />;

    case 'matrix':
      return <MatrixRenderer element={element} />;

    // Decorators
    case 'heading':
      return <HeadingRenderer element={element} />;

    case 'text-block':
      return <TextBlockRenderer element={element} />;

    case 'divider':
      return <DividerRenderer />;

    case 'spacer':
      return <SpacerRenderer element={element} />;

    // Layout
    case 'section':
      return <SectionRenderer element={element} />;

    case 'card':
      return <CardRenderer element={element} />;

    case 'grid-layout':
      return <GridLayoutRenderer element={element} />;

    default:
      return null;
  }
}
