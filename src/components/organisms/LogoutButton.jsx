import { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = ({ className, variant = "ghost", size = "sm" }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />
      Logout
    </Button>
  );
};

export default LogoutButton;