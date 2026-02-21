// Elements sub-module public API
export type { PropertyField, ElementDefinition } from './types';
export {
    getElement, getAllElements, getElementsByCategory, registerElement,
    LAYOUT_ELEMENT_TYPES, FIELD_ELEMENT_TYPES,
    isLayoutElement, ELEMENT_INPUT_TYPE_MAP,
} from './registry';
export type { LayoutElementType, FieldElementType } from './registry';

// Shared field component types
export type { FieldProps, LayoutFieldProps, FieldMode } from './field-types';

// Shared field UI components (SolidJS — work in both editor and runtime)
export { TextInputField } from './text-input/text-input';
export { TextareaField } from './textarea/textarea';
export { SelectField } from './select/select';
export { CheckboxField } from './checkbox/checkbox';
export { RadioField } from './radio/radio';
export { SwitchField } from './switch/switch';
export { FileField } from './file/file';
export { RatingField } from './rating/rating';
export { SignatureField } from './signature/signature';
export { LayoutField } from './layout/layout';
export { DateField } from './date/date';
export { TimeField } from './time/time';

// Individual element definitions (for direct import)
export { containerElement, gridElement, sectionElement, cardElement, gridColumnElement, dividerElement, spacerElement, headingElement, logoElement, textBlockElement } from './layout/layout.properties';
export { textElement, emailElement, phoneElement, numberElement, urlElement } from './text-input/text-input.properties';
export { textareaElement } from './textarea/textarea.properties';
export { selectElement } from './select/select.properties';
export { checkboxElement } from './checkbox/checkbox.properties';
export { radioElement } from './radio/radio.properties';
export { switchElement } from './switch/switch.properties';
export { dateElement } from './date/date.properties';
export { timeElement } from './time/time.properties';
export { fileElement } from './file/file.properties';
export { ratingElement } from './rating/rating.properties';
export { signatureElement } from './signature/signature.properties';
