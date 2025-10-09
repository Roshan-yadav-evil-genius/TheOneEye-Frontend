"use client";
import { useState, useCallback } from 'react';
import { TWidgetConfig, TWidgetType } from '@/types/forms';
import { generateWidgetId, WIDGET_DEFINITIONS } from './inputs';

export interface FormBuilderState {
  widgets: TWidgetConfig[];
  selectedWidget: string | null;
  isJsonMode: boolean;
}

export const useFormBuilder = (initialWidgets: TWidgetConfig[] = [], onFormChange?: (widgets: TWidgetConfig[]) => void) => {
  const [state, setState] = useState<FormBuilderState>({
    widgets: initialWidgets,
    selectedWidget: null,
    isJsonMode: false,
  });

  // Helper function to notify parent of changes
  const notifyParent = useCallback((widgets: TWidgetConfig[]) => {
    if (onFormChange) {
      onFormChange(widgets);
    }
  }, [onFormChange]);

  const generateDefaultName = useCallback((type: TWidgetType, existingNames: string[]) => {
    let index = 1;
    let name = `${type}_${index}`;
    while (existingNames.includes(name)) {
      index++;
      name = `${type}_${index}`;
    }
    return name;
  }, []);

  const addWidget = useCallback((type: TWidgetType) => {
    const definition = WIDGET_DEFINITIONS.find(def => def.type === type);
    if (!definition) return;

    setState(prev => {
      // Get existing names for uniqueness check
      const existingNames = prev.widgets.map(w => w.name).filter(Boolean);
      const defaultName = generateDefaultName(type, existingNames);

      const newWidget: TWidgetConfig = {
        id: generateWidgetId(),
        type,
        name: defaultName,
        label: definition.label,
        ...definition.defaultConfig,
      };

      const newState = {
        ...prev,
        widgets: [...prev.widgets, newWidget],
        selectedWidget: newWidget.id,
      };
      // Notify parent after state update
      setTimeout(() => notifyParent(newState.widgets), 0);
      return newState;
    });
  }, [notifyParent, generateDefaultName]);

  const updateWidget = useCallback((id: string, updates: Partial<TWidgetConfig>) => {
    setState(prev => {
      const newState = {
        ...prev,
        widgets: prev.widgets.map(widget =>
          widget.id === id ? { ...widget, ...updates } : widget
        ),
      };
      // Notify parent after state update
      setTimeout(() => notifyParent(newState.widgets), 0);
      return newState;
    });
  }, [notifyParent]);

  const removeWidget = useCallback((id: string) => {
    setState(prev => {
      const newState = {
        ...prev,
        widgets: prev.widgets.filter(widget => widget.id !== id),
        selectedWidget: prev.selectedWidget === id ? null : prev.selectedWidget,
      };
      // Notify parent after state update
      setTimeout(() => notifyParent(newState.widgets), 0);
      return newState;
    });
  }, [notifyParent]);

  const selectWidget = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedWidget: id,
    }));
  }, []);

  const moveWidget = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      const newWidgets = [...prev.widgets];
      const [movedWidget] = newWidgets.splice(fromIndex, 1);
      newWidgets.splice(toIndex, 0, movedWidget);
      const newState = {
        ...prev,
        widgets: newWidgets,
      };
      // Notify parent after state update
      setTimeout(() => notifyParent(newState.widgets), 0);
      return newState;
    });
  }, [notifyParent]);

  const duplicateWidget = useCallback((id: string) => {
    setState(prev => {
      const widget = prev.widgets.find(w => w.id === id);
      if (!widget) return prev;

      // Get existing names for uniqueness check
      const existingNames = prev.widgets.map(w => w.name).filter(Boolean);
      const defaultName = generateDefaultName(widget.type, existingNames);

      const duplicatedWidget: TWidgetConfig = {
        ...widget,
        id: generateWidgetId(),
        name: defaultName,
        label: `${widget.label} (Copy)`,
      };

      const newState = {
        ...prev,
        widgets: [...prev.widgets, duplicatedWidget],
        selectedWidget: duplicatedWidget.id,
      };
      // Notify parent after state update
      setTimeout(() => notifyParent(newState.widgets), 0);
      return newState;
    });
  }, [notifyParent, generateDefaultName]);

  const toggleJsonMode = useCallback((isJsonMode: boolean) => {
    setState(prev => ({
      ...prev,
      isJsonMode,
      selectedWidget: isJsonMode ? null : prev.selectedWidget, // Clear selection in JSON mode
    }));
  }, []);

  const updateWidgetsFromJson = useCallback((newWidgets: TWidgetConfig[]) => {
    setState(prev => ({
      ...prev,
      widgets: newWidgets,
      selectedWidget: null,
    }));
    // Notify parent after state update
    setTimeout(() => notifyParent(newWidgets), 0);
  }, [notifyParent]);

  return {
    ...state,
    addWidget,
    updateWidget,
    removeWidget,
    selectWidget,
    moveWidget,
    duplicateWidget,
    toggleJsonMode,
    updateWidgetsFromJson,
  };
};
