import { useState } from "react";

interface UseDescriptionEditingProps {
  initialDescription?: string;
  onSave?: (description: string) => void;
}

export function useDescriptionEditing({ 
  initialDescription = "", 
  onSave 
}: UseDescriptionEditingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userDescription, setUserDescription] = useState(initialDescription);

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
    onSave?.(userDescription);
  };

  const cancelEditing = () => {
    setUserDescription(initialDescription);
    setIsEditing(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDescription(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      stopEditing();
    }
    if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return {
    isEditing,
    userDescription,
    startEditing,
    stopEditing,
    cancelEditing,
    handleDescriptionChange,
    handleKeyDown
  };
}
