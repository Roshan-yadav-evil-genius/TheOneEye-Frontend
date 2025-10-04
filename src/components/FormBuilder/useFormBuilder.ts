"use client";
import { useState, useCallback } from 'react';
import { TWidgetConfig, TWidgetType, generateWidgetId, WIDGET_DEFINITIONS } from './inputs';

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

  const addWidget = useCallback((type: TWidgetType) => {
    const definition = WIDGET_DEFINITIONS.find(def => def.type === type);
    if (!definition) return;

    const newWidget: TWidgetConfig = {
      id: generateWidgetId(),
      type,
      label: definition.label,
      ...definition.defaultConfig,
    };

    setState(prev => {
      const newState = {
        ...prev,
        widgets: [...prev.widgets, newWidget],
        selectedWidget: newWidget.id,
      };
      // Notify parent after state update
      setTimeout(() => notifyParent(newState.widgets), 0);
      return newState;
    });
  }, [notifyParent]);

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
    const widget = state.widgets.find(w => w.id === id);
    if (!widget) return;

    const duplicatedWidget: TWidgetConfig = {
      ...widget,
      id: generateWidgetId(),
      label: `${widget.label} (Copy)`,
    };

    setState(prev => {
      const newState = {
        ...prev,
        widgets: [...prev.widgets, duplicatedWidget],
        selectedWidget: duplicatedWidget.id,
      };
      // Notify parent after state update
      setTimeout(() => notifyParent(newState.widgets), 0);
      return newState;
    });
  }, [state.widgets, notifyParent]);

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
