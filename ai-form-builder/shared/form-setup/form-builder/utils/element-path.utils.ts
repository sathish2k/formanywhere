/**
 * Element Path Utilities
 * Utilities for working with nested element structures - Updated for grid-layout support
 */

import type { DroppedElement } from '../form-builder.configuration';

/**
 * Find an element by its ID in a nested structure
 */
export function findElementById(
  elements: DroppedElement[],
  elementId: string
): DroppedElement | null {
  for (const element of elements) {
    if (element.id === elementId) {
      return element;
    }

    // Check in children (for section, card)
    if (element.children && element.children.length > 0) {
      const found = findElementById(element.children, elementId);
      if (found) return found;
    }

    // Check in grid items (for grid-layout)
    if (element.gridItems && element.gridItems.length > 0) {
      for (const gridItem of element.gridItems) {
        const found = findElementById(gridItem.children, elementId);
        if (found) return found;
      }
    }
  }

  return null;
}

/**
 * Update an element by its ID in a nested structure
 */
export function updateElementById(
  elements: DroppedElement[],
  elementId: string,
  updates: Partial<DroppedElement>
): DroppedElement[] {
  return elements.map((element) => {
    if (element.id === elementId) {
      return { ...element, ...updates };
    }

    // Update in children
    if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: updateElementById(element.children, elementId, updates),
      };
    }

    // Update in grid items
    if (element.gridItems) {
      return {
        ...element,
        gridItems: element.gridItems.map((gridItem) => ({
          ...gridItem,
          children: updateElementById(gridItem.children, elementId, updates),
        })),
      };
    }

    return element;
  });
}

/**
 * Delete an element by its ID from a nested structure
 */
export function deleteElementById(elements: DroppedElement[], elementId: string): DroppedElement[] {
  return elements
    .filter((element) => element.id !== elementId)
    .map((element) => {
      // Delete from children
      if (element.children && element.children.length > 0) {
        return {
          ...element,
          children: deleteElementById(element.children, elementId),
        };
      }

      // Delete from grid items
      if (element.gridItems) {
        return {
          ...element,
          gridItems: element.gridItems.map((gridItem) => ({
            ...gridItem,
            children: deleteElementById(gridItem.children, elementId),
          })),
        };
      }

      return element;
    });
}

/**
 * Insert an element into a container at a specific index
 */
export function insertElementIntoContainer(
  elements: DroppedElement[],
  containerId: string,
  newElement: DroppedElement,
  columnIndex?: number, // For grid items
  insertIndex?: number
): DroppedElement[] {
  return elements.map((element) => {
    if (element.id === containerId) {
      // Insert into section/card children
      if (element.type === 'section' || element.type === 'card') {
        const children = element.children || [];
        const index = insertIndex ?? children.length;
        return {
          ...element,
          children: [...children.slice(0, index), newElement, ...children.slice(index)],
        };
      }

      // Insert into grid layout items
      if (element.type === 'grid-layout' && typeof columnIndex === 'number') {
        const gridItems = element.gridItems || [];
        if (columnIndex < gridItems.length) {
          const newGridItems = [...gridItems];
          const gridItem = newGridItems[columnIndex];
          const children = gridItem.children || [];
          const index = insertIndex ?? children.length;
          newGridItems[columnIndex] = {
            ...gridItem,
            children: [...children.slice(0, index), newElement, ...children.slice(index)],
          };
          return {
            ...element,
            gridItems: newGridItems,
          };
        }
      }
    }

    // Recursively check nested containers
    if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: insertElementIntoContainer(
          element.children,
          containerId,
          newElement,
          columnIndex,
          insertIndex
        ),
      };
    }

    // Recursively check grid items
    if (element.gridItems) {
      return {
        ...element,
        gridItems: element.gridItems.map((gridItem) => ({
          ...gridItem,
          children: insertElementIntoContainer(
            gridItem.children,
            containerId,
            newElement,
            columnIndex,
            insertIndex
          ),
        })),
      };
    }

    return element;
  });
}

/**
 * Reorder elements within a container or at the root level
 */
export function reorderElements(
  elements: DroppedElement[],
  sourceIndex: number,
  targetIndex: number,
  containerId?: string,
  columnIndex?: number
): DroppedElement[] {
  // Reorder at root level
  if (!containerId) {
    const result = [...elements];
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(targetIndex, 0, removed);
    return result;
  }

  // Reorder within a container
  return elements.map((element) => {
    if (element.id === containerId) {
      // Reorder in section/card children
      if (element.type === 'section' || element.type === 'card') {
        const children = [...(element.children || [])];
        const [removed] = children.splice(sourceIndex, 1);
        children.splice(targetIndex, 0, removed);
        return { ...element, children };
      }
    }

    // Recursively check nested containers
    if (element.children && element.children.length > 0) {
      return {
        ...element,
        children: reorderElements(
          element.children,
          sourceIndex,
          targetIndex,
          containerId,
          columnIndex
        ),
      };
    }

    // Recursively check grid items
    if (element.gridItems) {
      return {
        ...element,
        gridItems: element.gridItems.map((gridItem) => ({
          ...gridItem,
          children: reorderElements(
            gridItem.children,
            sourceIndex,
            targetIndex,
            containerId,
            columnIndex
          ),
        })),
      };
    }

    return element;
  });
}
