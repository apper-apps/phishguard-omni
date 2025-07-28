import React, { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { COMPONENT_TYPES } from "./ComponentPalette";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

function EditableComponent({ component, onUpdate, onDelete, isSelected, onSelect }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updates) => {
    onUpdate(component.id, updates);
    setIsEditing(false);
  };

  const renderComponent = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HEADING:
        return (
          <div
            style={{ textAlign: component.props.align, color: component.props.color }}
            className="cursor-pointer hover:bg-blue-50 p-2 rounded"
            onClick={() => onSelect(component.id)}
          >
            {React.createElement(`h${component.props.level}`, {
              className: `font-bold ${component.props.level === 1 ? 'text-3xl' : component.props.level === 2 ? 'text-2xl' : 'text-xl'}`
            }, component.props.text)}
          </div>
        );

      case COMPONENT_TYPES.TEXT:
        return (
          <div
            style={{ textAlign: component.props.align, color: component.props.color }}
            className="cursor-pointer hover:bg-blue-50 p-2 rounded"
            onClick={() => onSelect(component.id)}
          >
            <p className="leading-relaxed">{component.props.text}</p>
          </div>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <div
            style={{ textAlign: component.props.align }}
            className="cursor-pointer hover:bg-blue-50 p-2 rounded"
            onClick={() => onSelect(component.id)}
          >
            <img
              src={component.props.src}
              alt={component.props.alt}
              style={{ width: component.props.width, maxWidth: '100%' }}
              className="rounded"
            />
          </div>
        );

      case COMPONENT_TYPES.BUTTON:
        return (
          <div
            style={{ textAlign: component.props.align }}
            className="cursor-pointer hover:bg-blue-50 p-2 rounded"
            onClick={() => onSelect(component.id)}
          >
            <button
              style={{
                backgroundColor: component.props.backgroundColor,
                color: component.props.textColor
              }}
              className="px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {component.props.text}
            </button>
          </div>
        );

      case COMPONENT_TYPES.LOGO:
        return (
          <div
            style={{ textAlign: component.props.align }}
            className="cursor-pointer hover:bg-blue-50 p-2 rounded"
            onClick={() => onSelect(component.id)}
          >
            <img
              src={component.props.src}
              alt={component.props.alt}
              style={{ width: component.props.width }}
              className="max-w-full"
            />
          </div>
        );

      case COMPONENT_TYPES.DIVIDER:
        return (
          <div
            className="cursor-pointer hover:bg-blue-50 p-2 rounded"
            onClick={() => onSelect(component.id)}
            style={{ margin: component.props.margin }}
          >
            <hr
              style={{
                borderColor: component.props.color,
                borderWidth: `${component.props.thickness}px 0 0 0`
              }}
            />
          </div>
        );

      case COMPONENT_TYPES.SPACER:
        return (
          <div
            className="cursor-pointer hover:bg-blue-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
            onClick={() => onSelect(component.id)}
            style={{ height: component.props.height }}
          >
            <span className="text-gray-400 text-sm">Spacer</span>
          </div>
        );

      case COMPONENT_TYPES.SIGNATURE:
        return (
          <div
            className="cursor-pointer hover:bg-blue-50 p-2 rounded"
            onClick={() => onSelect(component.id)}
          >
            <div className="border-l-4 border-primary pl-4">
              <p className="font-medium text-gray-900">{component.props.name}</p>
              <p className="text-sm text-gray-600">{component.props.title}</p>
              <p className="text-sm text-gray-600">{component.props.company}</p>
              <p className="text-sm text-primary">{component.props.email}</p>
              <p className="text-sm text-gray-600">{component.props.phone}</p>
            </div>
          </div>
        );

      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div className={cn(
      "relative group",
      isSelected && "ring-2 ring-primary ring-offset-2"
    )}>
      {renderComponent()}
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            className="p-1 h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <ApperIcon name="Edit" size={14} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            className="p-1 h-8 w-8"
            onClick={() => onDelete(component.id)}
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}

function TemplateCanvas({ components, onAddComponent, onUpdateComponent, onDeleteComponent }) {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item) => {
      const newComponent = {
        id: Date.now(),
        type: item.type,
        props: { ...item.defaultProps }
      };
      onAddComponent(newComponent);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        "flex-1 min-h-[600px] bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors",
        isOver && "border-primary bg-primary/5"
      )}
    >
      {components.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <ApperIcon name="MousePointer" size={48} className="mb-4" />
          <h3 className="text-lg font-medium mb-2">Drop Components Here</h3>
          <p className="text-center">
            Drag components from the palette to start building your email template
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {components.map((component) => (
            <EditableComponent
              key={component.id}
              component={component}
              onUpdate={onUpdateComponent}
              onDelete={onDeleteComponent}
              isSelected={selectedComponent === component.id}
              onSelect={setSelectedComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplateCanvas;