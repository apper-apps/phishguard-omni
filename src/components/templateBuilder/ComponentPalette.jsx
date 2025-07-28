import { useDrag } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const COMPONENT_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  IMAGE: 'image',
  BUTTON: 'button',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  LOGO: 'logo',
  SIGNATURE: 'signature'
};

const componentLibrary = [
  {
    type: COMPONENT_TYPES.HEADING,
    name: 'Heading',
    icon: 'Heading',
    description: 'Add a heading or title',
    defaultProps: {
      text: 'Your Heading Here',
      level: 1,
      align: 'left',
      color: '#000000'
    }
  },
  {
    type: COMPONENT_TYPES.TEXT,
    name: 'Text Block',
    icon: 'Type',
    description: 'Add a paragraph of text',
    defaultProps: {
      text: 'Your text content goes here. Click to edit.',
      align: 'left',
      color: '#000000'
    }
  },
  {
    type: COMPONENT_TYPES.IMAGE,
    name: 'Image',
    icon: 'Image',
    description: 'Add an image',
    defaultProps: {
      src: 'https://via.placeholder.com/400x200',
      alt: 'Image description',
      width: '100%',
      align: 'center'
    }
  },
  {
    type: COMPONENT_TYPES.BUTTON,
    name: 'Button',
    icon: 'MousePointer',
    description: 'Add a clickable button',
    defaultProps: {
      text: 'Click Here',
      url: '#',
      backgroundColor: '#1E40AF',
      textColor: '#FFFFFF',
      align: 'center'
    }
  },
  {
    type: COMPONENT_TYPES.LOGO,
    name: 'Logo',
    icon: 'Building',
    description: 'Add company logo',
    defaultProps: {
      src: 'https://via.placeholder.com/200x80',
      alt: 'Company Logo',
      width: '200px',
      align: 'left'
    }
  },
  {
    type: COMPONENT_TYPES.DIVIDER,
    name: 'Divider',
    icon: 'Minus',
    description: 'Add a horizontal line',
    defaultProps: {
      color: '#E5E7EB',
      thickness: 1,
      margin: '20px 0'
    }
  },
  {
    type: COMPONENT_TYPES.SPACER,
    name: 'Spacer',
    icon: 'Move',
    description: 'Add vertical spacing',
    defaultProps: {
      height: '20px'
    }
  },
  {
    type: COMPONENT_TYPES.SIGNATURE,
    name: 'Signature',
    icon: 'PenTool',
    description: 'Add email signature',
    defaultProps: {
      name: 'John Doe',
      title: 'Title',
      company: 'Company Name',
      email: 'email@company.com',
      phone: '+1 (555) 123-4567'
    }
  }
];

function DraggableComponent({ component }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { 
      type: component.type,
      defaultProps: component.defaultProps
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "p-3 border-2 border-dashed border-gray-200 rounded-lg cursor-grab hover:border-primary hover:bg-primary/5 transition-all duration-200",
        isDragging && "opacity-50 cursor-grabbing"
      )}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ApperIcon name={component.icon} size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm text-gray-900">{component.name}</h4>
          <p className="text-xs text-gray-500 mt-1">{component.description}</p>
        </div>
      </div>
    </div>
  );
}

function ComponentPalette() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Package" className="mr-2" />
          Components
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {componentLibrary.map((component) => (
          <DraggableComponent key={component.type} component={component} />
        ))}
      </CardContent>
    </Card>
  );
}

export default ComponentPalette;
export { COMPONENT_TYPES };