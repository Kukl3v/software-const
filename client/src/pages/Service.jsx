import React, { useContext, useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import ContentBlock from '../components/ContentBlock';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../AuthContext';
import { ServiceSchema } from '../schemas/serviceSchema';
import {
  getServicesRequest,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest
} from '../services/serviceService';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { toast } from 'sonner';

export default function Service({ title }) {
  PageTitle(title);
  const { role } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const size = 12;

  const loadServices = async () => {
    try {
      const data = await getServicesRequest({ page, size });
      setServices(data);
      setTotalPages(Math.ceil(data.length / size));
    } catch {
      toast.error('Не удалось загрузить услуги');
    }
  };

  useEffect(() => { 
    // загрузка списка услуг
    loadServices();
  }, [page]);

  const openModal = async (type, svc = null) => {
    setModalType(type);
    setErrors({});
    if ((type === 'edit' || type === 'delete') && svc) {
      try {
        const full = await getServiceRequest(svc.id);
        setCurrent(full);
        setFormData({ name: full.name, description: full.description });
      } catch {
        toast.error('Не удалось загрузить данные услуги');
        return;
      }
    } else {
      setCurrent(null);
      setFormData({ name: '', description: '' });
    }
  };

  const closeModal = () => setModalType(null);

  const handleSave = async () => {
    const result = ServiceSchema.safeParse(formData);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map(i => [i.path[0], i.message])));
      return;
    }
    try {
      if (modalType === 'create') {
        await createServiceRequest(formData);
        toast.success('Услуга создана');
      }
      if (modalType === 'edit') {
        await updateServiceRequest(current.id, formData);
        toast.success('Услуга обновлена');
      }
      if (modalType === 'delete') {
        await deleteServiceRequest(current.id);
        toast.success('Услуга удалена');
      }
      closeModal();
      loadServices();
    } catch {
      toast.error('Ошибка операции');
    }
  };

  return (
    <ContentBlock
      valueBlock={(
        <>
          {role === 'ADMIN' && (
            <div className="flex w-full gap-2 mb-5">
              <button
                className="flex-1 py-3 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 cursor-pointer"
                onClick={() => openModal('create')}
              >
                <FaPlus /> Добавить услугу
              </button>
            </div>
          )}

          <Modal open={modalType !== null} onClose={closeModal}>
            <div className="text-center mb-4">
              {modalType === 'create' && <FaPlus size={32} className="mx-auto text-green-500" />}
              {modalType === 'edit' && <FaEdit size={32} className="mx-auto text-yellow-500" />}
              {modalType === 'delete' && <FaTrash size={32} className="mx-auto text-red-500" />}
              <h3 className="mt-2 text-lg font-bold text-gray-800">
                {modalType === 'create' && 'Создать услугу'}
                {modalType === 'edit' && 'Редактировать услугу'}
                {modalType === 'delete' && 'Удалить услугу?'}
              </h3>
            </div>
            {modalType !== 'delete' ? (
              <>
                <label className="block text-sm font-medium mb-2">Название</label>
                <input
                  value={formData.name}
                  onChange={e => { setFormData(f => ({ ...f, name: e.target.value })); setErrors(prev => ({ ...prev, name: undefined })); }}
                  className="w-full py-2 px-4 border border-gray-200 rounded-lg mb-1"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                <label className="block text-sm font-medium mb-2 mt-4">Описание</label>
                <input
                  value={formData.description}
                  onChange={e => { setFormData(f => ({ ...f, description: e.target.value })); setErrors(prev => ({ ...prev, description: undefined })); }}
                  className="w-full py-2 px-4 border border-gray-200 rounded-lg mb-1"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </>
            ) : (
              <p>Вы уверены, что хотите удалить эту услугу?</p>
            )}
            <div className="flex gap-2 mt-6">
              <button onClick={closeModal} className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Отмена</button>
              <button onClick={handleSave} className="flex-1 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700">
                {modalType === 'delete' ? 'Удалить' : 'Сохранить'}
              </button>
            </div>
          </Modal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {services.map(svc => (
              <div key={svc.id} className="relative flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow">
                <h3 className="text-lg font-bold text-gray-800">{svc.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{svc.description}</p>
                {role === 'ADMIN' && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openModal('edit', svc)} className="cursor-pointer text-gray-600 hover:text-gray-800"><FaEdit /></button>
                    <button onClick={() => openModal('delete', svc)} className="cursor-pointer text-gray-600 hover:text-gray-800"><FaTrash /></button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    />
  );
}