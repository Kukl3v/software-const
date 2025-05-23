import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ClubCard({ id, address, city, onEdit, onDelete }) {
  const { role } = useContext(AuthContext);

  return (
    <div className="relative flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4 md:p-5">
      <h3 className="text-lg font-bold text-gray-800 text-center">{address}</h3>
      <p className="mt-1 text-xs font-medium uppercase text-gray-500 text-center">{city}</p>

      {role === 'ADMIN' && (
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button onClick={onEdit} className="cursor-pointer" aria-label="Редактировать">
            <FaEdit size={14} className="text-gray-600 hover:text-gray-800" />
          </button>
          <button onClick={onDelete} className="cursor-pointer" aria-label="Удалить">
            <FaTrash size={14} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
      )}
    </div>
  );
}
