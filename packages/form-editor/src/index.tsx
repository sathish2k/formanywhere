// @formanywhere/form-editor - Form builder editor
export { FormEditor, useFormEditor } from './components/FormEditor';
export type { FormEditorProps } from './components/FormEditor';
export { Canvas } from './components/canvas/Canvas';
export { Toolbar } from './components/toolbar/Toolbar';
export { PropertiesPanel } from './components/panels/PropertiesPanel';
export { FormEditorLayout } from './components/layout/FormEditorLayout';
export { AIFormBuilder } from './components/ai/AIFormBuilder';
export type { AIFormBuilderProps } from './components/ai/AIFormBuilder';
export { ImportForm } from './components/import/ImportForm';
export type { ImportFormProps } from './components/import/ImportForm';
export { validateSchema, serializeSchema, serializeSchemaCompact, parseSchema, cloneSchema, mergeSchema, findElementById, countElements } from './engine/schema';
export type { SchemaValidation } from './engine/schema';

// ── Migrated from shared/form-builder ──
export { FormBuilderPage } from './components/FormBuilderPage';
export type { FormBuilderPageProps, BuilderMode } from './components/FormBuilderPage';
export { FormBuilderWrapper } from './components/FormBuilderWrapper';
export { BuilderHeader } from './components/header';
export type { BuilderHeaderProps } from './components/header';
export { PageToolbar } from './components/page-toolbar';
export type { PageToolbarProps, PageTab } from './components/page-toolbar';
export { GridLayoutPicker } from './components/grid-layout-picker';
export type { GridLayoutPickerProps } from './components/grid-layout-picker';
export { LogicDialog, WorkflowDialog, SchemaDialog, IntegrationsDialog } from './components/dialogs';
export type { LogicDialogProps, WorkflowDialogProps, SchemaDialogProps, IntegrationsDialogProps } from './components/dialogs';

// SCSS
import './components/form-builder.scss';
import './components/grid-layout-picker/grid-layout-picker.scss';
