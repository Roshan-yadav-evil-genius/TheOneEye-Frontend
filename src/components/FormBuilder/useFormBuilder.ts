import { useState, useCallback } from 'react';
import { WidgetConfig, WidgetType, generateWidgetId, WIDGET_DEFINITIONS } from './inputs';

export interface FormBuilderState {
  widgets: WidgetConfig[];
  selectedWidget: string | null;
}

export const useFormBuilder = () => {
  const [state, setState] = useState<FormBuilderState>({
    widgets: [],
    selectedWidget: null,
  });

  const addWidget = useCallback((type: WidgetType) => {
    const definition = WIDGET_DEFINITIONS.find(def => def.type === type);
    if (!definition) return;

    const newWidget: WidgetConfig = {
      id: generateWidgetId(),
      type,
      label: definition.label,
      ...definition.defaultConfig,
    };

    setState(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
      selectedWidget: newWidget.id,
    }));
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<WidgetConfig>) => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === id ? { ...widget, ...updates } : widget
      ),
    }));
  }, []);

  const removeWidget = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.filter(widget => widget.id !== id),
      selectedWidget: prev.selectedWidget === id ? null : prev.selectedWidget,
    }));
  }, []);

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
      return {
        ...prev,
        widgets: newWidgets,
      };
    });
  }, []);

  const duplicateWidget = useCallback((id: string) => {
    const widget = state.widgets.find(w => w.id === id);
    if (!widget) return;

    const duplicatedWidget: WidgetConfig = {
      ...widget,
      id: generateWidgetId(),
      label: `${widget.label} (Copy)`,
    };

    setState(prev => ({
      ...prev,
      widgets: [...prev.widgets, duplicatedWidget],
      selectedWidget: duplicatedWidget.id,
    }));
  }, [state.widgets]);

  return {
    ...state,
    addWidget,
    updateWidget,
    removeWidget,
    selectWidget,
    moveWidget,
    duplicateWidget,
  };
};
