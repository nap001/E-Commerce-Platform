import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import ItemForm from './ItemForm';

const SellItem = () => {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const { data } = await api.post('/items', payload);
    navigate(`/items/${data._id}`);
  };

  return <ItemForm title="Sell an Item" submitLabel="List item" onSubmit={handleCreate} />;
};

export default SellItem;
