import React, { useContext, useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import ContentBlock from '../components/ContentBlock';
import PageTitle from '../components/PageTitle';
import { AuthContext } from '../AuthContext';
import { ClubSchema } from '../schemas/clubSchema';
import { 
  getClubsRequest, 
  getClubRequest, 
  createClubRequest, 
  updateClubRequest, 
  deleteClubRequest 
} from '../services/clubService';
import Modal from '../components/Modal';
import ClubCard from '../components/ClubCard';
import Pagination from '../components/Pagination';
import { toast } from 'sonner';

export default function Clubs({ title }) {
  PageTitle(title);
  const { role } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [currentClub, setCurrentClub] = useState(null);
  const [formData, setFormData] = useState({ address: '', city: '' });
  const [errors, setErrors] = useState({});
  const size = 12;

  const openModal = async (type, club = null) => {
    setModalType(type);
    setErrors({});

    if ((type === 'edit' || type === 'delete') && club) {
      try {
        const full = await getClubRequest(club.id);
        setCurrentClub(full);
        setFormData({ address: full.address, city: full.city });
      } catch (e) {
        console.error(e);
        toast.error('Не удалось загрузить данные клуба');
        return;
      }
    } else {
      setCurrentClub(null);
      setFormData({ address: '', city: '' });
    }
  };

  const closeModal = () => setModalType(null);

  const handleSave = async () => {
    const result = ClubSchema.safeParse(formData);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map(i => [i.path[0], i.message])));
      return;
    }
    try {
      if (modalType === 'create') {
        await createClubRequest(formData);
        toast.success('Клуб успешно создан');
      }
      if (modalType === 'edit') {
        await updateClubRequest(currentClub.id, formData);
        toast.success('Клуб успешно обновлён');
      }
      if (modalType === 'delete') {
        await deleteClubRequest(currentClub.id);
        toast.success('Клуб успешно удалён');
      }
      closeModal();

      const data = await getClubsRequest({ page, size });
      setClubs(data);
      setTotalPages(Math.ceil(data.length / size));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || 'Ошибка операции');
    }
  };

  useEffect(() => {
    getClubsRequest({ page, size })
      .then(data => {
        setClubs(data);
        setTotalPages(Math.ceil(data.length / size));
      })
      .catch(console.error);
  }, [page]);

  return (
    <ContentBlock
      valueBlock={(
        <>
          {role === 'ADMIN' && (
            <div className="flex w-full gap-2 mb-5">
              <button
                type="button"
                className="flex-1 py-3 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800 text-gray-800 hover:border-gray-500 hover:text-gray-500 cursor-pointer"
                onClick={() => openModal('create')}
              >
                <FaPlus />
                Добавить клуб
              </button>
            </div>
          )}

          <Modal open={modalType !== null} onClose={closeModal}>
            <div className="text-center mb-4">
              {modalType === 'create' && <FaPlus size={32} className="mx-auto text-green-500" />}
              {modalType === 'edit' && <FaEdit size={32} className="mx-auto text-yellow-500" />}
              {modalType === 'delete' && <FaTrash size={32} className="mx-auto text-red-500" />}
              <h3 className="mt-2 text-lg font-bold text-gray-800">
                {modalType === 'create' && 'Создать клуб'}
                {modalType === 'edit' && 'Редактировать клуб'}
                {modalType === 'delete' && 'Удалить клуб?'}
              </h3>
            </div>

            {/* форма */}
            {modalType !== 'delete' ? (
              <>
                <label className="block text-sm font-medium mb-2">Адрес</label>
                <input
                  value={formData.address}
                  onChange={e => { setFormData(f => ({ ...f, address: e.target.value })); setErrors(prev => ({ ...prev, address: undefined })); }}
                  className="peer w-full py-2.5 px-4 border border-gray-200 rounded-lg mb-1 cursor-text"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                <label className="block text-sm font-medium mb-2 mt-4">Город</label>
                <input
                  value={formData.city}
                  onChange={e => { setFormData(f => ({ ...f, city: e.target.value })); setErrors(prev => ({ ...prev, city: undefined })); }}
                  className="peer w-full py-2.5 px-4 border border-gray-200 rounded-lg mb-1 cursor-text"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </>
            ) : (
              <p>Вы уверены, что хотите удалить этот клуб?</p>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className={`flex-1 py-2 text-sm font-medium rounded-lg text-white cursor-pointer ${
                  modalType === 'create'
                    ? 'bg-green-600 hover:bg-green-700'
                    : modalType === 'edit'
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {modalType === 'create'
                  ? 'Создать'
                  : modalType === 'edit'
                  ? 'Изменить'
                  : 'Удалить'}
              </button>
            </div>
          </Modal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {clubs.map(club => (
              <ClubCard
                key={club.id}
                id={club.id}
                address={club.address}
                city={club.city}
                onEdit={() => openModal('edit', club)}
                onDelete={() => openModal('delete', club)}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    />
  );
}