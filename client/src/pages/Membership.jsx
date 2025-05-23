import React, { useContext, useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import ContentBlock from '../components/ContentBlock';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../AuthContext';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { getUserByEmailRequest } from '../services/accountService';
import { MembershipSchema } from '../schemas/membershipSchema';
import {
  getMembershipsRequest,
  createMembershipRequest,
  updateMembershipRequest,
  deleteMembershipRequest,
  getUserMembershipsRequest,
  cancelUserMembershipRequest,
  subscribeUserToMembershipRequest,
  getServicesByMembershipRequest,
  getServicesRequest,
  addServicesToMembershipRequest
} from '../services/membershipService';
import { toast } from 'sonner';

export default function Membership({ title }) {
  PageTitle(title);
  const { role, user: email } = useContext(AuthContext);

  const [memberships, setMemberships] = useState([]);
  const [userMemberships, setUserMemberships] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modalType, setModalType] = useState(null);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', durationDays: '' });
  const [errors, setErrors] = useState({});

  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [userId, setUserId] = useState(null);
  const [subscribeDate, setSubscribeDate] = useState('');
  const size = 8;

  useEffect(() => {
    if (!email) return;
    getUserByEmailRequest(email)
      .then(u => setUserId(u.id))
      .catch(() => toast.error('Не удалось получить данные пользователя'));
  }, [email]);

  useEffect(() => {
    if (!userId) return;
    getUserMembershipsRequest(userId)
      .then(data => setUserMemberships(data))
      .catch(() => toast.error('Не удалось загрузить ваши абонементы'));
  }, [userId]);

  useEffect(() => {
    getMembershipsRequest({ page, size })
      .then(data => {
        setMemberships(data);
        setTotalPages(Math.ceil(data.length / size));
      })
      .catch(() => toast.error('Ошибка загрузки списка'));
  }, [page]);

  const openModal = async (type, item = null) => {
    setModalType(type);
    setErrors({});
    if (item) {
      setCurrent(item);
      if (type === 'edit' || type === 'delete') {
        setFormData({
          name: item.name,
          description: item.description,
          price: item.price,
          durationDays: item.durationDays
        });
      }
      if (type === 'subscribe') {
        setSubscribeDate('');
      }
      if (type === 'services') {
        // fetch all services and services in this membership
        try {
          const [services, membershipServices] = await Promise.all([
            getServicesRequest({ page: 0, size: 999 }),
            getServicesByMembershipRequest(item.id)
          ]);
          setAllServices(services);
          setSelectedServices(membershipServices.map(s => s.id));
        } catch {
          toast.error('Не удалось загрузить список услуг');
        }
      }
    } else {
      setCurrent(null);
      setFormData({ name: '', description: '', price: '', durationDays: '' });
      setSubscribeDate('');
    }
  };

  const closeModal = () => setModalType(null);

  const handleSave = async () => {
    const result = MembershipSchema.safeParse(formData);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map(i => [i.path[0], i.message])));
      return;
    }
    try {
      if (modalType === 'create') await createMembershipRequest(formData);
      if (modalType === 'edit') await updateMembershipRequest(current.id, formData);
      if (modalType === 'delete') await deleteMembershipRequest(current.id);
      toast.success({
        create: 'Абонемент создан',
        edit: 'Абонемент обновлён',
        delete: 'Абонемент удалён'
      }[modalType]);
      closeModal();
      const data = await getMembershipsRequest({ page, size });
      setMemberships(data);
    } catch {
      toast.error('Ошибка операции');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelUserMembershipRequest(current.id);
      toast.success('Абонемент отменён');
      closeModal();
      const data = await getUserMembershipsRequest(userId);
      setUserMemberships(data);
    } catch {
      toast.error('Не удалось отменить');
    }
  };

  const handleSubscribe = async (startDate) => {
    try {
      await subscribeUserToMembershipRequest(userId, current.id, startDate);
      toast.success('Вы успешно подписались');
      closeModal();
      const data = await getUserMembershipsRequest(userId);
      setUserMemberships(data);
    } catch {
      toast.error('Не удалось подписаться');
    }
  };

  const handleSaveServices = async () => {
    try {
      await addServicesToMembershipRequest(current.id, selectedServices);
      toast.success('Услуги обновлены');
      closeModal();
      const data = await getMembershipsRequest({ page, size });
      setMemberships(data);
    } catch {
      toast.error('Не удалось сохранить услуги');
    }
  };

  const toggleService = id => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const today = new Date().toISOString().slice(0, 10);
  const activeMemberships = userMemberships.filter(
    um => um.expirationDate > today
  );

  return (
    <ContentBlock
      valueBlock={(
        <> ...

          {/* Все абонементы */}
          <h2 className="text-lg font-semibold mb-4">Абонементы</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {memberships.map(m => (
              <div key={m.id} className="relative flex flex-col bg-white border border-gray-200 rounded-xl p-4 shadow">
                <h3 className="text-lg font-bold text-gray-800">{m.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{m.description}</p>
                <div className="mt-2 flex justify-between items-center text-sm text-gray-800">
                  <span>{m.price} ₽</span>
                  <span>{m.durationDays} дн.</span>
                </div>
                {role === 'ADMIN' && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openModal('edit', m)} className="cursor-pointer text-gray-600 hover:text-gray-800"><FaEdit /></button>
                    <button onClick={() => openModal('delete', m)} className="cursor-pointer text-gray-600 hover:text-gray-800"><FaTrash /></button>
                    <button onClick={() => openModal('services', m)} className="cursor-pointer text-gray-600 hover:text-gray-800"><FaPlus /></button>
                  </div>
                )}
                {role !== 'ADMIN' && (
                  <button
                    onClick={() => openModal('subscribe', m)}
                    className="mt-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  >Подписаться</button>
                )}
              </div>
            ))}
          </div>

          {/* Модалка */}
          <Modal open={modalType !== null} onClose={closeModal}>
            <div className="text-center mb-4">
              {/* icon and title... */}
            </div>

            {modalType === 'services' ? (
  <div className="mb-4 text-left">
    <label className="block text-sm font-medium mb-1">Услуги абонемента</label>
    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
      {allServices.map(s => (
        <label key={s.id} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={selectedServices.includes(s.id)}
            onChange={() => toggleService(s.id)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">{s.name}</span>
        </label>
      ))}
    </div>
  </div>
) : modalType === 'subscribe' ? (
  <div className="mb-4 text-left">
    <label className="block text-sm font-medium mb-1">Дата начала</label>
    <input
      type="date"
      value={subscribeDate}
      onChange={e => setSubscribeDate(e.target.value)}
      className="w-full py-2 px-3 border border-gray-200 rounded-lg"
    />
  </div>
) : modalType !== 'delete' && modalType !== 'cancel' ? (
  <>
    {['name','description','price','durationDays'].map(field => (
      <div key={field} className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
        <input
          type="text"
          value={formData[field]}
          onChange={e => {
            setFormData(f => ({ ...f, [field]: e.target.value }));
            setErrors(prev => ({ ...prev, [field]: undefined }));
          }}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg"
        />
        {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
      </div>
    ))}
  </>
) : (
  <p className="text-center">Вы уверены?</p>
)}

<div className="flex gap-2 mt-6">
  <button
    onClick={closeModal}
    className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
  >
    Отмена
  </button>
  <button
    onClick={
      modalType === 'services'
        ? handleSaveServices
        : modalType === 'delete'
        ? handleSave
        : modalType === 'cancel'
        ? handleCancel
        : modalType === 'subscribe'
        ? () => handleSubscribe(subscribeDate)
        : handleSave
    }
    className="flex-1 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"
  >
    {{
      services: 'Сохранить',
      delete: 'Удалить',
      cancel: 'Отменить',
      subscribe: 'Подписаться'
    }[modalType] || 'Сохранить'}
  </button>
</div>

          </Modal>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    />
  );
}