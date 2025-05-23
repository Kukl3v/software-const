import React, { useContext, useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import ContentBlock from '../components/ContentBlock';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../AuthContext';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { RegistrationSchema } from '../schemas/registrationSchema';
import {
  getUsersRequest,
  createEmployeeRequest,
  updateUserRequest,
  deleteUserRequest
} from '../services/accountService';
import { toast } from 'sonner';

export default function Users({ title }) {
  PageTitle(title);
  const { role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modalType, setModalType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});
  const size = 12;

  const loadUsers = () => {
    getUsersRequest({ page, size })
      .then(data => {
        setUsers(data);
        setTotalPages(Math.ceil(data.length / size));
      })
      .catch(() => toast.error('Не удалось загрузить пользователей'));
  };

  useEffect(loadUsers, [page]);

  const openModal = (type, user = null) => {
    setModalType(type);
    setErrors({});
    if ((type === 'edit' || type === 'delete') && user) {
      setCurrentUser(user);
      setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: '', passwordConfirm: '' });
    } else {
      setCurrentUser(null);
      setFormData({ firstName: '', lastName: '', email: '', password: '', passwordConfirm: '' });
    }
  };

  const closeModal = () => setModalType(null);

  const handleSave = async () => {
    try {
      RegistrationSchema.parse(formData);
      if (modalType === 'create') {
        await createEmployeeRequest(formData);
        toast.success('Работник создан');
      }
      if (modalType === 'edit') {
        await updateUserRequest(currentUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
        toast.success('Пользователь обновлён');
      }
      if (modalType === 'delete') {
        await deleteUserRequest(currentUser.id);
        toast.success('Пользователь удалён');
      }
      closeModal();
      loadUsers();
    } catch (err) {
      if (err.errors) {
        const frmErr = {};
        err.errors.forEach(e => frmErr[e.path[0]] = e.message);
        setErrors(frmErr);
      } else {
        toast.error('Ошибка операции');
      }
    }
  };

  return (
    <ContentBlock
      valueBlock={(
        <>
            <div className="flex w-full gap-2 mb-5">
              <button
                className="flex-1 py-3 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 cursor-pointer"
                onClick={() => openModal('create')}
              ><FaPlus /> Добавить работника</button>
            </div>

          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Имя</th>
                      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Фамилия</th>
                      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Роль</th>
                      <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{u.firstName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{u.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{u.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          {u.role === 'EMPLOYEE' && (
                            <>
                              <button onClick={() => openModal('edit', u)} className="inline-flex items-center gap-x-2 text-gray-600 hover:text-gray-800 mr-2 cursor-pointer"><FaEdit/></button>
                              <button onClick={() => openModal('delete', u)} className="inline-flex items-center gap-x-2 text-gray-600 hover:text-gray-800 cursor-pointer"><FaTrash/></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>

          <Modal open={modalType !== null} onClose={closeModal}>
            <div className="text-center mb-4">
              {modalType === 'create' && <FaPlus size={32} className="mx-auto text-green-500" />}
              {modalType === 'edit' && <FaEdit size={32} className="mx-auto text-yellow-500" />}
              {modalType === 'delete' && <FaTrash size={32} className="mx-auto text-red-500" />}
              <h3 className="mt-2 text-lg font-bold text-gray-800">
                {modalType === 'create' && 'Добавить работника'}
                {modalType === 'edit' && 'Редактировать пользователя'}
                {modalType === 'delete' && 'Удалить пользователя?'}
              </h3>
            </div>
            {(modalType === 'create' || modalType === 'edit') ? (
              ['firstName','lastName','email','password','passwordConfirm'].map(field => (
                <div key={field} className="mb-4 text-left">
                  <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                  <input
                    type={field.includes('password') ? 'password' : 'text'}
                    value={formData[field]}
                    onChange={e => { setFormData(f => ({...f,[field]: e.target.value})); setErrors(prev=>({...prev,[field]:undefined})); }}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg"
                  />
                  {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                </div>
              ))
            ) : (
              <p>Вы уверены?</p>
            )}
            <div className="flex gap-2 mt-6">
              <button onClick={closeModal} className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Отмена</button>
              <button onClick={handleSave} className="flex-1 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700">
                {modalType === 'delete' ? 'Удалить' : 'Сохранить'}
              </button>
            </div>
          </Modal>
        </>
      )}
    />
  );
}